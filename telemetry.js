/* ═══════════════════════════════════════════════════════════
   BOREALTRACK — Telemetry & Radar Background
   A lightweight, cinematic satellite tracking grid
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  let canvas, ctx;
  let width, height;
  let pings = [];
  let time = 0;

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'telemetryCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.4';
    document.body.insertBefore(canvas, document.body.firstChild);

    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);

    // Create satellite pings
    for (let i = 0; i < 15; i++) {
      pings.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2
      });
    }

    requestAnimationFrame(animate);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function drawGrid() {
    const gridSize = 100;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)'; // Cold blue grid
    ctx.lineWidth = 1;

    const offsetX = (time * 10) % gridSize;
    const offsetY = (time * 10) % gridSize;

    ctx.beginPath();
    for (let x = -gridSize; x < width + gridSize; x += gridSize) {
      ctx.moveTo(x + offsetX, 0);
      ctx.lineTo(x + offsetX, height);
    }
    for (let y = -gridSize; y < height + gridSize; y += gridSize) {
      ctx.moveTo(0, y + offsetY);
      ctx.lineTo(width, y + offsetY);
    }
    ctx.stroke();

    // Draw crosshairs
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)'; // Amber crosshairs
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2 - 50);
    ctx.lineTo(width / 2, height / 2 + 50);
    ctx.moveTo(width / 2 - 50, height / 2);
    ctx.lineTo(width / 2 + 50, height / 2);
    ctx.stroke();
  }

  function animate() {
    time += 0.005;
    ctx.clearRect(0, 0, width, height);

    drawGrid();

    // Draw Pings
    pings.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const alpha = (Math.sin(time * 5 + p.pulse) + 1) / 2;

      // Ping glow
      ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fill();

      // Ping core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Data line (trailing down)
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + 40);
      ctx.stroke();
    });

    requestAnimationFrame(animate);
  }

  window.TelemetryBg = { init };
})();