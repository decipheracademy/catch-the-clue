// ============ CATCH THE CLUE — AUDIO ============
// SFX are procedural (Web Audio API). Background music is the supplied bgmusic.mp3.

const Audio2 = (() => {
  let ctx = null;
  let muted = false;
  let musicEl = null;

  function ensureCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type = "sine", vol = 0.16, delay = 0, glideTo = null) {
    if (muted) return;
    const c = ensureCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime + delay);
    if (glideTo) osc.frequency.linearRampToValueAtTime(glideTo, c.currentTime + delay + dur);
    gain.gain.setValueAtTime(0, c.currentTime + delay);
    gain.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + dur + 0.05);
  }

  function noiseBurst(dur, vol, filterFreq, filterType = "bandpass") {
    if (muted) return;
    const c = ensureCtx();
    const bufferSize = Math.floor(c.sampleRate * dur);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = filterFreq;
    const gain = c.createGain();
    gain.gain.setValueAtTime(vol, c.currentTime);
    gain.gain.linearRampToValueAtTime(0, c.currentTime + dur);
    src.connect(filter).connect(gain).connect(c.destination);
    src.start();
  }

  return {
    initMusic() {
      if (musicEl) return;
      musicEl = new Audio("assets/audio/bgmusic.mp3");
      musicEl.loop = true;
      musicEl.volume = 0.28;
    },
    startMusic() {
      this.initMusic();
      if (!muted) musicEl.play().catch(() => {});
    },
    toggleMute() {
      muted = !muted;
      const btn = document.getElementById("muteBtn");
      if (btn) btn.textContent = muted ? "🔇 SOUND OFF" : "🔊 SOUND ON";
      if (musicEl) muted ? musicEl.pause() : musicEl.play().catch(() => {});
      if (!muted) this.tap();
    },
    isMuted() { return muted; },
    tap() { tone(600, 0.05, "sine", 0.09); },
    typewriterKey() { noiseBurst(0.03, 0.05, 2200, "highpass"); },
    paperRustle() { noiseBurst(0.22, 0.08, 900, "bandpass"); },
    stampThud() {
      tone(90, 0.14, "sine", 0.22);
      noiseBurst(0.08, 0.1, 400, "lowpass");
    },
    pageTurnWhoosh() { noiseBurst(0.28, 0.1, 1400, "bandpass"); },
    correct(comboLevel = 0) {
      const base = 480 + Math.min(comboLevel, 10) * 18;
      tone(base, 0.13, "triangle", 0.15);
      tone(base * 1.5, 0.11, "triangle", 0.07, 0.05);
    },
    wrong() { tone(170, 0.2, "sawtooth", 0.13, 0, 100); },
    comboMilestone() {
      tone(620, 0.09, "square", 0.11);
      tone(830, 0.09, "square", 0.11, 0.08);
      tone(1040, 0.13, "square", 0.13, 0.16);
    },
    cardEliminate() {
      tone(300, 0.1, "sawtooth", 0.12, 0, 150);
      noiseBurst(0.1, 0.06, 600);
    },
    countdownBeep(isGo = false) {
      if (isGo) { tone(760, 0.2, "triangle", 0.18); tone(1140, 0.16, "triangle", 0.12, 0.05); }
      else tone(400, 0.13, "triangle", 0.14);
    },
    zoneComplete() {
      [440, 554, 659, 880].forEach((f, i) => tone(f, 0.17, "triangle", 0.13, i * 0.09));
      this.stampThud();
    },
    wagerLock() { tone(220, 0.2, "sawtooth", 0.14, 0, 260); },
    wagerWin() { [523, 659, 784, 988, 1318].forEach((f, i) => tone(f, 0.2, "triangle", 0.15, i * 0.08)); },
    wagerLose() { tone(220, 0.35, "sine", 0.15, 0, 90); },
    achievement() {
      [620, 830, 1040, 1300].forEach((f, i) => tone(f, 0.11, "square", 0.09, i * 0.06));
    },
    missionComplete() {
      [370, 494, 587, 740, 988, 1245].forEach((f, i) => tone(f, 0.2, "triangle", 0.15, i * 0.11));
    }
  };
})();
