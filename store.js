/* Saving, merging, XP, streaks, review queue and badges. */
(function () {
  'use strict';
  const KEY = 'tara-tagalog-v1';
  const DEFAULT_SETTINGS = { name: '', goal: 50, sfx: true, autoplay: true, rate: 0.85, voice: '', theme: 'auto', textSize: 'm', listening: true, answerMode: 'bank', showPron: true, unlockAll: false };

  const pad = n => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const addDays = (key, n) => { const [y, m, d] = key.split('-').map(Number); return dayKey(new Date(y, m - 1, d + n)); };

  const blank = () => ({ app: 'tara-tagalog', v: 1, days: {}, lessons: {}, words: {}, review: {}, favs: {}, badges: {}, daily: {}, unitRewards: {}, flashDays: {}, cleared: 0, settings: { ...DEFAULT_SETTINGS }, settingsAt: 0, updatedAt: 0 });

  const isObj = x => x && typeof x === 'object' && !Array.isArray(x);
  const num = x => (Number.isFinite(+x) && +x > 0 ? +x : 0);
  const isDay = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x);
  const entries = o => (isObj(o) ? Object.entries(o).filter(([k]) => !['__proto__', 'constructor', 'prototype'].includes(k)) : []);

  /* Rebuild any loaded or imported data field by field, so a damaged or edited file cannot break the app. */
  function clean(raw) {
    const s = blank();
    if (!isObj(raw)) return s;
    for (const [k, d] of entries(raw.days)) if (isDay(k) && isObj(d)) s.days[k] = { xp: num(d.xp), secs: num(d.secs), correct: num(d.correct), total: num(d.total), goal: num(d.goal) };
    for (const [k, l] of entries(raw.lessons)) if (isObj(l)) s.lessons[k] = { times: num(l.times), best: Math.min(100, num(l.best)), first: isDay(l.first) ? l.first : dayKey() };
    for (const [k, w] of entries(raw.words)) if (isObj(w)) s.words[k] = { ok: num(w.ok), bad: num(w.bad) };
    for (const [k, r] of entries(raw.review)) if (isObj(r)) s.review[k] = { box: num(r.box), due: isDay(r.due) ? r.due : dayKey(), t: num(r.t), active: !!r.active };
    for (const [k, f] of entries(raw.favs)) if (isObj(f)) s.favs[k] = { on: !!f.on, t: num(f.t) };
    for (const name of ['badges', 'daily', 'unitRewards', 'flashDays']) for (const [k, v] of entries(raw[name])) if (isDay(v)) s[name][k] = v;
    s.cleared = num(raw.cleared);
    const rs = isObj(raw.settings) ? raw.settings : {};
    for (const k of Object.keys(DEFAULT_SETTINGS)) if (typeof rs[k] === typeof DEFAULT_SETTINGS[k]) s.settings[k] = rs[k];
    s.settings.name = s.settings.name.slice(0, 30);
    s.settingsAt = num(raw.settingsAt);
    s.updatedAt = num(raw.updatedAt);
    return s;
  }

  /* Combine two copies of progress. Nothing earned in either copy is dropped. */
  function merge(a, b) {
    a = clean(a); b = clean(b);
    const out = blank();
    const both = (name, pick) => { for (const k of new Set([...Object.keys(a[name]), ...Object.keys(b[name])])) { const x = a[name][k], y = b[name][k]; out[name][k] = x && y ? pick(x, y) : (x || y); } };
    const maxFields = (x, y) => { const r = {}; for (const f in x) r[f] = Math.max(x[f], y[f]); return r; };
    both('days', maxFields);
    both('words', maxFields);
    both('lessons', (x, y) => ({ times: Math.max(x.times, y.times), best: Math.max(x.best, y.best), first: x.first < y.first ? x.first : y.first }));
    both('review', (x, y) => (x.t >= y.t ? x : y));
    both('favs', (x, y) => (x.t >= y.t ? x : y));
    for (const n of ['badges', 'daily', 'unitRewards', 'flashDays']) both(n, (x, y) => (x < y ? x : y));
    out.cleared = Math.max(a.cleared, b.cleared);
    const newer = a.settingsAt >= b.settingsAt ? a : b;
    out.settings = { ...newer.settings }; out.settingsAt = newer.settingsAt;
    out.updatedAt = Math.max(a.updatedAt, b.updatedAt);
    return out;
  }

  const Store = {
    state: blank(), saveError: false, corrupt: false, listeners: [],
    dayKey, addDays, clean, merge, blank,
    load() {
      let text = null;
      try { text = localStorage.getItem(KEY); } catch (e) { this.saveError = true; }
      if (text) {
        try { this.state = clean(JSON.parse(text)); }
        catch (e) { this.corrupt = true; try { localStorage.setItem(KEY + '-damaged', text); } catch (_) {} }
      }
    },
    save(silent) {
      this.state.updatedAt = Date.now();
      this.persist();
      if (!silent) this.listeners.forEach(f => f());
    },
    persist() {
      try { localStorage.setItem(KEY, JSON.stringify(this.state)); this.saveError = false; }
      catch (e) { this.saveError = true; }
    },
    replace(next) { this.state = clean(next); this.persist(); },
    reset() { this.state = blank(); this.persist(); },
    hasProgress() { return this.totalXP() > 0 || Object.keys(this.state.lessons).length > 0; },

    day(k = dayKey()) { return this.state.days[k] || (this.state.days[k] = { xp: 0, secs: 0, correct: 0, total: 0, goal: this.state.settings.goal }); },
    totalXP() { return Object.values(this.state.days).reduce((n, d) => n + d.xp, 0); },
    sum(field) { return Object.values(this.state.days).reduce((n, d) => n + d[field], 0); },
    addXP(n) { const d = this.day(); d.xp += n; d.goal = this.state.settings.goal; this.save(); },
    todayXP() { return (this.state.days[dayKey()] || { xp: 0 }).xp; },
    accuracy() { const t = this.sum('total'); return t ? Math.round((100 * this.sum('correct')) / t) : null; },

    /* A streak day is any day with at least 1 XP. Today not being done yet does not break it. */
    streak() {
      const has = k => (this.state.days[k] || {}).xp > 0;
      let k = dayKey(); if (!has(k)) k = addDays(k, -1);
      let n = 0; while (has(k)) { n++; k = addDays(k, -1); }
      return n;
    },
    bestStreak() {
      const keys = Object.keys(this.state.days).filter(k => this.state.days[k].xp > 0).sort();
      let best = 0, run = 0, prev = null;
      for (const k of keys) { run = prev && addDays(prev, 1) === k ? run + 1 : 1; best = Math.max(best, run); prev = k; }
      return best;
    },

    /* Level L starts at 50 * L * (L-1) XP: 0, 100, 300, 600, 1000 ... */
    level(xp = this.totalXP()) {
      let L = 1; while (xp >= 50 * (L + 1) * L) L++;
      const start = 50 * L * (L - 1), next = 50 * (L + 1) * L;
      return { level: L, start, next, pct: Math.round((100 * (xp - start)) / (next - start)) };
    },

    answer(key, wordKey, correct) {
      const d = this.day(); d.total++; if (correct) d.correct++;
      if (wordKey) { const w = this.state.words[wordKey] || (this.state.words[wordKey] = { ok: 0, bad: 0 }); correct ? w.ok++ : w.bad++; }
      if (key) {
        const r = this.state.review[key];
        if (!correct) this.state.review[key] = { box: 0, due: dayKey(), t: Date.now(), active: true };
        else if (r && r.active && r.due <= dayKey()) {
          r.box++; r.t = Date.now();
          if (r.box >= 3) { r.active = false; this.state.cleared++; } else r.due = addDays(dayKey(), [0, 1, 3][r.box]);
        }
      }
      this.save();
    },
    reviewKeys(dueOnly) {
      return Object.entries(this.state.review).filter(([, r]) => r.active && (!dueOnly || r.due <= dayKey())).sort((a, b) => (a[1].due < b[1].due ? -1 : 1)).map(([k]) => k);
    },
    isFav(w) { return !!(this.state.favs[w] && this.state.favs[w].on); },
    toggleFav(w) { this.state.favs[w] = { on: !this.isFav(w), t: Date.now() }; this.save(); },
    setSetting(k, v) { this.state.settings[k] = v; this.state.settingsAt = Date.now(); this.save(); },
  };
  window.Store = Store;
})();
