// Animated Cosmic Particle Canvas for Shadow X Pro (Faithful recreation from original website)
class CosmicStarsBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.nebulas = [];
    this.mouse = { x: 0, y: 0 };
    this.lastMouseMove = Date.now();
    this.isIdle = false;
    this.animationFrame = null;
    this.pixelRatio = window.devicePixelRatio || 1;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.createNebulas();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.pixelRatio = window.devicePixelRatio || 1;

    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.width = width;
    this.height = height;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  createParticles() {
    this.particles = [];
    const count = Math.min(500, Math.floor((this.width * this.height) / 2500));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.7,
        speedY: (Math.random() - 0.5) * 0.7,
        hue: Math.random() * 360,
        opacity: Math.random() * 0.8 + 0.2,
        trail: [],
        twinkle: Math.random() > 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleDirection: Math.random() > 0.5
      });
    }
  }

  createNebulas() {
    this.nebulas = [];
    for (let i = 0; i < 3; i++) {
      this.nebulas.push({
        radius: Math.random() * 140 + 70,
        rotation: Math.random() * Math.PI * 2,
        speed: (Math.random() - 0.5) * 0.0015,
        hue: 200 + Math.random() * 60 // cyan/blue/purple range
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.lastMouseMove = Date.now();
    });

    window.addEventListener('touchmove', e => {
      if (e.touches[0]) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.lastMouseMove = Date.now();
      }
    });
  }

  drawParticle(p) {
    let opacity = p.opacity;
    if (this.isIdle && p.twinkle) {
      const factor = p.twinkleDirection
        ? 0.5 + 0.5 * Math.sin(Date.now() * p.twinkleSpeed)
        : 0.5 + 0.5 * Math.cos(Date.now() * p.twinkleSpeed);
      opacity *= factor;
    }

    const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, `hsla(${p.hue}, 100%, 90%, ${opacity})`);
    grad.addColorStop(1, 'transparent');

    this.ctx.beginPath();
    this.ctx.fillStyle = grad;
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawNebula(n) {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, n.radius);
    grad.addColorStop(0, `hsla(${n.hue}, 70%, 50%, 0.08)`);
    grad.addColorStop(1, 'transparent');

    this.ctx.beginPath();
    this.ctx.fillStyle = grad;
    this.ctx.arc(cx, cy, n.radius, n.rotation, n.rotation + 1.5 * Math.PI);
    this.ctx.fill();

    n.rotation += n.speed;
  }

  updatePhysics() {
    this.isIdle = Date.now() - this.lastMouseMove > 4000;

    for (let p of this.particles) {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 15) p.trail.shift();

      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120 && dist > 1) {
        const angle = Math.atan2(dy, dx);
        p.speedX += 0.15 * Math.cos(angle);
        p.speedY += 0.15 * Math.sin(angle);
      }

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      p.speedX *= 0.99;
      p.speedY *= 0.99;
      p.hue = (p.hue + 0.1) % 360;
    }
  }

  animate() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    // Deep cosmic gradient
    this.ctx.fillStyle = 'rgba(0, 4, 32, 0.2)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let n of this.nebulas) {
      this.drawNebula(n);
    }

    this.updatePhysics();

    for (let p of this.particles) {
      this.drawParticle(p);
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

window.CosmicStarsBackground = CosmicStarsBackground;
