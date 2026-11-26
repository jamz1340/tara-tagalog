/* Screens and interaction. All clicks go through one listener using data-act attributes. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const { LESSONS, BY_ID, WORDS, WORD_BY, ITEMS, shuffle } = Ex;
  const S = () => Store.state;
  const set = () => S().settings;
  let view = 'home', session = null, unitOpen = null;
  const ui = { q: '', cat: 'All', calOffset: 0, limit: 40 };

  /* ---------- artwork ---------- */
  const mascot = (mood = 'happy', cls = '') => `<svg class="mascot ${cls}" viewBox="0 0 120 120" role="img" aria-label="Tala the tarsier">
    <ellipse cx="22" cy="40" rx="17" ry="20" fill="#c9a183"/><ellipse cx="23" cy="41" rx="9" ry="12" fill="#f3bcc0"/>
    <ellipse cx="98" cy="40" rx="17" ry="20" fill="#c9a183"/><ellipse cx="97" cy="41" rx="9" ry="12" fill="#f3bcc0"/>
    <ellipse cx="60" cy="66" rx="44" ry="40" fill="#d8b394"/><ellipse cx="60" cy="79" rx="30" ry="25" fill="#f8e8d6"/>
    <circle cx="42" cy="60" r="18" fill="#fffaf2"/><circle cx="78" cy="60" r="18" fill="#fffaf2"/>
    ${mood === 'cheer' ? '<path d="M31 63q11-15 22 0M67 63q11-15 22 0" stroke="#4a2f35" stroke-width="5" fill="none" stroke-linecap="round"/>' : `<circle cx="43" cy="${mood === 'oops' ? 65 : 61}" r="11" fill="#4a2f35"/><circle cx="77" cy="${mood === 'oops' ? 65 : 61}" r="11" fill="#4a2f35"/><circle cx="47" cy="56" r="4" fill="#fff"/><circle cx="81" cy="56" r="4" fill="#fff"/>`}
    <path d="M56 78h8l-4 5z" fill="#8a5a55"/><path d="${mood === 'oops' ? 'M52 92q8-6 16 0' : 'M50 87q10 10 20 0'}" stroke="#8a5a55" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="29" cy="82" rx="7" ry="4" fill="#f3a9b0" opacity=".7"/><ellipse cx="91" cy="82" rx="7" ry="4" fill="#f3a9b0" opacity=".7"/>
    <g transform="translate(88 24)">${[0, 72, 144, 216, 288].map(a => `<ellipse cy="-9" rx="6" ry="9" fill="#fff" stroke="#e8cfd0" transform="rotate(${a})"/>`).join('')}<circle r="5" fill="#f6cf62"/></g></svg>`;

  const ICONS = {
    home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10', learn: 'M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v14',
    vocab: 'M4 4h16v13H9l-5 4zM8 9h8M8 13h5', practice: 'M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12', progress: 'M4 20V11M10 20V4M16 20v-7M22 20H2',
    settings: 'M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6', speaker: 'M4 9v6h4l5 4V5L8 9zM16 9q3 3 0 6M18.5 6.5q6 5.500 0 11', close: 'M6 6l12 12M18 6L6 18', lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5z', check: 'M4 13l5 5L20 6',
  };
  const icon = n => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`;
  const say = (text, label) => `<button class="say" data-act="say" data-text="${esc(text)}" aria-label="Play ${esc(label || text)}">${icon('speaker')}</button>`;
  const slowBtn = text => `<button class="say slow" data-act="say" data-slow="1" data-text="${esc(text)}" aria-label="Play slowly">slow</button>`;
  const bar = (pct, label) => `<div class="bar" role="progressbar" aria-label="${esc(label || 'Progress')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;
  const pron = p => (set().showPron && p ? `<span class="pron">${esc(p)}</span>` : '');

  /* ---------- course state ---------- */
  const done = id => !!(S().lessons[id] && S().lessons[id].times);
  const unlocked = id => { const i = LESSONS.findIndex(l => l.id === id); return set().unlockAll || i === 0 || done(id) || done(LESSONS[i - 1].id); };
  const nextLesson = () => LESSONS.find(l => !done(l.id)) || null;
  const unitDone = u => u.lessons.filter(l => done(l.id)).length;
  const learnedWords = () => WORDS.filter(w => LESSONS.some(l => done(l.id) && l.words.some(x => x.key === w.key)));
  const reviewCount = due => Store.reviewKeys(due).filter(k => ITEMS[k]).length;

  const BADGES = [
    ['first', '🌱', 'First steps', 'Finish your first lesson', () => LESSONS.some(l => done(l.id))],
    ['five', '📚', 'Bookworm', 'Finish 5 lessons', () => LESSONS.filter(l => done(l.id)).length >= 5],
    ['fifteen', '🎒', 'Committed', 'Finish 15 lessons', () => LESSONS.filter(l => done(l.id)).length >= 15],
    ['all', '🏆', 'Course complete', 'Finish every lesson', () => LESSONS.every(l => done(l.id))],
    ['perfect', '💯', 'Walang mali', 'Finish a lesson with no mistakes', () => Object.values(S().lessons).some(l => l.best === 100)],
    ['s3', '🔥', 'Warming up', '3-day streak', () => Store.bestStreak() >= 3],
    ['s7', '🌟', 'One whole week', '7-day streak', () => Store.bestStreak() >= 7],
    ['s30', '👑', 'A month strong', '30-day streak', () => Store.bestStreak() >= 30],
    ['x100', '✨', '100 XP', 'Earn 100 XP', () => Store.totalXP() >= 100],
    ['x500', '💫', '500 XP', 'Earn 500 XP', () => Store.totalXP() >= 500],
    ['x2000', '🌠', '2,000 XP', 'Earn 2,000 XP', () => Store.totalXP() >= 2000],
    ['w50', '🗣️', '50 words', 'Learn 50 words', () => learnedWords().length >= 50],
    ['w150', '🧠', '150 words', 'Learn 150 words', () => learnedWords().length >= 150],
    ['fav', '💗', 'Collector', 'Save 10 favourites', () => Object.values(S().favs).filter(f => f.on).length >= 10],
    ['daily', '☀️', 'Daily challenger', 'Finish a daily challenge', () => Object.keys(S().daily).length > 0],
    ['fix', '🩹', 'Second chances', 'Master 10 missed items', () => S().cleared >= 10],
    ...COURSE.map(u => ['unit-' + u.id, u.icon, u.title, 'Complete the unit “' + u.title + '”', () => unitDone(u) === u.lessons.length]),
  ];
  function awardBadges() {
    const fresh = [];
    for (const b of BADGES) if (!S().badges[b[0]] && b[4]()) { S().badges[b[0]] = Store.dayKey(); fresh.push(b); }
    if (fresh.length) Store.save();
    return fresh;
  }

  /* ---------- shared chrome ---------- */
  const NAV = [['home', 'Home'], ['learn', 'Learn'], ['vocab', 'Vocabulary'], ['practice', 'Practice'], ['progress', 'Progress'], ['settings', 'Settings']];
  function renderNav() {
    $('#nav').innerHTML = `<div class="brand">${mascot('happy', 'tiny')}<b>Tara<span>Tagalog</span></b></div>` + NAV.map(([id, name]) => `<button data-act="go" data-view="${id}" ${view === id ? 'aria-current="page"' : ''}>${icon(id)}<span>${name}</span></button>`).join('');
  }
  let toastTimer;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 4200); }
  let modalYes = null;
  function confirmBox(title, text, yes, fn, danger) {
    modalYes = fn;
    $('#modal').innerHTML = `<div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="mt"><h2 id="mt">${esc(title)}</h2><p>${esc(text)}</p><div class="row"><button class="btn ghost" data-act="modal-no">Cancel</button><button class="btn ${danger ? 'danger' : ''}" data-act="modal-yes">${esc(yes)}</button></div></div>`;
    $('#modal').hidden = false; $('#modal [data-act="modal-no"]').focus();
  }
  function applyPrefs() {
    const r = document.documentElement, s = set();
    if (s.theme === 'auto') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', s.theme);
    r.setAttribute('data-size', s.textSize);
    const dark = s.theme === 'dark' || (s.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    $('meta[name="theme-color"]').setAttribute('content', dark ? '#211b26' : '#fff8ee');
  }
  function voiceNote() {
    if (!Speech.supported) return `<p class="note warn">This browser has no speech feature, so audio buttons can’t play. Listening exercises are replaced with reading ones.</p>`;
    if (!Speech.filipino().length) return `<p class="note warn">No Filipino/Tagalog voice was found on this device yet. Audio may use another language’s voice and mispronounce words. Trust the stress guide and real speakers over it. See Settings → Audio.</p>`;
    return '';
  }
  const audioDisclaimer = '<p class="fine">Audio is computer-generated by your device. It is not a recording of a native speaker.</p>';

  /* ---------- Home ---------- */
  function backupNudge() {
    if (Sync.connected()) return Sync.error ? `<div class="card warnbox"><b>Cloud backup needs attention</b><p>${esc(Sync.error)}</p><button class="btn small" data-act="go" data-view="settings">Open Settings</button></div>` : '';
    if (!Store.hasProgress()) return `<div class="card quiet"><b>Used Tara before?</b><p>Bring your progress back from a cloud backup or backup file.</p><button class="btn small ghost" data-act="go" data-view="settings">Restore progress</button></div>`;
    let last = 0; try { last = +localStorage.getItem('tara-tagalog-exported') || 0; } catch (e) {}
    if (Date.now() - last < 7 * 864e5) return '';
    return `<div class="card warnbox"><b>Your progress is only on this device</b><p>Clearing browser data would erase it. Turn on free cloud backup, or save a backup file.</p><button class="btn small" data-act="go" data-view="settings">Protect my progress</button></div>`;
  }
  function courseMap() {
    const next = nextLesson();
    return `<section class="map" aria-label="Course map">${COURSE.map((u, ui_) => `<div class="mapunit u${ui_ % 4}"><div class="mapbanner"><span class="big">${u.icon}</span><div><small>Unit ${ui_ + 1} · ${unitDone(u)}/${u.lessons.length}</small><h3>${esc(u.title)}</h3><em>${esc(u.tl)}</em></div></div><ol>${u.lessons.map((l, i) => {
      const state = done(l.id) ? 'done' : next && next.id === l.id ? 'now' : unlocked(l.id) ? 'open' : 'locked';
      return `<li style="--x:${[0, 46, 70, 46, 0, -46, -70, -46][i % 8]}px"><button class="node ${state}" data-act="lesson" data-id="${l.id}" aria-label="${esc(l.title)}, ${state}">${state === 'done' ? icon('check') : state === 'locked' ? icon('lock') : '<b>' + (i + 1) + '</b>'}</button><span>${esc(l.title)}</span></li>`;
    }).join('')}</ol></div>`).join('')}</section>`;
  }
  function vHome() {
    const lv = Store.level(), next = nextLesson(), xp = Store.todayXP(), goal = set().goal, pct = Math.min(100, (100 * xp) / goal);
    const due = reviewCount(true), dailyDone = !!S().daily[Store.dayKey()];
    const unit = next ? next.unit : COURSE[COURSE.length - 1];
    const rec = due >= 5 ? { t: 'Review your tricky items', d: due + ' items are ready for another try.', a: 'data-act="practice" data-mode="mistakes"', b: 'Start review' }
      : next ? { t: next.title, d: next.unit.title + ' · ' + next.words.length + ' words' + (next.g ? ' · grammar: ' + next.g.t : ''), a: `data-act="lesson" data-id="${next.id}"`, b: 'Preview lesson' }
        : { t: 'Keep it fresh', d: 'You finished the course. Try the daily challenge.', a: 'data-act="practice" data-mode="daily"', b: 'Daily challenge' };
    return `<header class="hero">${mascot(xp >= goal ? 'cheer' : 'happy')}<div><h1>Kumusta${set().name ? ', ' + esc(set().name) : ''}!</h1><p>${Store.hasProgress() ? (xp >= goal ? 'Goal reached today. Ang galing mo!' : 'Ready for a little Tagalog?') : 'I’m Tala. Let’s learn Tagalog from your very first word.'}</p></div></header>
    <div class="stats three"><div class="stat flame"><b>🔥 ${Store.streak()}</b><span>day streak</span></div><div class="stat"><b>⭐ ${Store.totalXP()}</b><span>total XP</span></div><div class="stat"><b>Level ${lv.level}</b><span>${esc(unit.title)}</span></div></div>
    <div class="card goal"><div class="ring" style="--p:${pct}"><span>${Math.round(pct)}%</span></div><div class="grow"><h2>Daily goal</h2><p>${xp} of ${goal} XP today</p>${bar(lv.pct, 'Level progress')}<small>${lv.next - Store.totalXP()} XP to level ${lv.level + 1}</small></div></div>
    <button class="btn wide" data-act="${next ? 'start' : 'practice'}" ${next ? `data-id="${next.id}"` : 'data-mode="daily"'}>${Store.hasProgress() ? 'Continue learning' : 'Start your first lesson'}</button>
    <div class="card rec"><small>Recommended for today</small><h2>${esc(rec.t)}</h2><p>${esc(rec.d)}</p><button class="btn small" ${rec.a}>${rec.b}</button></div>
    <div class="card daily"><div><h2>☀️ Daily review challenge</h2><p>${dailyDone ? 'Done for today. Come back tomorrow.' : '12 mixed questions · 30 bonus XP'}</p></div><button class="btn small ${dailyDone ? 'ghost' : ''}" data-act="practice" data-mode="daily">${dailyDone ? 'Practice again' : 'Play'}</button></div>
    ${backupNudge()}
    <h2 class="section">Your journey</h2>${courseMap()}`;
  }

  /* ---------- Learn ---------- */
  function vLearn() {
    if (unitOpen === null) unitOpen = (nextLesson() || LESSONS[0]).unit.id;
    return `<h1>Learn</h1><p class="lead">Eight units, ${LESSONS.length} lessons. Go in order, or unlock everything in Settings.</p>` + COURSE.map((u, i) => {
      const n = unitDone(u), open = unitOpen === u.id;
      return `<section class="card unit u${i % 4}"><button class="unithead" data-act="unit" data-id="${u.id}" aria-expanded="${open}"><span class="big">${u.icon}</span><span class="grow"><small>Unit ${i + 1}${n === u.lessons.length ? ' · 🏅 complete' : ''}</small><b>${esc(u.title)}</b>${bar((100 * n) / u.lessons.length, u.title)}</span><span class="count">${n}/${u.lessons.length}</span></button>
      ${open ? '<ul class="lessons">' + u.lessons.map(l => `<li><button data-act="lesson" data-id="${l.id}" class="${unlocked(l.id) ? '' : 'locked'}"><span class="dot">${done(l.id) ? icon('check') : unlocked(l.id) ? '▶' : icon('lock')}</span><span class="grow"><b>${esc(l.title)}</b><small>${l.words.length} words · ${Ex.lessonExercises(l.id).length} exercises${l.g ? ' · grammar' : ''}${done(l.id) ? ' · best ' + S().lessons[l.id].best + '%' : ''}</small></span></button></li>`).join('') + '</ul>' : ''}</section>`;
    }).join('');
  }
  function grammarHTML(g, withQuiz) {
    return `<article class="grammar"><h3>${esc(g.t)}</h3>${g.x.map(p => `<p>${esc(p)}</p>`).join('')}
    <h4>Examples</h4><ul class="examples">${g.e.map(e => `<li>${say(e[0].replace(/→/g, ','))}<div><b lang="fil">${esc(e[0])}</b><span>${esc(e[1])}</span><small>Why: ${esc(e[2])}</small></div></li>`).join('')}</ul>
    <h4>Compared with English</h4><p>${esc(g.cmp)}</p>
    <h4>Common beginner mistakes</h4><ul class="mistakes">${g.m.map(m => `<li><s>${esc(m[0])}</s> → <b>${esc(m[1])}</b><small>${esc(m[2])}</small></li>`).join('')}</ul>${withQuiz ? `<button class="btn small" data-act="grammar-quiz" data-id="${withQuiz}">Try a practice question</button>` : ''}</article>`;
  }
  function vLesson(id) {
    const l = BY_ID[id];
    return `<button class="back" data-act="go" data-view="learn">← All units</button><small class="eyebrow">${esc(l.unit.title)}</small><h1>${esc(l.title)}</h1>
    ${unlocked(id) ? `<button class="btn wide" data-act="start" data-id="${id}">${done(id) ? 'Practice this lesson again' : 'Start lesson'}</button>` : '<p class="note warn">This lesson is locked. Finish the one before it, or turn on “Unlock all lessons” in Settings. You can still read the notes below.</p>'}
    ${voiceNote()}${l.g ? '<div class="card">' + grammarHTML(l.g, id) + '</div>' : ''}<h2 class="section">New words</h2><div class="wordlist">${l.words.map(wordCard).join('')}</div>${audioDisclaimer}`;
  }

  /* ---------- Vocabulary ---------- */
  function wordCard(w) {
    const rows = [['Literally', w.lit], ['In conversation', w.use], ['Register', w.reg], ['Note', w.note]].filter(r => r[1]);
    return `<article class="card word"><div class="wordtop">${say(w.tl)}<div class="grow"><h3 lang="fil">${esc(w.tl)}</h3>${pron(w.pron)}<p>${esc(w.en)}</p></div><button class="fav ${Store.isFav(w.key) ? 'on' : ''}" data-act="fav" data-key="${esc(w.key)}" aria-pressed="${Store.isFav(w.key)}" aria-label="Favourite ${esc(w.tl)}">♥</button></div>
    <div class="example">${say(w.ex, 'example')}<div><b lang="fil">${esc(w.ex)}</b><span>${esc(w.exEn)}</span></div></div>
    ${rows.length ? '<dl>' + rows.map(r => `<dt>${r[0]}</dt><dd>${esc(r[1])}</dd>`).join('') + '</dl>' : ''}<span class="chip static">${esc(w.cat)}</span></article>`;
  }
  const strip = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '');
  function vocabResults() {
    const q = strip(ui.q.trim());
    const list = WORDS.filter(w => (ui.cat === 'All' || (ui.cat === '♥ Favourites' ? Store.isFav(w.key) : w.cat === ui.cat)) && (!q || strip([w.tl, w.en, w.ex, w.exEn].join(' ')).includes(q)));
    if (q) { const rank = w => (strip(w.tl) === q || strip(w.en) === q ? 0 : strip(w.tl).startsWith(q) || strip(w.en).startsWith(q) ? 1 : strip(w.tl + ' ' + w.en).includes(q) ? 2 : 3); list.sort((a, b) => rank(a) - rank(b)); }
    if (!list.length) return `<div class="empty">${mascot('oops', 'small')}<p>${ui.cat === '♥ Favourites' && !q ? 'No favourites yet. Tap the heart on any word to save it here.' : 'No words match. Try a shorter search or the “All” category.'}</p></div>`;
    return `<p class="fine">${list.length} ${list.length === 1 ? 'entry' : 'entries'}</p><div class="wordlist">${list.slice(0, ui.limit).map(wordCard).join('')}</div>${list.length > ui.limit ? '<button class="btn ghost wide" data-act="more">Show more</button>' : ''}`;
  }
  function vVocab() {
    const cats = ['All', '♥ Favourites', ...[...new Set(WORDS.map(w => w.cat))].sort()];
    return `<h1>Vocabulary</h1><input id="search" type="search" placeholder="Search Tagalog or English" aria-label="Search vocabulary" value="${esc(ui.q)}" autocomplete="off" autocorrect="off" autocapitalize="off">
    <div class="chips">${cats.map(c => `<button class="chip ${ui.cat === c ? 'on' : ''}" data-act="cat" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    <details class="card"><summary>How to read the pronunciation guide</summary><p>CAPITALS show the stressed syllable. Vowels stay steady: <b>a</b> as in “father”, <b>e</b> as in “bet”, <b>i</b> like “ee” (often shorter), <b>o</b> as in “or” without the r, <b>u</b> like “oo”.</p><p><b>ng</b> is one sound, as in “singer”, even at the start of a word. <b>ng</b> on its own is said “nang”, and <b>mga</b> is “ma-NGA”.</p><p>Vowels side by side are said separately: <i>oo</i> is “o-o”. Many words also end in a short catch in the throat (a glottal stop) that spelling and this guide don’t always show. The guides are approximate, so copy real speakers where you can.</p></details>
    ${audioDisclaimer}<div id="results">${vocabResults()}</div>`;
  }

  /* ---------- Practice ---------- */
  const poolLessons = () => { const d = LESSONS.filter(l => done(l.id)); return d.length ? d : [LESSONS[0]]; };
  function vPractice() {
    const due = reviewCount(true), all = reviewCount(false);
    const card = (mode, emoji, t, d, off) => `<button class="card tile" data-act="practice" data-mode="${mode}" ${off ? 'disabled' : ''}><span class="big">${emoji}</span><b>${t}</b><small>${d}</small></button>`;
    return `<h1>Practice</h1><p class="lead">${LESSONS.some(l => done(l.id)) ? 'Drawn from the lessons you have finished.' : 'Until you finish a lesson, practice uses Unit 1, Lesson 1.'}</p>
    <div class="tiles">${card('daily', '☀️', 'Daily challenge', S().daily[Store.dayKey()] ? 'Bonus earned today' : '30 bonus XP')}${card('mistakes', '🩹', 'Review mistakes', all ? due + ' due now · ' + all + ' in total' : 'Nothing to review yet', !all)}${card('flash', '🃏', 'Flashcards', 'Words you’ve learned')}${card('flashfav', '💗', 'Favourite cards', 'Your saved words', !Object.values(S().favs).some(f => f.on))}${card('listen', '🎧', 'Listening', Speech.supported && set().listening ? 'Hear it and choose' : 'Turned off or unsupported', !(Speech.supported && set().listening))}${card('match', '🧩', 'Matching', 'Pair words and meanings')}${card('convo', '💬', 'Conversations', 'Choose the best reply')}${card('grammarmix', '🌱', 'Grammar drill', 'Quick checks from the grammar notes')}</div>
    <h2 class="section">Grammar guide</h2><p class="lead">Every explanation in one place.</p>${LESSONS.filter(l => l.g).map(l => `<details class="card"><summary>${esc(l.g.t)} <small>${esc(l.unit.title)}</small></summary>${grammarHTML(l.g, l.id)}</details>`).join('')}`;
  }
  function startPractice(mode) {
    const pool = poolLessons(), listening = Speech.supported && set().listening;
    const lw = () => shuffle(pool.flatMap(l => l.words.map(w => [l, w])));
    let items = [], title = '';
    if (mode === 'flash' || mode === 'flashfav') {
      let words = mode === 'flashfav' ? WORDS.filter(w => Store.isFav(w.key)) : learnedWords();
      if (!words.length) words = LESSONS[0].words;
      return begin({ mode: 'flash', title: 'Flashcards', queue: shuffle(words).slice(0, 15).map(w => ({ type: 'card', word: w })) });
    }
    if (mode === 'mistakes') {
      const due = Store.reviewKeys(true), keys = (due.length ? due : Store.reviewKeys(false)).filter(k => ITEMS[k]).slice(0, 12);
      items = keys.map(k => Ex.fromKey(k, listening)); title = 'Review';
    } else if (mode === 'daily') {
      const keys = Store.reviewKeys(true).filter(k => ITEMS[k]).slice(0, 6);
      const rest = shuffle(Object.keys(ITEMS).filter(k => !keys.includes(k) && pool.includes(ITEMS[k].lesson)));
      items = shuffle([...keys, ...rest.slice(0, 12 - keys.length)]).map(k => Ex.fromKey(k, listening)); title = 'Daily challenge';
    } else if (mode === 'listen') { items = lw().slice(0, 10).map(([l, w], i) => (i % 3 === 2 ? Ex.make.listenSentence(l, shuffle(l.s)[0]) : Ex.make.listenWord(l, w))); title = 'Listening'; }
    else if (mode === 'match') { items = [0, 1, 2, 3].map(() => { const l = shuffle(pool)[0]; return Ex.make.match(l, l.words); }); title = 'Matching'; }
    else if (mode === 'convo') { items = shuffle(pool.flatMap(l => l.c.map(c => Ex.make.convo(l, c)))).slice(0, 8); title = 'Conversations'; }
    else if (mode === 'grammarmix') { let g = pool.filter(l => l.g); if (!g.length) g = LESSONS.filter(l => l.g).slice(0, 3); items = shuffle([...g.map(l => Ex.make.grammar(l)), ...shuffle(g.flatMap(l => l.b.map(b => Ex.make.blank(l, b)))).slice(0, 5)]).slice(0, 10); title = 'Grammar drill'; }
    if (!items.length) return toast('Nothing to practise here yet.');
    begin({ mode, title, queue: items });
  }

  /* ---------- Lesson player ---------- */
  function begin(opts) {
    const graded = opts.queue.filter(x => x.type !== 'card' && x.type !== 'teach' && x.type !== 'note').length;
    session = { ...opts, i: 0, graded, total: opts.queue.length, firstRight: 0, xp: 0, st: null, startXP: Store.totalXP(), startLevel: Store.level().level, goalBefore: Store.todayXP() >= set().goal };
    document.body.classList.add('playing'); $('#player').hidden = false;
    renderStep(true);
  }
  function startLesson(id) {
    const l = BY_ID[id];
    if (!unlocked(id)) { openLesson(id); return; }
    const intro = done(id) ? [] : [...(l.g ? [{ type: 'note', g: l.g }] : []), ...l.words.map(w => ({ type: 'teach', word: w }))];
    begin({ mode: 'lesson', id, title: l.title, queue: [...intro, ...Ex.lessonExercises(id, { listening: Speech.supported && set().listening })] });
  }
  function quit() { session = null; Speech.stop(); $('#player').hidden = true; document.body.classList.remove('playing'); render(); }
  const cur = () => session.queue[session.i];

  function renderStep(fresh) {
    const ex = cur();
    if (fresh) session.st = { picked: null, typed: '', built: [], result: null, tries: 0, flipped: false, shown: false, sel: null, matched: [], missed: [], wrong: null, bank: set().answerMode === 'bank' };
    const st = session.st;
    let body = '', foot = '';
    if (ex.type === 'note') { body = `<p class="ask">New idea</p><div class="card">${grammarHTML(ex.g)}</div>`; foot = '<button class="btn wide" data-act="next">Got it</button>'; }
    else if (ex.type === 'teach') { body = `<p class="ask">New word. Listen and say it out loud.</p>${wordCard(ex.word)}`; foot = '<button class="btn wide" data-act="next">Next</button>'; }
    else if (ex.type === 'card') {
      const w = ex.word;
      body = `<p class="ask">${st.flipped ? 'Did you know it?' : 'What does it mean? Think, then flip.'}</p><div class="flash ${st.flipped ? 'flipped' : ''}">${say(w.tl)}<h2 lang="fil">${esc(w.tl)}</h2>${pron(w.pron)}${st.flipped ? `<p class="meaning">${esc(w.en)}</p><div class="example">${say(w.ex, 'example')}<div><b lang="fil">${esc(w.ex)}</b><span>${esc(w.exEn)}</span></div></div>` : ''}</div>`;
      foot = st.flipped ? '<div class="row"><button class="btn ghost" data-act="card" data-ok="0">Study again</button><button class="btn" data-act="card" data-ok="1">I knew it</button></div>' : '<button class="btn wide" data-act="flip">Show answer</button>';
    } else {
      body = `<small class="eyebrow">${ex.label}</small><p class="ask">${esc(ex.ask)}</p>`;
      if (ex.listen) {
        body += `<div class="listenbox"><button class="say huge" data-act="say" data-text="${esc(ex.say)}" aria-label="Play audio">${icon('speaker')}</button>${slowBtn(ex.say)}</div>${st.shown ? `<p class="prompt">“${esc(ex.say)}”</p>` : st.result ? '' : '<button class="link" data-act="reveal">Can’t listen? Show the text (earns less XP)</button>'}${voiceNote()}`;
      } else if (ex.convo) {
        const c = ex.convo;
        body += `<p class="setting">${esc(c.setting)}</p><div class="bubble">${say(c.line)}<div><small>${esc(c.who)}</small><b lang="fil">${esc(c.line)}</b><details><summary>Show English</summary>${esc(c.en)}</details></div></div>`;
      } else if (ex.prompt) body += `<div class="promptrow">${ex.say ? say(ex.say) + slowBtn(ex.say) : ''}<p class="prompt">${esc(ex.prompt)}</p></div>${ex.sub ? `<p class="sub">${esc(ex.sub)}</p>` : ''}`;
      const locked = !!st.result;
      if (ex.type === 'choice') body += `<div class="options">${ex.options.map((o, i) => `<button class="option ${st.picked === o ? 'picked' : ''} ${locked && st.picked === o ? (st.result.ok ? 'right' : 'wrong') : ''}" data-act="pick" data-i="${i}" ${locked ? 'disabled' : ''} aria-pressed="${st.picked === o}"><kbd>${i + 1}</kbd><span ${ex.lang === 'tl' ? 'lang="fil"' : ''}>${esc(o)}</span></button>`).join('')}</div>`;
      if (ex.type === 'arrange' || (ex.type === 'type' && st.bank)) {
        const tiles = ex.type === 'arrange' ? ex.tiles : bankFor(ex);
        body += `<div class="answerline" aria-label="Your answer">${st.built.map((t, i) => `<button class="tilew" data-act="unbuild" data-i="${i}" ${locked ? 'disabled' : ''}>${esc(tiles[t])}</button>`).join('') || '<span>Tap words below</span>'}</div><div class="bank">${tiles.map((t, i) => `<button class="tilew" data-act="build" data-i="${i}" ${st.built.includes(i) || locked ? 'disabled' : ''}>${esc(t)}</button>`).join('')}</div>`;
      } else if (ex.type === 'type') body += `<textarea id="typed" rows="2" aria-label="Your translation" placeholder="Type in ${ex.toTl ? 'Tagalog' : 'English'}" ${locked ? 'disabled' : ''} autocapitalize="sentences" autocorrect="off" spellcheck="false">${esc(st.typed)}</textarea>`;
      if (ex.type === 'type' && !locked) body += `<button class="link" data-act="mode">${st.bank ? 'Type the answer instead' : 'Use word tiles instead'}</button>`;
      if (ex.type === 'match') {
        if (!st.order) st.order = { l: shuffle(ex.pairs.map((_, i) => i)), r: shuffle(ex.pairs.map((_, i) => i)) };
        const col = side => st.order[side].map(i => `<button class="option ${st.matched.includes(i) ? 'right' : ''} ${st.sel && st.sel.side === side && st.sel.i === i ? 'picked' : ''} ${st.wrong && st.wrong[side] === i ? 'wrong' : ''}" data-act="match" data-side="${side}" data-i="${i}" ${st.matched.includes(i) ? 'disabled' : ''}>${esc(side === 'l' ? ex.pairs[i].tl : ex.pairs[i].en)}</button>`).join('');
        body += `<div class="match"><div>${col('l')}</div><div>${col('r')}</div></div><p class="matchmsg" role="status">${esc(st.msg || '')}</p>`;
      }
      if (st.result) foot = feedback(ex, st);
      else if (ex.type !== 'match') foot = `<button class="btn wide" id="check" data-act="check" ${ready(ex, st) ? '' : 'disabled'}>Check answer</button>`;
    }
    const keep = $('#stage') ? $('#stage').scrollTop : 0;
    $('#player').innerHTML = `<div class="playhead"><button class="iconbtn" data-act="quit" aria-label="Close">${icon('close')}</button>${bar((100 * session.i) / session.queue.length, 'Lesson progress')}<span class="xpchip">+${session.xp} XP</span></div><div id="stage"><div class="inner ${fresh ? 'enter' : ''}">${body}</div></div><div class="playfoot ${session.st.result ? (session.st.result.ok ? 'good' : 'bad') : ''}"><div class="inner">${foot}</div></div>`;
    $('#stage').scrollTop = fresh ? 0 : keep;
    if (fresh) {
      const auto = ex.listen ? ex.say : ex.type === 'teach' ? ex.word.tl : ex.convo ? ex.say : null;
      if (auto && set().autoplay) setTimeout(() => session && cur() === ex && Speech.say(auto), 350);
    }
  }
  function bankFor(ex) {
    if (ex.bankTiles) return ex.bankTiles;
    const words = ex.answer.replace(/[.,!?]/g, '').split(/\s+/);
    const others = shuffle(BY_ID[ex.key.split('|')[0]].s.filter(s => s[0] !== ex.answer && s[1] !== ex.answer).flatMap(s => (ex.toTl ? s[0] : s[1]).replace(/[.,!?]/g, '').split(/\s+/)));
    const extra = [...new Set(others.filter(o => !words.some(w => w.toLowerCase() === o.toLowerCase())))].slice(0, 3);
    return (ex.bankTiles = shuffle([...words, ...extra]));
  }
  const given = (ex, st) => (ex.type === 'choice' ? st.picked : ex.type === 'arrange' ? st.built.map(i => ex.tiles[i]).join(' ') : st.bank ? st.built.map(i => bankFor(ex)[i]).join(' ') : st.typed);
  const ready = (ex, st) => !!String(given(ex, st) || '').trim();

  function feedback(ex, st) {
    const r = st.result;
    const chosen = ex.notes && ex.notes[st.picked];
    if (r.ok) {
      const why = ex.type === 'match' ? (r.misses ? 'All matched. The pairs you missed are saved for review.' : 'Every pair on the first try.') : ex.convo ? `${chosen.en} ${chosen.why}` : ex.explain;
      return `<div class="fb" role="status"><b>${['Tama! Correct.', 'Ang galing! Great.', 'Magaling! Well done.'][session.i % 3]} ${r.xp ? '+' + r.xp + ' XP' : ''}</b><p>${esc(why)}</p>${r.typo ? `<p>Check your spelling: <b>${esc(ex.answer)}</b></p>` : ''}${ex.type === 'type' ? `<p>Model answer: <b>${esc(ex.answer)}</b></p>` : ''}${ex.sayAfter ? say(ex.sayAfter) : ''}</div><button class="btn wide" data-act="next">Continue</button>`;
    }
    let why;
    if (ex.convo) why = `<p>Your reply means “${esc(chosen.en)}” ${esc(chosen.why)}</p><p>Best reply: <b lang="fil">${esc(ex.answer)}</b> “${esc(ex.notes[ex.answer].en)}” ${esc(ex.notes[ex.answer].why)}</p>`;
    else {
      const picked = ex.type === 'choice' && Ex.WORDS.find(w => (ex.lang === 'en' ? w.en : w.tl) === st.picked);
      why = `<p>Correct answer: <b>${esc(ex.answer)}</b></p><p>${esc(ex.explain)}</p>${picked ? `<p>You chose “${esc(picked.tl)}”, which means “${esc(picked.en)}”.</p>` : ex.type === 'arrange' || ex.type === 'type' ? `<p>You wrote: “${esc(given(ex, st))}”. Compare the words and their order with the answer.</p>` : ''}`;
    }
    return `<div class="fb" role="status"><b>Not quite.</b>${why}${ex.sayAfter ? say(ex.sayAfter) : ''}${ex.type === 'type' && !r.overridden ? '<button class="link" data-act="override">My answer also means this (continue, no XP)</button>' : ''}</div><div class="row"><button class="btn ghost" data-act="retry">Try again</button><button class="btn" data-act="next">Continue</button></div>`;
  }

  function doCheck() {
    const ex = cur(), st = session.st;
    if (st.result || ex.type === 'match' || !ready(ex, st)) return;
    const res = Ex.check(ex, given(ex, st));
    const first = st.tries === 0 && !ex.again;
    st.tries++;
    if (st.tries === 1 && !ex.again) {
      if (first && res.ok) session.firstRight++;
      Store.answer(ex.key, ex.word, res.ok);
    }
    if (res.ok) {
      let xp = first && !st.shown ? 10 : 5;
      res.xp = xp; session.xp += xp; ex.solved = true; Store.addXP(xp);
    } else ex.missed = true;
    st.result = res; Speech.tone(res.ok ? 'good' : 'bad'); renderStep();
    const btn = $('.playfoot .btn:last-of-type'); if (btn) btn.focus({ preventScroll: true });
  }
  function doMatch(side, i) {
    const ex = cur(), st = session.st;
    if (st.result || st.matched.includes(i)) return;
    st.wrong = null;
    if (!st.sel || st.sel.side === side) { st.sel = { side, i }; st.msg = ''; if (side === 'l') Speech.say(ex.pairs[i].tl); return renderStep(); }
    const li = side === 'l' ? i : st.sel.i, ri = side === 'r' ? i : st.sel.i;
    st.sel = null;
    if (ex.pairs[li].en === ex.pairs[ri].en) {
      st.matched.push(li);
      if (li !== ri) st.matched.push(ri);
      st.msg = ex.pairs[li].tl + ' = ' + ex.pairs[li].en; Speech.tone('good');
      if (!st.missed.includes(li)) Store.answer(ex.pairs[li].key, ex.pairs[li].word, true);
      if (st.matched.length === ex.pairs.length) {
        const clean = !st.missed.length, xp = clean && !ex.again ? 10 : 5;
        if (clean) session.firstRight++;
        session.xp += xp; ex.solved = true; Store.addXP(xp); st.result = { ok: true, xp, misses: st.missed.length };
      }
    } else {
      for (const j of [li]) if (!st.missed.includes(j)) { st.missed.push(j); Store.answer(ex.pairs[j].key, ex.pairs[j].word, false); }
      st.wrong = { l: li, r: ri };
      st.msg = `Not a pair. “${ex.pairs[li].tl}” means “${ex.pairs[li].en}”. “${ex.pairs[ri].en}” is “${ex.pairs[ri].tl}”. Try again.`;
      Speech.tone('bad');
    }
    renderStep();
  }
  function next() {
    const ex = cur();
    /* A missed question comes back once at the end of the session. */
    if (ex.type !== 'teach' && ex.type !== 'note' && ex.type !== 'card' && !ex.solved && !ex.again && !(session.st.result && session.st.result.overridden)) {
      session.queue.push({ ...ex, again: true, missed: false, bankTiles: null });
    }
    session.i++;
    if (session.i >= session.queue.length) return finish();
    renderStep(true);
  }
  function finish() {
    const s = session, perfectBase = s.graded || 1;
    const acc = Math.min(100, Math.round((100 * s.firstRight) / perfectBase));
    const lines = [];
    const bonus = (n, why) => { s.xp += n; Store.addXP(n); lines.push(`+${n} XP ${why}`); };
    if (s.mode === 'lesson') {
      /* A lesson counts as complete only when most questions were eventually answered correctly. */
      const originals = s.queue.filter(x => x.type === 'choice' || x.type === 'type' || x.type === 'arrange' || x.type === 'match').filter(x => !x.again);
      const solved = originals.filter(x => x.solved || s.queue.some(y => y.again && y.key === x.key && y.type === x.type && y.solved)).length;
      if (solved / originals.length >= 0.7) {
        const prev = S().lessons[s.id];
        S().lessons[s.id] = { times: (prev ? prev.times : 0) + 1, best: Math.max(prev ? prev.best : 0, acc), first: prev ? prev.first : Store.dayKey() };
        Store.save();
        bonus(20, 'lesson complete'); if (acc === 100) bonus(10, 'perfect lesson');
        const u = BY_ID[s.id].unit;
        if (unitDone(u) === u.lessons.length && !S().unitRewards[u.id]) { S().unitRewards[u.id] = Store.dayKey(); bonus(50, `unit reward: ${u.title}`); }
      } else s.incomplete = true;
    }
    if (s.mode === 'daily' && !S().daily[Store.dayKey()] && s.queue.filter(x => x.solved).length >= Math.ceil(s.graded * 0.7)) { S().daily[Store.dayKey()] = Store.dayKey(); bonus(30, 'daily challenge'); }
    if (s.mode === 'flash' && !S().flashDays[Store.dayKey()]) { S().flashDays[Store.dayKey()] = Store.dayKey(); bonus(5, 'first flashcard round today'); }
    const badges = awardBadges();
    if (Store.level().level > s.startLevel) lines.push(`⬆️ You reached level ${Store.level().level}!`);
    if (!s.goalBefore && Store.todayXP() >= set().goal) lines.push('🎯 Daily goal reached!');
    Speech.tone('done'); Sync.now();
    const nxt = s.mode === 'lesson' && !s.incomplete ? nextLesson() : null;
    session = null;
    $('#player').innerHTML = `<div id="stage"><div class="inner finish">${s.incomplete ? '' : '<div class="confetti" aria-hidden="true">' + Array.from({ length: 36 }, (_, i) => `<i style="--l:${(i * 37) % 100}%;--d:${(i % 9) * 0.12}s;--c:var(--p${i % 4})"></i>`).join('') + '</div>'}${mascot(s.incomplete ? 'oops' : 'cheer', 'bounce')}<h1>${s.incomplete ? 'Almost there' : s.mode === 'lesson' ? 'Lesson complete!' : 'Practice complete!'}</h1>${s.incomplete ? '<p>Get at least 70% of the questions right (retries count) to complete the lesson. Your XP is saved.</p>' : ''}
      <div class="stats three"><div class="stat"><b>${s.xp}</b><span>XP earned</span></div><div class="stat"><b>${s.graded ? acc + '%' : s.total}</b><span>${s.graded ? 'first-try score' : 'cards reviewed'}</span></div><div class="stat"><b>🔥 ${Store.streak()}</b><span>day streak</span></div></div>
      ${lines.map(l => `<p class="reward">${esc(l)}</p>`).join('')}${badges.map(b => `<div class="card newbadge"><span class="big">${b[1]}</span><div><small>New badge</small><b>${esc(b[2])}</b></div></div>`).join('')}</div></div>
      <div class="playfoot"><div class="inner">${s.incomplete ? `<button class="btn wide" data-act="start" data-id="${s.id}">Try the lesson again</button>` : nxt ? `<button class="btn wide" data-act="start" data-id="${nxt.id}">Next lesson: ${esc(nxt.title)}</button>` : ''}<button class="btn wide ghost" data-act="quit">Back to app</button></div></div>`;
  }

  /* ---------- Progress ---------- */
  function calendar() {
    const now = new Date(), m = new Date(now.getFullYear(), now.getMonth() + ui.calOffset, 1);
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    let cells = '<span></span>'.repeat(m.getDay());
    for (let d = 1; d <= days; d++) {
      const k = Store.dayKey(new Date(m.getFullYear(), m.getMonth(), d)), x = S().days[k];
      const cls = x && x.xp > 0 ? (x.xp >= (x.goal || set().goal) ? 'goalmet' : 'active') : '';
      cells += `<span class="${cls} ${k === Store.dayKey() ? 'today' : ''}" title="${k}: ${x ? x.xp : 0} XP">${d}</span>`;
    }
    return `<div class="card"><div class="calhead"><button class="iconbtn" data-act="cal" data-d="-1" aria-label="Previous month">‹</button><h2>${m.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</h2><button class="iconbtn" data-act="cal" data-d="1" aria-label="Next month" ${ui.calOffset >= 0 ? 'disabled' : ''}>›</button></div><div class="cal">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<b>${d}</b>`).join('')}${cells}</div><p class="legend"><i class="active"></i> practised <i class="goalmet"></i> goal reached</p></div>`;
  }
  const timeText = secs => { const m = Math.floor(secs / 60); return m >= 60 ? Math.floor(m / 60) + ' h ' + (m % 60) + ' min' : m + ' min'; };
  function vProgress() {
    const lessons = LESSONS.filter(l => done(l.id)).length, units = COURSE.filter(u => unitDone(u) === u.lessons.length).length, lv = Store.level(), acc = Store.accuracy();
    const week = [6, 5, 4, 3, 2, 1, 0].map(n => { const k = Store.addDays(Store.dayKey(), -n); return { k, xp: (S().days[k] || { xp: 0 }).xp }; });
    const max = Math.max(set().goal, ...week.map(w => w.xp));
    const review = Store.reviewKeys(false).filter(k => ITEMS[k]);
    const label = k => { const it = ITEMS[k], d = it.data; return it.kind === 'w' ? [d.tl, d.en] : it.kind === 's' ? [d[0], d[1]] : it.kind === 'b' ? [d[0], d[1]] : it.kind === 'c' ? [d[2], d[3]] : [d.t, 'Grammar question']; };
    const stat = (v, l) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`;
    return `<h1>Progress</h1><div class="card"><h2>Level ${lv.level}</h2>${bar(lv.pct, 'Level progress')}<p>${Store.totalXP() - lv.start} / ${lv.next - lv.start} XP to level ${lv.level + 1}</p></div>
    <div class="stats">${stat(learnedWords().length, 'words learned')}${stat(lessons + ' / ' + LESSONS.length, 'lessons completed')}${stat(units + ' / ' + COURSE.length, 'units completed')}${stat(Store.totalXP(), 'total XP')}${stat(Store.streak(), 'current streak (best ' + Store.bestStreak() + ')')}${stat(timeText(Store.sum('secs')), 'learning time')}${stat(acc === null ? '–' : acc + '%', 'first-try accuracy')}${stat(review.length, 'items needing review')}</div>
    <div class="card"><h2>Last 7 days</h2><div class="week">${week.map(w => `<div><small>${w.xp}</small><span><i style="height:${(100 * w.xp) / max}%"></i></span><b>${new Date(w.k + 'T12:00').toLocaleDateString('en', { weekday: 'short' })}</b></div>`).join('')}</div></div>
    ${calendar()}
    <div class="card"><h2>Needs review</h2>${review.length ? `<ul class="reviewlist">${review.slice(0, 20).map(k => { const [a, b] = label(k); return `<li><div><b lang="fil">${esc(a)}</b><span>${esc(b)}</span></div><small>${S().review[k].due <= Store.dayKey() ? 'due now' : 'due ' + S().review[k].due}</small></li>`; }).join('')}</ul>${review.length > 20 ? `<p class="fine">and ${review.length - 20} more</p>` : ''}<button class="btn small" data-act="practice" data-mode="mistakes">Review now</button>` : '<p>Nothing waiting. Missed answers show up here and return until you get them right on three review days.</p>'}</div>
    <h2 class="section">Achievements</h2><div class="badges">${BADGES.map(b => `<div class="badge ${S().badges[b[0]] ? 'got' : ''}"><span>${b[1]}</span><b>${esc(b[2])}</b><small>${S().badges[b[0]] ? 'Earned ' + esc(S().badges[b[0]]) : esc(b[3])}</small></div>`).join('')}</div>`;
  }

  /* ---------- Settings ---------- */
  function vSettings() {
    const s = set(), info = Sync.info();
    const sel = (k, label, opts) => `<label class="field"><span>${label}</span><select id="set-${k}" data-set="${k}">${opts.map(o => `<option value="${esc(o[0])}" ${String(s[k]) === String(o[0]) ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select></label>`;
    const tog = (k, label, help) => `<label class="field toggle"><span>${label}${help ? `<small>${help}</small>` : ''}</span><input type="checkbox" id="set-${k}" data-set="${k}" ${s[k] ? 'checked' : ''}></label>`;
    const voices = Speech.all().slice().sort((a, b) => Speech.filipino().includes(b) - Speech.filipino().includes(a));
    return `<h1>Settings</h1>
    <div class="card"><h2>Learning</h2><label class="field"><span>Your name</span><input id="set-name" data-set="name" type="text" maxlength="30" value="${esc(s.name)}" placeholder="Optional"></label>${sel('goal', 'Daily goal', [[20, 'Relaxed · 20 XP'], [50, 'Regular · 50 XP'], [100, 'Serious · 100 XP'], [200, 'Intense · 200 XP']])}${sel('answerMode', 'Translation answers', [['bank', 'Word tiles (easier)'], ['type', 'Typing (harder)']])}${tog('showPron', 'Show pronunciation guides')}${tog('unlockAll', 'Unlock all lessons', 'Skip ahead to any lesson')}</div>
    <div class="card"><h2>Audio and sound</h2>${tog('sfx', 'Sound effects')}${tog('autoplay', 'Play Tagalog automatically')}${tog('listening', 'Listening exercises', 'Turn off when you can’t use sound')}${sel('rate', 'Speech speed', [[0.6, 'Very slow'], [0.75, 'Slow'], [0.85, 'Learner (default)'], [1, 'Normal'], [1.15, 'Fast']])}
    ${Speech.supported ? sel('voice', 'Voice', [['', 'Automatic (Filipino if available)'], ...voices.map(v => [v.voiceURI, v.name + ' (' + v.lang + ')' + (Speech.filipino().includes(v) ? ' ★ Filipino' : '')])]) : ''}<button class="btn small" data-act="say" data-text="Kumusta ka? Mabuti naman, salamat.">Test voice</button>${voiceNote()}${audioDisclaimer}<p class="fine">To look for a Filipino voice: on iPhone, check Settings → Accessibility, then the spoken content or read-and-speak section → Voices. On Android, check the text-to-speech settings and install Filipino voice data. Availability varies by device and system version. Offline audio needs a voice stored on the device.</p></div>
    <div class="card"><h2>Appearance</h2>${sel('theme', 'Colour mode', [['auto', 'Match device'], ['light', 'Light'], ['dark', 'Dark']])}${sel('textSize', 'Text size', [['s', 'Small'], ['m', 'Medium'], ['l', 'Large'], ['xl', 'Extra large']])}</div>
    <div class="card protect"><h2>☁️ Automatic cloud backup</h2>${info ? `<p><b>Connected.</b> ${Sync.status ? esc(Sync.status) : info.last ? 'Last successful backup: ' + new Date(info.last).toLocaleString() : 'Not backed up yet.'}</p>${Sync.error ? `<p class="note warn">${esc(Sync.error)}</p>` : ''}<p class="fine">Backs up a few seconds after you make progress, when you’re online. After clearing browser data, connect again with a token from the same GitHub account.</p><div class="row"><button class="btn small" data-act="sync-now">Back up now</button><button class="btn small ghost" data-act="sync-off">Disconnect</button></div>`
      : `<p>Keeps a copy outside your browser, in a secret Gist in your own free GitHub account. This is what brings your progress back after browser data is cleared.</p><ol><li>Sign in to GitHub.</li><li><a href="https://github.com/settings/tokens/new?scopes=gist&description=Tara%20Tagalog%20backup" target="_blank" rel="noopener noreferrer">Create a classic token</a>. Tick only <b>gist</b>, choose an expiry, and generate it.</li><li>Copy the token into your password manager, then paste it below.</li></ol><label class="field"><span>GitHub token</span><input id="token" type="password" placeholder="ghp_…" autocomplete="off"></label><button class="btn small" data-act="sync-on">Connect and back up</button><p id="syncmsg" class="note warn" hidden></p><p class="fine">The token is stored only in this browser. It can read and change all your Gists, so never share it. A “secret” Gist is unlisted rather than private: anyone with its exact link can view it. Your backup includes your name (if entered) and study history.</p>`}</div>
    <div class="card protect"><h2>💾 Backup file</h2><p>Save a copy to iCloud Drive, Files or your computer. It doesn’t update itself, so save a new one regularly.</p><div class="row"><button class="btn small" data-act="export">Save backup file</button><button class="btn small ghost" data-act="copy">Copy as text</button></div>
    <h3>Restore</h3><p class="fine">Restoring combines the backup with what’s here, so nothing already earned is removed.</p><label class="field"><span>Choose a backup file</span><input id="import" type="file" accept=".json,application/json,text/plain"></label><details><summary>Or paste backup text</summary><textarea id="paste" rows="4" aria-label="Backup text"></textarea><button class="btn small" data-act="import-text">Restore from text</button></details></div>
    <div class="card"><h2>Reset</h2><p>Erases progress on this device and disconnects cloud backup. The cloud copy and your backup files are left alone, so reconnecting brings that progress back.</p><button class="btn small danger" data-act="reset">Reset progress</button></div>
    <div class="card"><h2>About the Tagalog</h2><p>The lessons were written with AI assistance and have not been reviewed by a native-speaker teacher. Usage varies between families and regions. When your family says something differently, go with your family, and check anything important with them.</p></div>`;
  }
  const exportText = () => JSON.stringify(S(), null, 1);
  const markExported = () => { try { localStorage.setItem('tara-tagalog-exported', Date.now()); } catch (e) {} };
  async function exportFile() {
    const name = 'tara-tagalog-backup-' + Store.dayKey() + '.json';
    const touch = matchMedia('(pointer: coarse)').matches;
    try {
      const file = new File([exportText()], name, { type: 'application/json' });
      if (touch && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); markExported(); return toast('Backup shared. Make sure you saved it to Files or iCloud Drive.'); }
    } catch (e) { if (e.name === 'AbortError') return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([exportText()], { type: 'application/json' })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    markExported(); toast('Backup file downloaded: ' + name);
  }
  function importText(text) {
    let data;
    try { data = JSON.parse(text); } catch (e) { return toast('That isn’t a readable backup. Nothing was changed.'); }
    if (!data || data.app !== 'tara-tagalog') return toast('That isn’t a Tara backup. Nothing was changed.');
    confirmBox('Restore this backup?', 'It will be combined with the progress on this device.', 'Restore', () => { Store.replace(Store.merge(Store.state, data)); Store.save(); applyPrefs(); render(); toast('Progress restored.'); });
  }

  /* ---------- rendering and events ---------- */
  const VIEWS = { home: vHome, learn: vLearn, vocab: vVocab, practice: vPractice, progress: vProgress, settings: vSettings };
  function render() {
    renderNav();
    const warn = Store.saveError ? '<p class="note warn">This browser is not letting the app save (private browsing or full storage). Progress will be lost when you close it.</p>' : Store.corrupt ? '<p class="note warn">Saved data was damaged and couldn’t be read. A copy was kept. Restore from a backup in Settings.</p>' : '';
    $('#view').innerHTML = warn + (view.startsWith('lesson:') ? vLesson(view.slice(7)) : VIEWS[view]());
  }
  function go(v, push = true) {
    view = v; ui.limit = 40;
    if (push) history.pushState({ v }, '', '#' + v.replace(':', '-'));
    render(); window.scrollTo(0, 0); $('#view').focus({ preventScroll: true });
  }
  const openLesson = id => go('lesson:' + id);
  function parseHash() { const h = location.hash.slice(1).replace('-', ':'); return VIEWS[h] || (h.startsWith('lesson:') && BY_ID[h.slice(7)]) ? h : 'home'; }

  const actions = {
    go: d => go(d.view), lesson: d => openLesson(d.id), start: d => startLesson(d.id), practice: d => startPractice(d.mode),
    unit: d => { unitOpen = unitOpen === d.id ? '' : d.id; render(); },
    'grammar-quiz': d => begin({ mode: 'grammar', title: 'Grammar', queue: [Ex.make.grammar(BY_ID[d.id])] }),
    say: (d) => { if (!Speech.say(d.text, !!d.slow)) toast('Audio isn’t supported in this browser.'); },
    fav: (d, el) => { Store.toggleFav(d.key); const on = Store.isFav(d.key); el.classList.toggle('on', on); el.setAttribute('aria-pressed', on); awardBadges().forEach(b => toast('New badge: ' + b[2])); if (view === 'vocab' && ui.cat === '♥ Favourites' && !session) $('#results').innerHTML = vocabResults(); },
    cat: d => { ui.cat = d.cat; ui.limit = 40; const x = $('.chips').scrollLeft; render(); $('.chips').scrollLeft = x; },
    more: () => { ui.limit += 60; $('#results').innerHTML = vocabResults(); },
    pick: d => { session.st.picked = cur().options[+d.i]; if (cur().lang === 'tl' && !cur().listen && set().autoplay) Speech.say(session.st.picked); renderStep(); },
    build: d => { session.st.built.push(+d.i); renderStep(); }, unbuild: d => { session.st.built.splice(+d.i, 1); renderStep(); },
    mode: () => { session.st.bank = !session.st.bank; session.st.built = []; session.st.typed = ''; renderStep(); },
    check: doCheck, next, match: d => doMatch(d.side, +d.i),
    retry: () => { const st = session.st; st.result = null; st.picked = null; st.built = []; const ex = cur(); if (ex.options) ex.options = shuffle(ex.options); renderStep(); },
    override: () => { const ex = cur(); session.st.result.overridden = true; ex.solved = true; delete S().review[ex.key]; const day = Store.day(); day.correct = Math.min(day.total, day.correct + 1); Store.save(); next(); },
    reveal: () => { session.st.shown = true; renderStep(); },
    flip: () => { session.st.flipped = true; renderStep(); },
    card: d => { const w = cur().word; Store.answer(w.lesson + '|w|' + w.key, w.key, d.ok === '1'); next(); },
    quit: () => { if (session && session.i > 0) confirmBox('Leave this session?', 'XP you’ve earned is saved, but the lesson won’t count as complete.', 'Leave', quit); else quit(); },
    cal: d => { ui.calOffset = Math.min(0, ui.calOffset + +d.d); render(); },
    export: exportFile,
    copy: () => { const fail = () => { const t = $('#paste'); t.closest('details').open = true; t.value = exportText(); t.select(); toast('Copy the selected text and keep it somewhere safe.'); }; navigator.clipboard ? navigator.clipboard.writeText(exportText()).then(() => { markExported(); toast('Backup text copied. Paste it into a note and save it.'); }, fail) : fail(); },
    'import-text': () => importText($('#paste').value),
    'sync-on': async (d, el) => {
      el.disabled = true; el.textContent = 'Connecting…';
      try { const r = await Sync.connect($('#token').value); applyPrefs(); render(); toast(r.restored ? 'Connected. Cloud progress combined with this device.' : 'Connected. Your first backup is saved.'); }
      catch (e) { el.disabled = false; el.textContent = 'Connect and back up'; const m = $('#syncmsg'); if (m) { m.hidden = false; m.textContent = e.message; } }
    },
    'sync-now': async () => { const ok = await Sync.now(); toast(ok ? 'Backed up.' : Sync.error || 'Backup in progress.'); },
    'sync-off': () => confirmBox('Disconnect cloud backup?', 'Your progress stays on this device and the cloud copy stays in GitHub. New progress won’t be backed up.', 'Disconnect', () => { Sync.disconnect(); render(); }),
    reset: () => confirmBox('Reset all progress?', 'This erases XP, streaks, lessons, favourites and settings on this device. Save a backup file first if you might want them again.', 'Yes, erase', () => { Sync.disconnect(); Store.reset(); try { localStorage.removeItem('tara-tagalog-exported'); } catch (e) {} applyPrefs(); go('home'); toast('Progress reset.'); }, true),
    'modal-no': () => { $('#modal').hidden = true; }, 'modal-yes': () => { $('#modal').hidden = true; modalYes && modalYes(); },
  };

  function init() {
    Store.load(); applyPrefs();
    document.addEventListener('click', e => { const el = e.target.closest('[data-act]'); if (el && !el.disabled && actions[el.dataset.act]) actions[el.dataset.act](el.dataset, el); });
    document.addEventListener('input', e => {
      if (e.target.id === 'search') { ui.q = e.target.value; ui.limit = 40; $('#results').innerHTML = vocabResults(); }
      if (e.target.id === 'typed') { session.st.typed = e.target.value; $('#check') && ($('#check').disabled = !e.target.value.trim()); }
    });
    document.addEventListener('change', e => {
      const k = e.target.dataset.set;
      if (k) { const v = e.target.type === 'checkbox' ? e.target.checked : typeof set()[k] === 'number' ? +e.target.value : e.target.value; Store.setSetting(k, v); applyPrefs(); toast('Saved.'); }
      if (e.target.id === 'import' && e.target.files[0]) { const f = e.target.files[0]; if (f.size > 2e6) return toast('That file is too large to be a backup.'); f.text().then(importText); e.target.value = ''; }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('#modal').hidden) { $('#modal').hidden = true; return; }
      if (!session || !$('#modal').hidden) return;
      const ex = cur();
      if (e.key === 'Enter' && e.target.id === 'typed') { e.preventDefault(); doCheck(); return; }
      if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SUMMARY') { if (session.st.result || ex.type === 'teach' || ex.type === 'note') next(); else doCheck(); }
      if (/^[1-4]$/.test(e.key) && ex.type === 'choice' && !session.st.result && e.target.tagName !== 'TEXTAREA' && ex.options[+e.key - 1]) actions.pick({ i: +e.key - 1 });
    });
    window.addEventListener('popstate', () => { if (session) quit(); view = parseHash(); render(); });
    /* Learning time: counts seconds while a session is open, visible and recently touched. */
    let lastTouch = Date.now(), pending = 0;
    ['pointerdown', 'keydown'].forEach(t => document.addEventListener(t, () => (lastTouch = Date.now()), true));
    setInterval(() => { if (session && document.visibilityState === 'visible' && Date.now() - lastTouch < 90000) { Store.day().secs++; if (++pending >= 10) { pending = 0; Store.persist(); } } }, 1000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') Store.persist(); });
    /* Keep two open tabs from overwriting each other. */
    window.addEventListener('storage', e => { if (e.key === 'tara-tagalog-v1' && e.newValue) { try { Store.state = Store.clean(JSON.parse(e.newValue)); applyPrefs(); if (!session) render(); } catch (_) {} } });
    let sig = '';
    Sync.onChange = () => { const s = Sync.status + Sync.error + JSON.stringify(Sync.info()); if (s !== sig) { sig = s; applyPrefs(); const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName); if (!session && $('#player').hidden && !typing && (view === 'settings' || view === 'home')) render(); } };
    Speech.onVoices = () => { if (!session && view === 'settings') render(); };
    view = parseHash(); render();
    Sync.init();
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  window.TaraDebug = { current: () => session && cur(), session: () => session };
  init();
})();
