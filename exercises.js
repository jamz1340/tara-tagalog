/* Turns lesson content into exercises and checks answers. No screen code here. */
(function () {
  'use strict';
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  const LESSONS = [], BY_ID = {}, WORDS = [], WORD_BY = {}, ITEMS = {};
  const wkey = tl => tl.toLowerCase();
  for (const unit of window.COURSE) for (const l of unit.lessons) {
    l.unit = unit; LESSONS.push(l); BY_ID[l.id] = l;
    l.words = l.w.map(a => {
      const x = a[5] || {};
      const word = { tl: a[0], en: a[1], pron: a[2], ex: a[3], exEn: a[4], lit: x.l, use: x.u, reg: x.r, note: x.n, cat: x.cat || l.cat, lesson: l.id, key: wkey(a[0]) };
      if (!WORD_BY[word.key]) { WORD_BY[word.key] = word; WORDS.push(word); }
      ITEMS[l.id + '|w|' + word.key] = { kind: 'w', lesson: l, data: word };
      return word;
    });
    (l.s || []).forEach(s => (ITEMS[l.id + '|s|' + s[0]] = { kind: 's', lesson: l, data: s }));
    (l.b || []).forEach(b => (ITEMS[l.id + '|b|' + b[0]] = { kind: 'b', lesson: l, data: b }));
    (l.c || []).forEach(c => (ITEMS[l.id + '|c|' + c[2]] = { kind: 'c', lesson: l, data: c }));
    if (l.g && l.g.q) ITEMS[l.id + '|g|quiz'] = { kind: 'g', lesson: l, data: l.g };
  }

  /* Wrong choices never share a meaning or spelling with the answer. */
  function distractors(word, pool, field, n) {
    const seen = new Set([word[field].toLowerCase()]), out = [];
    const norm = s => s.toLowerCase().replace(/\s*\(.*?\)/g, '').split(/\s*\/\s*/);
    const mine = new Set(norm(word.en));
    for (const w of shuffle(pool).concat(shuffle(WORDS))) {
      if (w.key === word.key || seen.has(w[field].toLowerCase()) || norm(w.en).some(m => mine.has(m))) continue;
      seen.add(w[field].toLowerCase()); out.push(w[field]);
      if (out.length === n) break;
    }
    return out;
  }
  const wordInfo = w => w.tl + ' means “' + w.en + '”.' + (w.use ? ' ' + w.use : '') + (w.note ? ' ' + w.note : '');

  const make = {
    mc(l, w, dir) {
      const toTl = dir === 'toTl', f = toTl ? 'tl' : 'en';
      return { type: 'choice', label: 'Multiple choice', key: l.id + '|w|' + w.key, word: w.key, ask: toTl ? 'How do you say this in Tagalog?' : 'What does this mean?', prompt: toTl ? w.en : w.tl, say: toTl ? null : w.tl, answer: w[f], options: shuffle([w[f], ...distractors(w, l.words, f, 3)]), explain: wordInfo(w), sayAfter: w.tl, lang: toTl ? 'tl' : 'en' };
    },
    listenWord(l, w) { return { type: 'choice', listen: true, label: 'Listening', key: l.id + '|w|' + w.key, word: w.key, ask: 'Listen. What did you hear?', prompt: '', say: w.tl, answer: w.tl, options: shuffle([w.tl, ...distractors(w, l.words, 'tl', 3)]), explain: wordInfo(w), sayAfter: w.tl, lang: 'tl' }; },
    listenSentence(l, s) {
      const others = shuffle((l.s || []).filter(x => x[0] !== s[0])).slice(0, 3).map(x => x[0]);
      return { type: 'choice', listen: true, label: 'Listening', key: l.id + '|s|' + s[0], ask: 'Listen. Which sentence did you hear?', prompt: '', say: s[0], answer: s[0], options: shuffle([s[0], ...others]), explain: s[0] + ' means “' + s[1] + '”', sayAfter: s[0], lang: 'tl' };
    },
    match(l, words) {
      const picked = [], seen = new Set();
      for (const w of shuffle(words)) { if (!seen.has(w.en)) { seen.add(w.en); picked.push(w); } if (picked.length === 5) break; }
      return { type: 'match', label: 'Matching', ask: 'Match each Tagalog word with its meaning.', pairs: picked.map(w => ({ tl: w.tl, en: w.en, key: l.id + '|w|' + w.key, word: w.key })) };
    },
    translate(l, s, dir) {
      const toTl = dir === 'toTl';
      return { type: 'type', toTl, label: 'Translation', key: l.id + '|s|' + s[0], ask: toTl ? 'Translate into Tagalog.' : 'Translate into English.', prompt: toTl ? s[1] : s[0], say: toTl ? null : s[0], answer: toTl ? s[0] : s[1], accept: toTl ? [s[0], ...(s[3] || [])] : [s[1], ...(s[2] || [])], explain: s[0] + ' → ' + s[1], sayAfter: s[0] };
    },
    arrange(l, s) {
      const split = t => t.replace(/[.,!?]/g, '').split(/\s+/);
      const tiles = split(s[0]).map((t, i) => (i === 0 && !isName(t) ? t.toLowerCase() : t));
      let mixed = shuffle(tiles); for (let i = 0; i < 8 && mixed.join(' ') === tiles.join(' '); i++) mixed = shuffle(tiles);
      return { type: 'arrange', label: 'Word order', key: l.id + '|s|' + s[0], ask: 'Tap the words to build the Tagalog sentence.', prompt: s[1], tiles: mixed, answer: s[0], accept: [s[0], ...(s[3] || [])], explain: s[0] + ' → ' + s[1], sayAfter: s[0] };
    },
    blank(l, b) { return { type: 'choice', label: 'Fill in the blank', key: l.id + '|b|' + b[0], ask: 'Choose the missing word.', prompt: b[0], sub: b[1], answer: b[2], options: shuffle([b[2], ...b[3]]), explain: b[4], sayAfter: b[0].replace(/\([^)]*\)/g, '').replace('___', b[2]), lang: 'tl' }; },
    convo(l, c) {
      return { type: 'choice', convo: { setting: c[0], who: c[1], line: c[2], en: c[3] }, label: 'Conversation', key: l.id + '|c|' + c[2], ask: 'How would you reply?', prompt: c[2], say: c[2], answer: c[4][0][0], options: shuffle(c[4].map(o => o[0])), notes: Object.fromEntries(c[4].map(o => [o[0], { en: o[1], why: o[2] }])), explain: '', sayAfter: c[4][0][0], lang: 'tl' };
    },
    grammar(l) { const q = l.g.q; return { type: 'choice', label: 'Grammar check', key: l.id + '|g|quiz', ask: l.g.t, prompt: q[0], answer: q[1], options: shuffle([q[1], ...q[2]]), explain: q[3], lang: 'tl' }; },
  };
  const NAMES = new Set(['Ana', 'Maya', 'Ben', 'Joy', 'Mark', 'Carlo', 'Lola', 'Lolo', 'Tita', 'Tito', 'Nanay', 'Tatay', 'Ate', 'Kuya', 'Taga-Canada', 'Tagalog']);
  function isName(t) { return NAMES.has(t); }

  function lessonExercises(id, opts = {}) {
    const l = BY_ID[id], listening = opts.listening !== false;
    const w = shuffle(l.words), s = shuffle(l.s);
    const long = s.slice().sort((a, b) => b[0].split(' ').length - a[0].split(' ').length);
    const arrange = shuffle(long.slice(0, 3)).slice(0, 2);
    const rest = s.filter(x => !arrange.includes(x));
    const warm = shuffle([make.mc(l, w[0], 'toTl'), make.mc(l, w[1], 'toEn'), make.mc(l, w[2], 'toTl'), make.mc(l, w[3], 'toEn')]);
    const ears = listening ? [make.listenWord(l, w[4 % w.length]), make.listenSentence(l, s[0])] : [make.mc(l, w[4 % w.length], 'toEn'), make.mc(l, w[5 % w.length], 'toTl')];
    const build = shuffle([make.translate(l, rest[0], 'toEn'), make.translate(l, rest[1], 'toEn'), make.translate(l, rest[2] || s[0], 'toTl'), ...arrange.map(x => make.arrange(l, x)), ...l.b.map(x => make.blank(l, x))]);
    const end = [...l.c.map(x => make.convo(l, x))];
    if (l.g && l.g.q) end.unshift(make.grammar(l));
    return [...warm, make.match(l, l.words), ...ears, ...build, ...end];
  }

  function fromKey(key, listening) {
    const it = ITEMS[key]; if (!it) return null;
    const { kind, lesson: l, data: d } = it, r = Math.random();
    if (kind === 'w') return listening && r < 0.25 ? make.listenWord(l, d) : make.mc(l, d, r < 0.65 ? 'toTl' : 'toEn');
    if (kind === 's') return r < 0.5 ? make.arrange(l, d) : make.translate(l, d, 'toEn');
    if (kind === 'b') return make.blank(l, d);
    if (kind === 'c') return make.convo(l, d);
    return make.grammar(l);
  }

  const CONTRACTIONS = [[/\bi'm\b/g, 'i am'], [/\b(you|we|they)'re\b/g, '$1 are'], [/\b(he|she|it|that|what|where|who|how|there)'s\b/g, '$1 is'], [/\blet's\b/g, 'let us'], [/\bcan't\b/g, 'cannot'], [/\bwon't\b/g, 'will not'], [/\b(do|does|did|is|are|was|have|has)n't\b/g, '$1 not'], [/\b(i|you|he|she|it|we|they)'ll\b/g, '$1 will'], [/\b(i|you|he|she|we|they)'d\b/g, '$1 would'], [/\b(i|you|we|they)'ve\b/g, '$1 have']];
  function normEn(t) {
    t = t.toLowerCase().replace(/[’‘]/g, "'").replace(/\([^)]*\)/g, ' ');
    for (const [re, to] of CONTRACTIONS) t = t.replace(re, to);
    return t.replace(/\bokay\b/g, 'ok').replace(/\balright\b/g, 'ok').replace(/'/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  const normTl = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’‘']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  function oneTypo(a, b) {
    if (Math.abs(a.length - b.length) > 1 || b.length < 10) return false;
    let i = 0; while (i < a.length && a[i] === b[i]) i++;
    const wa = a.length >= b.length ? 1 : 0, wb = b.length >= a.length ? 1 : 0;
    if (a.slice(i + wa) !== b.slice(i + wb)) return false;
    /* A typo must sit inside a longer word, so "not"/"now" or "he"/"she" are not forgiven. */
    const word = (b.slice(0, i).split(' ').pop() || '') + (b.slice(i).split(' ')[0] || '');
    return word.length >= 6;
  }
  function check(ex, given) {
    if (ex.type === 'choice') return { ok: given === ex.answer };
    const norm = ex.type === 'type' && !ex.toTl ? normEn : normTl;
    const g = norm(given);
    if (ex.accept.some(a => norm(a) === g)) return { ok: true };
    if (ex.type === 'type' && !ex.toTl && ex.accept.some(a => oneTypo(g, norm(a)))) return { ok: true, typo: true };
    return { ok: false };
  }

  window.Ex = { shuffle, LESSONS, BY_ID, WORDS, WORD_BY, ITEMS, make, lessonExercises, fromKey, check, normEn, normTl };
})();
