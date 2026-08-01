/* ═══════════════════════════════════════════════════════════
   BOREALTRACK — GIS Animated Trails
   Draws thin grid lines and animated GPS trails
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const canvas = document.getElementById('mapCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let trails = [];

    // Define some random wandering paths for the GPS trails
    class Trail {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.history = [];
            this.length = 50 + Math.random() * 100;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = 0.2 + Math.random() * 0.4;
            this.opacity = 0;
            this.fadingIn = true;
        }

        update() {
            // Gentle curving movement
            this.angle += (Math.random() - 0.5) * 0.1;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > this.length) {
                this.history.shift();
            }

            // Fade in and out logic
            if (this.fadingIn) {
                this.opacity += 0.01;
                if (this.opacity >= 0.6) this.fadingIn = false;
            } else if (this.history.length === Math.floor(this.length)) {
                this.opacity -= 0.005;
                if (this.opacity <= 0) this.reset();
            }
        }

        draw() {
            if (this.history.length < 2) return;

            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.lineWidth = 1.5;

            ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
            ctx.stroke();

            // Draw a subtle "ping" at the head of the trail
            const head = this.history[this.history.length - 1];
            ctx.beginPath();
            ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`; // Ice blue dot
            ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 8; i++) {
            trails.push(new Trail());
        }

        animate();
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function drawGrid() {
        const gridSize = 150;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let x = 0; x < width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Draw coordinate crosses at intersections
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        const crossSize = 4;
        ctx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                ctx.moveTo(x - crossSize, y);
                ctx.lineTo(x + crossSize, y);
                ctx.moveTo(x, y - crossSize);
                ctx.lineTo(x, y + crossSize);
            }
        }
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        drawGrid();

        trails.forEach(trail => {
            trail.update();
            trail.draw();
        });

        requestAnimationFrame(animate);
    }

    init();
})();