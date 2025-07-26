const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const stars = [];

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

// 🌌 Tạo hiệu ứng nền sao lung linh
for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.2 + 0.3,
    alpha: Math.random(),
    delta: Math.random() * 0.005 + 0.002,
  });
}

function drawStars() {
  for (let s of stars) {
    ctx.beginPath();
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = "white";
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();
    s.alpha += s.delta;
    if (s.alpha <= 0 || s.alpha >= 1) s.delta = -s.delta;
  }
  ctx.globalAlpha = 1;
}

function heartFunction(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return { x, y };
}

class Particle {
  constructor(x, y, vx = 0, vy = 0, isFirework = false) {
    this.x = x + canvas.width / 2;
    this.y = -y + canvas.height / 2;
    this.size = Math.random() * 1.5 + 1;
    this.alpha = 1.2;
    this.speed = Math.random() * 0.8 + 0.5;
    this.angle = Math.random() * Math.PI * 2;
    this.amplitude = Math.random() * 1.2 + 0.4;
    this.hue = Math.floor(Math.random() * 60 + 300);
    this.vx = vx;
    this.vy = vy;
    this.isFirework = isFirework;
  }

  update() {
    if (this.isFirework) {
      this.x += this.vx * 1.2;
      this.y += this.vy * 1.2;
      this.vy += 0.04;
    } else {
      this.y += this.speed;
      this.x += Math.sin(this.angle) * this.amplitude;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += dx * 0.02;
        this.y += dy * 0.02;
      }
    }

    this.alpha -= 0.01;
  }

  draw() {
    const offsetX = (Math.random() - 0.5) * 0.6;
    const offsetY = (Math.random() - 0.5) * 0.6;

    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = `hsl(${this.hue}, 100%, 75%)`;
    ctx.shadowColor = `hsl(${this.hue}, 100%, 85%)`;
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.arc(this.x + offsetX, this.y + offsetY, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function explode(x, y) {
  for (let i = 0; i < 100; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 4 + 2.5;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const p = new Particle(
      x - canvas.width / 2,
      -(y - canvas.height / 2),
      vx,
      vy,
      true
    );
    particles.push(p);
  }
}

window.addEventListener("click", function (e) {
  const clickX = e.clientX;
  const clickY = e.clientY;

  for (let t = 0; t < Math.PI * 2; t += 0.1) {
    const pos = heartFunction(t);
    const hx = pos.x * 10 + canvas.width / 2;
    const hy = -pos.y * 10 + canvas.height / 2;

    const dx = clickX - hx;
    const dy = clickY - hy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 25) {
      explode(hx, hy);
      break;
    }
  }
});

function animate() {
  // ❤️ Trái tim đập nhịp
  const scale = 1 + 0.08 * Math.sin(Date.now() * 0.005);

  // Tô nền mờ để tạo hiệu ứng chuyển động
  ctx.fillStyle = "rgba(10, 10, 25, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawStars(); // ✨ Vẽ nền lung linh

  for (let i = 0; i < 3; i++) {
    const t = Math.random() * Math.PI * 2;
    const pos = heartFunction(t);
    particles.push(new Particle(pos.x * 10 * scale, pos.y * 10 * scale));
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }

  requestAnimationFrame(animate);
}

animate();
