// ============ CATCH THE CLUE — AMBIENT FX ============
// Drifting dust-mote particles (warm amber tones) behind every screen — a desk-lamp-lit
// case-file atmosphere instead of Pulse Protocol's cyan signal particles.

(function () {
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.createElement("canvas");
  canvas.id = "fxCanvas";
  canvas.style.cssText = "position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.55";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let w, h, particles = [];
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const COUNT = reduceMotion ? 0 : 46;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.5,
      vy: -(Math.random() * 0.12 + 0.03),
      vx: (Math.random() - 0.5) * 0.05,
      alpha: Math.random() * 0.35 + 0.08,
      hue: Math.random() > 0.5 ? "213,163,92" : "230,200,150" // warm amber/sepia tones
    });
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      if (p.x < -5) p.x = w + 5;
      if (p.x > w + 5) p.x = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
      ctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(tick);
  }
  tick();
})();
