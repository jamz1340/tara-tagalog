/* Computer-generated speech (Web Speech API) and small sound effects. No recordings are included. */
(function () {
  'use strict';
  const synth = window.speechSynthesis;
  let voices = [], ctx = null;
  const isFil = v => /^(fil|tl)([-_]|$)/i.test(v.lang) || /filipino|tagalog/i.test(v.name);
  const Speech = {
    supported: !!(synth && window.SpeechSynthesisUtterance),
    onVoices: () => {},
    refresh() { if (synth) voices = synth.getVoices(); },
    filipino() { return voices.filter(isFil); },
    all() { return voices; },
    voice() {
      const want = Store.state.settings.voice;
      return voices.find(v => v.voiceURI === want) || this.filipino()[0] || null;
    },
    say(text, slow) {
      if (!this.supported) return false;
      this.refresh();
      const spoken = text.replace(/\([^)]*\)/g, '').replace(/[’']/g, '').replace(/___/g, ' ').replace(/^-|-$/g, '').replace(/\bng\b/gi, 'nang').replace(/\bmga\b/gi, 'manga');
      const u = new SpeechSynthesisUtterance(spoken);
      const v = this.voice();
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'fil-PH';
      u.rate = Store.state.settings.rate * (slow ? 0.65 : 1);
      synth.cancel(); synth.speak(u);
      return true;
    },
    stop() { if (synth) synth.cancel(); },
    tone(kind) {
      if (!Store.state.settings.sfx) return;
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      try {
        ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume();
        const notes = { good: [660, 880], bad: [240, 190], done: [523, 659, 784, 1047] }[kind];
        notes.forEach((f, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * 0.1;
          o.frequency.value = f; o.type = 'sine';
          g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
          o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.2);
        });
      } catch (e) {}
    },
  };
  if (synth) { Speech.refresh(); synth.addEventListener && synth.addEventListener('voiceschanged', () => { Speech.refresh(); Speech.onVoices(); }); }
  window.Speech = Speech;
})();
