/* Optional free off-device backup to a secret Gist in the learner's own GitHub account.
   Every upload first downloads the cloud copy and merges it, so an empty or older browser
   can never wipe out saved progress. The token is kept apart from progress and never exported. */
(function () {
  'use strict';
  const CFG = 'tara-tagalog-sync';
  const FILE = 'tara-tagalog-backup.json';
  const API = 'https://api.github.com';
  let cfg = null, timer = null, busy = null, dirty = false;

  const readCfg = () => { try { return JSON.parse(localStorage.getItem(CFG)); } catch (e) { return null; } };
  const writeCfg = () => { try { cfg ? localStorage.setItem(CFG, JSON.stringify(cfg)) : localStorage.removeItem(CFG); } catch (e) {} };

  async function gh(path, token, opts = {}) {
    let res;
    try {
      res = await fetch(API + path, { ...opts, cache: 'no-store', headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + token, ...(opts.body ? { 'Content-Type': 'application/json' } : {}) } });
    } catch (e) { throw new Error('No connection to GitHub. Your progress is still saved on this device.'); }
    if (res.status === 401) throw new Error('GitHub rejected the token. It may be mistyped or expired. Create a new one and reconnect.');
    if (res.status === 403 || res.status === 429) throw new Error('GitHub refused the request. Check that the token has the “gist” permission, or try again later.');
    if (res.status === 404) throw new Error('The backup Gist was not found. Disconnect, then connect again.');
    if (!res.ok) throw new Error('GitHub error ' + res.status + '. Try again later.');
    return res.json();
  }

  async function readGist(id, token) {
    const g = await gh('/gists/' + id, token);
    const f = g.files && g.files[FILE];
    if (!f) throw new Error('The backup file is missing from the Gist. Nothing was overwritten.');
    let text = f.content;
    if (f.truncated) { const r = await fetch(f.raw_url, { cache: 'no-store' }); if (!r.ok) throw new Error('Could not download the full backup. Nothing was overwritten.'); text = await r.text(); }
    let data;
    try { data = JSON.parse(text); } catch (e) { throw new Error('The cloud backup is unreadable, so it was left untouched. See its revision history on gist.github.com.'); }
    if (!data || data.app !== 'tara-tagalog') throw new Error('That Gist does not contain a Tara backup. Nothing was overwritten.');
    return data;
  }

  const body = () => ({ files: { [FILE]: { content: JSON.stringify(Store.state) } } });

  async function findExisting(token) {
    for (let page = 1; page <= 10; page++) {
      const list = await gh('/gists?per_page=100&page=' + page, token);
      const hit = list.find(g => g.files && g.files[FILE]);
      if (hit) return hit.id;
      if (list.length < 100) break;
    }
    return null;
  }

  const Sync = {
    status: '', error: '', onChange: () => {},
    init() {
      cfg = readCfg();
      Store.listeners.push(() => this.schedule());
      window.addEventListener('online', () => this.now());
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && dirty) this.now(); });
      if (cfg) this.now();
    },
    connected() { return !!cfg; },
    info() { return cfg ? { last: cfg.last || 0, id: cfg.id } : null; },
    async connect(token) {
      token = token.trim();
      if (!token) throw new Error('Paste your token first.');
      let id = await findExisting(token), restored = false;
      if (id) {
        const remote = await readGist(id, token);
        Store.replace(Store.merge(Store.state, remote));
        await gh('/gists/' + id, token, { method: 'PATCH', body: JSON.stringify(body()) });
        restored = true;
      } else {
        const made = await gh('/gists', token, { method: 'POST', body: JSON.stringify({ description: 'Tara Tagalog progress backup', public: false, ...body() }) });
        id = made.id;
      }
      cfg = { token, id, last: Date.now() }; writeCfg(); this.error = ''; this.onChange();
      return { restored };
    },
    disconnect() { clearTimeout(timer); cfg = null; writeCfg(); this.error = ''; this.status = ''; dirty = false; this.onChange(); },
    schedule() { if (!cfg) return; dirty = true; clearTimeout(timer); timer = setTimeout(() => this.now(), 4000); },
    now() {
      if (!cfg) return Promise.resolve(false);
      if (busy) { dirty = true; return busy; }
      clearTimeout(timer);
      const mine = cfg;
      this.status = 'Backing up…'; this.onChange();
      busy = (async () => {
        try {
          dirty = false;
          const remote = await readGist(mine.id, mine.token);
          if (cfg !== mine) return false;
          Store.replace(Store.merge(Store.state, remote));
          await gh('/gists/' + mine.id, mine.token, { method: 'PATCH', body: JSON.stringify(body()) });
          if (cfg !== mine) return false;
          mine.last = Date.now(); writeCfg(); this.error = ''; return true;
        } catch (e) { dirty = true; this.error = e.message; return false; }
        finally { busy = null; this.status = ''; this.onChange(); if (cfg === mine && dirty && !this.error) this.schedule(); }
      })();
      return busy;
    },
  };
  window.Sync = Sync;
})();
