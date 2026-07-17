// ============ FOLLOW THE EVIDENCE — AUDIO ============
// Procedural SFX (Web Audio API), colder/more institutional than Catch the Clue's warm
// typewriter palette — stamps, pin-clicks, string-pulls, and a case-integrity alarm.

const FTEAudio = (() => {
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
      musicEl.volume = 0.25;
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
    tap() { tone(520, 0.05, "sine", 0.09); },
    pinClick() { tone(900, 0.04, "square", 0.08); noiseBurst(0.02, 0.04, 3000, "highpass"); },
    stringPull() { tone(220, 0.16, "sawtooth", 0.07, 0, 320); },
    stampThud() {
      tone(80, 0.16, "sine", 0.24);
      noiseBurst(0.09, 0.11, 350, "lowpass");
    },
    pageShuffle() { noiseBurst(0.2, 0.08, 1100, "bandpass"); },
    correct() {
      tone(500, 0.13, "triangle", 0.15);
      tone(750, 0.11, "triangle", 0.08, 0.06);
    },
    wrong() {
      tone(160, 0.22, "sawtooth", 0.14, 0, 90);
      noiseBurst(0.12, 0.07, 500);
    },
    integrityDrop() { tone(300, 0.18, "square", 0.1, 0, 140); },
    caseFileSecured() {
      [440, 554, 659, 880].forEach((f, i) => tone(f, 0.16, "triangle", 0.13, i * 0.09));
      this.stampThud();
    },
    countdownBeep(isGo = false) {
      if (isGo) { tone(700, 0.2, "triangle", 0.18); tone(1050, 0.16, "triangle", 0.12, 0.05); }
      else tone(380, 0.12, "triangle", 0.13);
    },
    conclusionEliminated() { tone(260, 0.14, "sawtooth", 0.12, 0, 120); noiseBurst(0.1, 0.06, 500); }, 
    missionComplete() {
      [370, 494, 587, 740, 988, 1245].forEach((f, i) => tone(f, 0.2, "triangle", 0.15, i * 0.11));
    }
  };
})();
