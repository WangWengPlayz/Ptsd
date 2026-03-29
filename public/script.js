/* ============================================================
   SECURITY — disable copy, drag, right-click
   ============================================================ */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('cut', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

/* ============================================================
   INTRO PARTICLES (light version for intro canvas)
   ============================================================ */
(function() {
  const c = document.getElementById('introCanvas');
  const x = c.getContext('2d');
  c.width = window.innerWidth;
  c.height = window.innerHeight;

  const pts = Array.from({ length: 80 }, () => ({
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.7,
    dy: (Math.random() - 0.5) * 0.7,
    o: Math.random() * 0.5 + 0.1
  }));

  function drawIntroParticles() {
    x.clearRect(0, 0, c.width, c.height);
    pts.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > c.width) p.dx *= -1;
      if (p.y < 0 || p.y > c.height) p.dy *= -1;
      x.beginPath();
      x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      x.fillStyle = `rgba(79,142,247,${p.o})`;
      x.fill();
    });
    requestAnimationFrame(drawIntroParticles);
  }
  drawIntroParticles();
})();

/* ============================================================
   INTRO — 5 second timer then hide
   ============================================================ */
const introOverlay = document.getElementById('introOverlay');
setTimeout(() => { introOverlay.classList.add('hide'); }, 5000);

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar   = document.getElementById('navbar');
const navToggle= document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

function closeNav() {
  navLinks.classList.remove('open');
  navToggle.classList.remove('open');
  navOverlay.classList.remove('open');
}

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navOverlay.classList.toggle('open', isOpen);
});

navOverlay.addEventListener('click', closeNav);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

/* ============================================================
   SMOOTH SCROLL with navbar offset
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeNav();
    const offset = navbar.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   TYPEWRITER
   ============================================================ */
const phrases = [
  'Code. Play. Repeat.',
  'Building cool stuff.',
  'CSS NC2 Certified.',
  'Chilling & learning.',
  'MLBB • Minecraft • AI.'
];
let pi = 0, ci = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const cur = phrases[pi];
  typeEl.textContent = deleting ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
  deleting ? ci-- : ci++;

  if (!deleting && ci === cur.length) {
    deleting = true;
    setTimeout(type, 2200);
    return;
  }
  if (deleting && ci === 0) {
    deleting = false;
    pi = (pi + 1) % phrases.length;
  }
  setTimeout(type, deleting ? 45 : 85);
}

setTimeout(type, 5600); // start after intro

/* ============================================================
   HERO PARTICLES (canvas)
   ============================================================ */
const heroCanvas = document.getElementById('particleCanvas');
const hCtx = heroCanvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeHeroCanvas() {
  heroCanvas.width  = window.innerWidth;
  heroCanvas.height = window.innerHeight;
}
resizeHeroCanvas();
window.addEventListener('resize', () => { resizeHeroCanvas(); initParticles(); }, { passive: true });

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
window.addEventListener('touchmove', e => {
  if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
}, { passive: true });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

class Particle {
  constructor() { this.reset(true); }
  reset(initial) {
    this.x  = Math.random() * heroCanvas.width;
    this.y  = initial ? Math.random() * heroCanvas.height : (Math.random() > 0.5 ? -10 : heroCanvas.height + 10);
    this.r  = Math.random() * 2.2 + 0.4;
    this.dx = (Math.random() - 0.5) * 0.55;
    this.dy = (Math.random() - 0.5) * 0.55;
    this.o  = Math.random() * 0.55 + 0.12;
    this.color = Math.random() > 0.5 ? '79,142,247' : '124,92,191';
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    if (mouse.x !== null) {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        const f = (110 - dist) / 110 * 0.03;
        this.x += dx * f;
        this.y += dy * f;
      }
    }
    if (this.x < -10 || this.x > heroCanvas.width + 10 ||
        this.y < -10 || this.y > heroCanvas.height + 10) {
      this.reset(false);
    }
  }
  draw() {
    hCtx.beginPath();
    hCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    hCtx.fillStyle = `rgba(${this.color},${this.o})`;
    hCtx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor((heroCanvas.width * heroCanvas.height) / 9000), 150);
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        hCtx.beginPath();
        hCtx.strokeStyle = `rgba(79,142,247,${0.1 * (1 - d / 130)})`;
        hCtx.lineWidth   = 0.8;
        hCtx.moveTo(particles[i].x, particles[i].y);
        hCtx.lineTo(particles[j].x, particles[j].y);
        hCtx.stroke();
      }
    }
  }
}

function animateParticles() {
  hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================================
   BIRTHDAY COUNTDOWN — Philippines Time (UTC+8)
   ============================================================ */
function updateCountdown() {
  const now = new Date();
  // Convert to PH time
  const phNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
  let next = new Date(phNow.getFullYear(), 3, 5, 0, 0, 0); // April = month 3
  if (phNow >= next) next.setFullYear(next.getFullYear() + 1);

  const diff = next - phNow;
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);

  function setVal(id, val) {
    const el = document.getElementById(id);
    const s  = String(val).padStart(2, '0');
    if (el.textContent !== s) {
      el.textContent = s;
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
    }
  }

  setVal('cdDays',  days);
  setVal('cdHours', hours);
  setVal('cdMins',  mins);
  setVal('cdSecs',  secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObs.observe(el));

/* ============================================================
   SKILL BARS
   ============================================================ */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 200);
      });
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.skill-card').forEach(card => skillObs.observe(card));

/* ============================================================
   GAMING CARD — SWITCH EFFECT + MODAL
   ============================================================ */
const slideMLBB  = document.getElementById('gameMLBB');
const slideMC    = document.getElementById('gameMinecraft');
const btnMLBB    = document.getElementById('btnMLBB');
const btnMC      = document.getElementById('btnMC');

let currentGame = 'mlbb';

function switchGame(game) {
  if (game === currentGame) return;
  currentGame = game;

  if (game === 'mlbb') {
    slideMC.classList.add('hidden');
    slideMLBB.classList.remove('hidden');
    btnMLBB.classList.add('active');
    btnMC.classList.remove('active');
  } else {
    slideMLBB.classList.add('hidden');
    slideMC.classList.remove('hidden');
    btnMC.classList.add('active');
    btnMLBB.classList.remove('active');
  }
}

btnMLBB.addEventListener('click', (e) => { e.stopPropagation(); switchGame('mlbb'); });
btnMC.addEventListener('click',   (e) => { e.stopPropagation(); switchGame('minecraft'); });

// Auto-switch every 4 seconds
setInterval(() => {
  switchGame(currentGame === 'mlbb' ? 'minecraft' : 'mlbb');
}, 4000);

/* ============================================================
   MODALS
   ============================================================ */
const mlbbModal = document.getElementById('mlbbModal');
const mcModal   = document.getElementById('mcModal');
const wanwanVid = document.getElementById('wanwanVid');

function openModal(modal) {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  if (wanwanVid && !wanwanVid.paused) wanwanVid.pause();
}

// Open on game card click
document.getElementById('gamingCard').addEventListener('click', (e) => {
  if (e.target.closest('.gsw-btn')) return;
  if (currentGame === 'mlbb') openModal(mlbbModal);
  else openModal(mcModal);
});

// Close buttons
document.getElementById('closeMLBB').addEventListener('click', () => closeModal(mlbbModal));
document.getElementById('closeMC').addEventListener('click', () => closeModal(mcModal));

// Close on backdrop click
[mlbbModal, mcModal].forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) closeModal(m); });
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(mlbbModal); closeModal(mcModal); }
});
