/* ═══════════════════════════════════════════════════════════
   SPACEDEER — Arctic Pastoral Background v4
   Natural agriculture feel: rolling tundra, grazing reindeer,
   gentle snowfall, aurora, warm earthy palette
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  let canvas, ctx;
  let W, H;
  let time = 0;

  const stars = [];
  const snowflakes = [];
  const herds = [];

  /* ─── INIT ─── */
  function init() {
    canvas = document.getElementById('agri-reindeer-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();
    window.addEventListener('resize', resize);

    // Stars — warm tinted
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.45,
        r: Math.random() * 1.3 + 0.4,
        base: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 2 + 0.8
      });
    }

    // Gentle snowfall
    for (let i = 0; i < 70; i++) {
      snowflakes.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0002,
        vy: Math.random() * 0.0003 + 0.00008,
        r: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.4 + 0.15,
        drift: Math.random() * Math.PI * 2
      });
    }

    buildHerds();
    loop();
  }

  /* ─── RESIZE ─── */
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ─── HERDS ─── */
  function buildHerds() {
    herds.length = 0;

    // Background ridge — small distant silhouettes
    for (let i = 0; i < 5; i++) {
      herds.push(makeDeer(0, 0.45 + Math.random() * 0.1, 0.22 + Math.random() * 0.12));
    }
    // Midground — medium, walking across pasture
    for (let i = 0; i < 4; i++) {
      herds.push(makeDeer(1, 0.7 + Math.random() * 0.15, 0.35 + Math.random() * 0.2));
    }
    // Foreground — large, detailed
    for (let i = 0; i < 3; i++) {
      herds.push(makeDeer(2, 1.1 + Math.random() * 0.3, 0.6 + Math.random() * 0.3));
    }
  }

  function makeDeer(ridge, scale, speed) {
    return {
      ridge, scale, speed,
      x: Math.random() * (W || 1920),
      walk: Math.random() * Math.PI * 2,
      grazing: false,
      grazeT: Math.random() * 500 + 250
    };
  }

  /* ─── TERRAIN ─── */
  function ridgeY(x, ridge) {
    if (ridge === 0) return H * 0.52 + Math.sin(x * 0.0015 + 0.6) * 35 + Math.cos(x * 0.003) * 18;
    if (ridge === 1) return H * 0.70 + Math.sin(x * 0.0018 + 2.2) * 45 + Math.sin(x * 0.004) * 22;
    return H * 0.87 + Math.sin(x * 0.0012 - 0.9) * 30 + Math.cos(x * 0.0028) * 18;
  }

  /* ─── LOOP ─── */
  function loop() {
    time += 1 / 60;
    ctx.clearRect(0, 0, W, H);

    drawSky();
    drawAurora();
    drawStars();

    // Distant mountains
    drawMountains();

    // Layer 0 — far pasture
    drawHillFill(0, '#1a2b24', '#12201a');
    drawGrassTexture(0);
    drawHerd(0);

    // Gentle mist between layers
    drawMist(H * 0.58, 0.08);

    // Layer 1 — mid pasture
    drawHillFill(1, '#1e3328', '#152a1f');
    drawGrassTexture(1);
    drawHerd(1);

    drawMist(H * 0.72, 0.06);

    // Layer 2 — foreground
    drawHillFill(2, '#243d2e', '#1a3024');
    drawGrassTexture(2);
    drawHerd(2);

    drawSnowfall();

    requestAnimationFrame(loop);
  }

  /* ─── SKY — warm Arctic twilight ─── */
  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0a0e14');
    g.addColorStop(0.25, '#0f1820');
    g.addColorStop(0.45, '#162030');
    g.addColorStop(0.6, '#1a2a28');
    g.addColorStop(1, '#1a2b24');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /* ─── AURORA — soft organic ribbons ─── */
  function drawAurora() {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Soft green ribbon
    ctx.beginPath();
    ctx.moveTo(0, H * 0.4);
    for (let x = 0; x <= W; x += 20) {
      const y = H * 0.18 + Math.sin(x * 0.0022 + time * 0.5) * 45 + Math.cos(x * 0.004 - time * 0.3) * 30;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    const g1 = ctx.createLinearGradient(0, 0, 0, H * 0.42);
    g1.addColorStop(0, 'rgba(120, 220, 160, 0)');
    g1.addColorStop(0.35, 'rgba(100, 200, 140, 0.14)');
    g1.addColorStop(0.6, 'rgba(80, 180, 120, 0.08)');
    g1.addColorStop(1, 'rgba(60, 160, 100, 0)');
    ctx.fillStyle = g1;
    ctx.fill();

    // Faint warm purple undertone
    ctx.beginPath();
    ctx.moveTo(0, H * 0.38);
    for (let x = 0; x <= W; x += 30) {
      const y = H * 0.22 + Math.cos(x * 0.002 - time * 0.4) * 55 + Math.sin(x * 0.0035 + time * 0.25) * 25;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    const g2 = ctx.createLinearGradient(0, 0, 0, H * 0.45);
    g2.addColorStop(0, 'rgba(140, 120, 200, 0)');
    g2.addColorStop(0.4, 'rgba(120, 100, 180, 0.08)');
    g2.addColorStop(1, 'rgba(100, 80, 160, 0)');
    ctx.fillStyle = g2;
    ctx.fill();

    ctx.restore();
  }

  /* ─── STARS ─── */
  function drawStars() {
    stars.forEach(s => {
      const a = s.base + Math.sin(time * s.speed + s.x * 30) * 0.2;
      ctx.fillStyle = `rgba(230, 235, 255, ${Math.max(0.1, Math.min(0.85, a))})`;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* ─── DISTANT MOUNTAINS ─── */
  function drawMountains() {
    ctx.save();
    // Far mountain range silhouette
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = -5; x <= W + 5; x += 8) {
      const y = H * 0.44
        + Math.sin(x * 0.001 + 1.2) * 60
        + Math.cos(x * 0.003 + 0.5) * 30
        + Math.sin(x * 0.007) * 12;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W + 5, H);
    ctx.closePath();
    const mg = ctx.createLinearGradient(0, H * 0.3, 0, H * 0.6);
    mg.addColorStop(0, '#141f1c');
    mg.addColorStop(1, '#0f1a16');
    ctx.fillStyle = mg;
    ctx.fill();

    // Snow caps
    ctx.beginPath();
    for (let x = -5; x <= W + 5; x += 8) {
      const baseY = H * 0.44
        + Math.sin(x * 0.001 + 1.2) * 60
        + Math.cos(x * 0.003 + 0.5) * 30
        + Math.sin(x * 0.007) * 12;
      const capH = 8 + Math.sin(x * 0.005) * 5;
      if (x === -5) ctx.moveTo(x, baseY);
      else ctx.lineTo(x, baseY);
    }
    for (let x = W + 5; x >= -5; x -= 8) {
      const baseY = H * 0.44
        + Math.sin(x * 0.001 + 1.2) * 60
        + Math.cos(x * 0.003 + 0.5) * 30
        + Math.sin(x * 0.007) * 12;
      ctx.lineTo(x, baseY - 6 - Math.max(0, Math.sin(x * 0.005)) * 8);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(200, 210, 220, 0.08)';
    ctx.fill();

    ctx.restore();
  }

  /* ─── HILL / PASTURE FILL ─── */
  function drawHillFill(ridge, c1, c2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = -5; x <= W + 5; x += 8) ctx.lineTo(x, ridgeY(x, ridge));
    ctx.lineTo(W + 5, H);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, H * 0.4, 0, H);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }

  /* ─── GRASS TEXTURE — subtle organic lines ─── */
  function drawGrassTexture(ridge) {
    ctx.save();
    const spacing = ridge === 2 ? 6 : ridge === 1 ? 10 : 16;
    const grassCount = Math.floor(W / spacing);
    ctx.lineWidth = 0.6;

    for (let i = 0; i < grassCount; i++) {
      const bx = i * spacing + Math.sin(i * 3.7) * 3;
      const by = ridgeY(bx, ridge);

      if (by > H) continue;

      const grassH = (ridge === 2 ? 8 : ridge === 1 ? 5 : 3) + Math.sin(i * 2.3) * 2;
      const windSway = Math.sin(time * 1.5 + bx * 0.01) * 2;

      const alpha = ridge === 2 ? 0.18 : ridge === 1 ? 0.12 : 0.07;
      ctx.strokeStyle = `rgba(90, 140, 100, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + windSway, by - grassH * 0.6, bx + windSway * 1.5, by - grassH);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ─── MIST / FOG LAYERS ─── */
  function drawMist(baseY, alpha) {
    ctx.save();
    const drift = Math.sin(time * 0.3) * 20;
    const g = ctx.createLinearGradient(0, baseY - 30, 0, baseY + 40);
    g.addColorStop(0, `rgba(180, 200, 190, 0)`);
    g.addColorStop(0.5, `rgba(180, 200, 190, ${alpha})`);
    g.addColorStop(1, `rgba(180, 200, 190, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(drift - 30, baseY - 30, W + 60, 70);
    ctx.restore();
  }

  /* ─── HERD ─── */
  function drawHerd(ridge) {
    herds.forEach(d => {
      if (d.ridge !== ridge) return;

      if (!d.grazing) {
        d.x += d.speed;
        d.walk += 0.055 * d.speed;
        if (d.x > W + 100) d.x = -100;
      }

      d.grazeT--;
      if (d.grazeT <= 0) {
        d.grazing = !d.grazing;
        d.grazeT = d.grazing ? 180 + Math.random() * 300 : 350 + Math.random() * 500;
      }

      drawDeer(d.x, ridgeY(d.x, d.ridge), d, ridge);
    });
  }

  /* ─── NATURAL REINDEER SILHOUETTE ─── */
  function drawDeer(x, y, d, ridge) {
    ctx.save();
    ctx.translate(x, y);
    const s = d.scale;
    ctx.scale(s, s);

    const walk = d.grazing ? 0 : d.walk;
    const bW = 34, hipY = -30;
    const leg = 22;

    // Quadruped gait
    const fl = Math.sin(walk) * 0.4;
    const fr = Math.sin(walk + Math.PI) * 0.4;
    const bl = Math.sin(walk + Math.PI * 0.55) * 0.36;
    const br = Math.sin(walk + Math.PI * 1.55) * 0.36;

    // Colors — warm earthy browns per layer depth
    let bodyColor, darkColor, lightColor, antlerColor;
    if (ridge === 0) {
      bodyColor = '#2a3d32'; darkColor = '#1f2e26'; lightColor = '#354a3c'; antlerColor = '#4a6050';
    } else if (ridge === 1) {
      bodyColor = '#3a5244'; darkColor = '#2d4237'; lightColor = '#4a6454'; antlerColor = '#6a8a70';
    } else {
      bodyColor = '#4a6455'; darkColor = '#3a5446'; lightColor = '#5a7666'; antlerColor = '#8aaa8a';
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // --- Far legs (darker) ---
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 3.5;
    drawLeg(-bW * 0.35, hipY + 5, br, leg);
    drawLeg(bW * 0.3, hipY + 5, fr, leg);

    // --- Body ---
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    // Start at rump top
    ctx.moveTo(-bW * 0.45, hipY);
    // Back profile: slight dip then up to shoulder hump
    ctx.quadraticCurveTo(-bW * 0.1, hipY + 4, bW * 0.35, hipY - 4);
    // Front chest down to belly
    ctx.quadraticCurveTo(bW * 0.45, hipY + 10, bW * 0.15, hipY + 14);
    // Belly profile
    ctx.quadraticCurveTo(-bW * 0.1, hipY + 15, -bW * 0.4, hipY + 10);
    // Back of hind leg to rump
    ctx.quadraticCurveTo(-bW * 0.52, hipY + 5, -bW * 0.45, hipY);
    ctx.closePath();
    ctx.fill();

    // Light belly
    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.ellipse(0, hipY + 10, bW * 0.25, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- Tail ---
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-bW * 0.45, hipY + 1);
    ctx.quadraticCurveTo(-bW * 0.55, hipY + 2, -bW * 0.52, hipY + 6 + Math.sin(time * 2.5) * 2);
    ctx.stroke();

    // --- Neck & Head ---
    const nkX = bW * 0.3, nkY = hipY - 2;
    // Lower head position, more forward like a real grazing/walking deer
    const hdX = d.grazing ? bW * 0.6 : bW * 0.65;
    const hdY = d.grazing ? hipY + 18 : hipY - 12;

    // Thick neck
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(nkX, nkY);
    ctx.quadraticCurveTo(nkX + 5, (nkY + hdY) / 2 + 3, hdX - 2, hdY + 2);
    ctx.stroke();

    // Elongated Head
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(hdX, hdY, 8.5, 4.5, d.grazing ? 0.4 : 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Lighter muzzle
    ctx.fillStyle = lightColor;
    ctx.beginPath();
    ctx.ellipse(hdX + 6, hdY + (d.grazing ? 2 : 1), 3.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(hdX - 2, hdY - 1.5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Ears (pointing back slightly)
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hdX - 4, hdY - 3);
    ctx.lineTo(hdX - 10, hdY - 6);
    ctx.moveTo(hdX - 2, hdY - 3.5);
    ctx.lineTo(hdX - 6, hdY - 8);
    ctx.stroke();

    // --- Antlers (Sweeping C-shape characteristic of reindeer) ---
    ctx.strokeStyle = antlerColor;
    ctx.lineWidth = 1.8;
    const ax = hdX - 3, ay = hdY - 4;
    ctx.beginPath();
    // Main beam sweeps back, then curves forward and up
    ctx.moveTo(ax, ay);
    ctx.quadraticCurveTo(ax - 8, ay - 12, ax - 2, ay - 24);
    ctx.quadraticCurveTo(ax + 4, ay - 32, ax + 14, ay - 34);
    
    // Back tines
    ctx.moveTo(ax - 4, ay - 16);
    ctx.lineTo(ax - 10, ay - 18);
    
    ctx.moveTo(ax - 1, ay - 23);
    ctx.lineTo(ax - 4, ay - 28);
    
    // Top tines
    ctx.moveTo(ax + 5, ay - 28);
    ctx.lineTo(ax + 10, ay - 32);
    
    // Brow tine (sweeps forward over the nose)
    ctx.moveTo(ax, ay - 2);
    ctx.quadraticCurveTo(ax + 8, ay - 4, ax + 12, ay - 2);
    ctx.moveTo(ax + 6, ay - 3);
    ctx.lineTo(ax + 8, ay - 8);
    ctx.stroke();

    // --- Near legs (lighter) ---
    ctx.strokeStyle = lightColor;
    ctx.lineWidth = 3.5;
    drawLeg(-bW * 0.35, hipY + 5, bl, leg);
    drawLeg(bW * 0.3, hipY + 5, fl, leg);

    // Hooves
    [
      { a: fl, hx: bW * 0.3 },
      { a: bl, hx: -bW * 0.35 }
    ].forEach(h => {
      const kx = h.hx + Math.sin(h.a) * leg * 0.5;
      const ky = hipY + 5 + Math.cos(h.a) * leg * 0.5;
      const fa = h.a - Math.max(0, h.a) * 0.5;
      const fx = kx + Math.sin(fa) * leg * 0.5;
      const fy = ky + Math.cos(fa) * leg * 0.5;
      ctx.fillStyle = darkColor;
      ctx.beginPath();
      ctx.arc(fx, fy, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawLeg(hx, hy, angle, len) {
    const kx = hx + Math.sin(angle) * len * 0.5;
    const ky = hy + Math.cos(angle) * len * 0.5;
    const fa = angle - Math.max(0, angle) * 0.5;
    const fx = kx + Math.sin(fa) * len * 0.5;
    const fy = ky + Math.cos(fa) * len * 0.5;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(kx, ky);
    ctx.lineTo(fx, fy);
    ctx.stroke();
  }

  /* ─── SNOWFALL ─── */
  function drawSnowfall() {
    snowflakes.forEach(s => {
      s.x += s.vx + Math.sin(time * 0.8 + s.drift) * 0.00015;
      s.y += s.vy;

      if (s.y > 1.02) { s.y = -0.02; s.x = Math.random(); }
      if (s.x < -0.02) s.x = 1.02;
      if (s.x > 1.02) s.x = -0.02;

      ctx.fillStyle = `rgba(220, 230, 240, ${s.alpha})`;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
