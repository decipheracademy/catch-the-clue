// ============ FOLLOW THE EVIDENCE — AMBIENT FX ============
// Slow-drifting redaction bars and a faint scanline sweep behind every screen —
// a cold, institutional "classified dossier" atmosphere, distinct from Catch the
// Clue's warm amber dust motes.

(function () {
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.createElement("canvas");
  canvas.id = "fxCanvas";
  canvas.style.cssText = "position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.4";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let w, h, bars = [];
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const COUNT = reduceMotion ? 0 : 10;
  for (let i = 0; i < COUNT; i++) {
    bars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      width: 40 + Math.random() * 120,
      height: 6 + Math.random() * 8,
      vy: (Math.random() * 0.05 + 0.015),
      alpha: Math.random() * 0.05 + 0.02
    });
  }

  let scanY = 0;
  function tick() {
    ctx.clearRect(0, 0, w, h);
    bars.forEach(b => {
      b.y += b.vy;
      if (b.y > h + 10) { b.y = -10; b.x = Math.random() * w; }
      ctx.fillStyle = `rgba(20,22,26,${b.alpha})`;
      ctx.fillRect(b.x, b.y, b.width, b.height);
    });
    scanY = (scanY + 0.3) % h;
    const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
    grad.addColorStop(0, "rgba(91,124,153,0)");
    grad.addColorStop(0.5, "rgba(91,124,153,0.03)");
    grad.addColorStop(1, "rgba(91,124,153,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 40, w, 80);
    if (!reduceMotion) requestAnimationFrame(tick);
  }
  tick();
})();
