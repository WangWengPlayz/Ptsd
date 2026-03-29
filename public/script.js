/* ============================================================
   SECURITY — disable copy, drag, right-click
   ============================================================ */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy',        e => e.preventDefault());
document.addEventListener('cut',         e => e.preventDefault());
document.addEventListener('dragstart',   e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

/* ============================================================
   HELPERS
   ============================================================ */
function getPHDate() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
}

function calcAge(ph) {
  const dob = { year: 2008, month: 3, day: 5 }; // April = 3 (0-indexed)
  let age = ph.getFullYear() - dob.year;
  const pastBday = (ph.getMonth() > dob.month) ||
                   (ph.getMonth() === dob.month && ph.getDate() >= dob.day);
  if (!pastBday) age--;
  return age;
}

/* ============================================================
   AGE — update all age references from DOB
   ============================================================ */
function updateAge() {
  const ph  = getPHDate();
  const age = calcAge(ph);
  const els = [
    document.getElementById('ageBadgeNum'),
    document.getElementById('ageBioText'),
    document.getElementById('ageStatNum'),
  ];
  els.forEach(el => { if (el) el.textContent = age; });
}
updateAge();

/* ============================================================
   INTRO PARTICLES
   ============================================================ */
(function() {
  const c = document.getElementById('introCanvas');
  if (!c) return;
  const x = c.getContext('2d');
  c.width  = window.innerWidth;
  c.height = window.innerHeight;

  const pts = Array.from({ length: 100 }, () => ({
    x:  Math.random() * c.width,
    y:  Math.random() * c.height,
    r:  Math.random() * 1.8 + 0.4,
    dx: (Math.random() - 0.5) * 0.7,
    dy: (Math.random() - 0.5) * 0.7,
    o:  Math.random() * 0.5 + 0.1
  }));

  function draw() {
    x.clearRect(0, 0, c.width, c.height);
    pts.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > c.width)  p.dx *= -1;
      if (p.y < 0 || p.y > c.height) p.dy *= -1;
      x.beginPath();
      x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      x.fillStyle = `rgba(79,142,247,${p.o})`;
      x.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   INTRO — hide after 5s
   ============================================================ */
const introOverlay = document.getElementById('introOverlay');
setTimeout(() => { introOverlay.classList.add('hide'); }, 5000);

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar     = document.getElementById('navbar');
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');
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
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navOverlay.classList.toggle('open', open);
});

navOverlay.addEventListener('click', closeNav);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeNav();
    const top = target.getBoundingClientRect().top + window.scrollY - (navbar.offsetHeight + 12);
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
  if (!deleting && ci === cur.length) { deleting = true; setTimeout(type, 2200); return; }
  if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  setTimeout(type, deleting ? 45 : 85);
}
setTimeout(type, 5600);

/* ============================================================
   HERO PARTICLES
   ============================================================ */
const heroCanvas = document.getElementById('particleCanvas');
const hCtx       = heroCanvas.getContext('2d');
let particles    = [];
let mouse        = { x: null, y: null };

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
  reset(init) {
    this.x  = Math.random() * heroCanvas.width;
    this.y  = init ? Math.random() * heroCanvas.height : (Math.random() > 0.5 ? -10 : heroCanvas.height + 10);
    this.r  = Math.random() * 2.2 + 0.4;
    this.dx = (Math.random() - 0.5) * 0.55;
    this.dy = (Math.random() - 0.5) * 0.55;
    this.o  = Math.random() * 0.55 + 0.12;
    this.col = Math.random() > 0.5 ? '79,142,247' : '124,92,191';
  }
  update() {
    this.x += this.dx; this.y += this.dy;
    if (mouse.x !== null) {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) { const f = (110 - d) / 110 * 0.03; this.x += dx * f; this.y += dy * f; }
    }
    if (this.x < -10 || this.x > heroCanvas.width + 10 ||
        this.y < -10 || this.y > heroCanvas.height + 10) this.reset(false);
  }
  draw() {
    hCtx.beginPath();
    hCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    hCtx.fillStyle = `rgba(${this.col},${this.o})`;
    hCtx.fill();
  }
}

function initParticles() {
  const n = Math.min(Math.floor((heroCanvas.width * heroCanvas.height) / 9000), 150);
  particles = Array.from({ length: n }, () => new Particle());
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

(function animateP() {
  hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateP);
})();

/* ============================================================
   LIVE CLOCK + BIRTHDAY COUNTDOWN — Philippines Time (UTC+8)
   ============================================================ */
const DAYS_PH   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS_PH = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function padZ(n) { return String(n).padStart(2, '0'); }

function setCD(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  const s = padZ(val);
  if (el.textContent !== s) { el.textContent = s; }
}

function updateClockAndCountdown() {
  const ph = getPHDate();

  // Live clock
  const h = padZ(ph.getHours()), m = padZ(ph.getMinutes()), s = padZ(ph.getSeconds());
  const timeStr = `${h}:${m}:${s}`;
  const dateStr = `${DAYS_PH[ph.getDay()]}, ${MONTHS_PH[ph.getMonth()]} ${ph.getDate()}, ${ph.getFullYear()}`;
  const liveTimeEl = document.getElementById('liveTime');
  const liveDateEl = document.getElementById('liveDate');
  if (liveTimeEl) liveTimeEl.textContent = timeStr;
  if (liveDateEl) liveDateEl.textContent = dateStr;

  // Birthday countdown
  const isToday = ph.getMonth() === 3 && ph.getDate() === 5; // April 5
  const bdayLabel = document.getElementById('bdayLabel');

  if (isToday) {
    // It's birthday! Show celebration
    if (bdayLabel) bdayLabel.textContent = '🎂 Happy Birthday Mart! 🎉';
    setCD('cdDays', 0); setCD('cdHours', 0); setCD('cdMins', 0); setCD('cdSecs', 0);
    triggerBirthdayCelebration();
  } else {
    if (bdayLabel) bdayLabel.textContent = '🎂 Birthday in';
    let nextBday = new Date(ph.getFullYear(), 3, 5, 0, 0, 0);
    if (ph >= nextBday) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const diff  = nextBday - ph;
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    setCD('cdDays', days); setCD('cdHours', hours); setCD('cdMins', mins); setCD('cdSecs', secs);
  }
}
updateClockAndCountdown();
setInterval(updateClockAndCountdown, 1000);

/* ============================================================
   BIRTHDAY CELEBRATION — confetti + banner
   ============================================================ */
let birthdayTriggered = false;

function triggerBirthdayCelebration() {
  if (birthdayTriggered) return;
  birthdayTriggered = true;

  document.body.classList.add('bday-mode');
  const banner = document.getElementById('bdayBanner');
  if (banner) banner.classList.add('active');

  // Close banner on click
  const content = banner ? banner.querySelector('.bday-banner-content') : null;
  if (content) {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close';
    closeBtn.style.cssText = 'margin-top:20px;padding:8px 22px;border-radius:50px;border:none;background:rgba(255,255,255,0.12);color:#fff;font-family:inherit;font-size:0.85rem;cursor:pointer;pointer-events:all;';
    closeBtn.addEventListener('click', () => { banner.classList.remove('active'); stopConfetti(); });
    content.appendChild(closeBtn);
  }

  startConfetti();
}

// ---- Confetti engine ----
let confettiRAF = null;
const COLORS = ['#ffd700','#ff6b6b','#4f8ef7','#7c5cbf','#ff8c00','#00e5ff','#ff4081'];

function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  });

  const pieces = Array.from({ length: 180 }, () => ({
    x:   Math.random() * canvas.width,
    y:   Math.random() * -canvas.height,
    w:   Math.random() * 10 + 5,
    h:   Math.random() * 5 + 3,
    r:   Math.random() * Math.PI * 2,
    dr:  (Math.random() - 0.5) * 0.15,
    dy:  Math.random() * 3 + 1.5,
    dx:  (Math.random() - 0.5) * 1.5,
    col: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.5 + 0.5,
  }));

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y  += p.dy;
      p.x  += p.dx;
      p.r  += p.dr;
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    confettiRAF = requestAnimationFrame(drawConfetti);
  }
  drawConfetti();
}

function stopConfetti() {
  if (confettiRAF) cancelAnimationFrame(confettiRAF);
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

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
document.querySelectorAll('.skill-card').forEach(c => skillObs.observe(c));

/* ============================================================
   GAMING CARD — switch + modal
   ============================================================ */
const slideMLBB = document.getElementById('gameMLBB');
const slideMC   = document.getElementById('gameMinecraft');
const btnMLBB   = document.getElementById('btnMLBB');
const btnMC     = document.getElementById('btnMC');
let currentGame = 'mlbb';
let autoSwitch  = null;

function switchGame(game) {
  if (game === currentGame) return;
  currentGame = game;
  if (game === 'mlbb') {
    slideMC.classList.add('hidden');    slideMLBB.classList.remove('hidden');
    btnMLBB.classList.add('active');   btnMC.classList.remove('active');
  } else {
    slideMLBB.classList.add('hidden'); slideMC.classList.remove('hidden');
    btnMC.classList.add('active');     btnMLBB.classList.remove('active');
  }
}

function resetAutoSwitch() {
  clearInterval(autoSwitch);
  autoSwitch = setInterval(() => switchGame(currentGame === 'mlbb' ? 'minecraft' : 'mlbb'), 4000);
}

btnMLBB.addEventListener('click', e => { e.stopPropagation(); switchGame('mlbb'); resetAutoSwitch(); });
btnMC.addEventListener('click',   e => { e.stopPropagation(); switchGame('minecraft'); resetAutoSwitch(); });
resetAutoSwitch();

/* ============================================================
   MODALS
   ============================================================ */
const mlbbModal = document.getElementById('mlbbModal');
const mcModal   = document.getElementById('mcModal');
const wanwanVid = document.getElementById('wanwanVid');

function openModal(modal) {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Start video if MLBB modal
  if (modal === mlbbModal && wanwanVid) {
    wanwanVid.currentTime = 0;
    wanwanVid.play().catch(() => {});
  }
}

function closeModal(modal) {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Stop video when closing MLBB modal
  if (modal === mlbbModal && wanwanVid) {
    wanwanVid.pause();
    wanwanVid.currentTime = 0;
  }
}

// Force video to always loop and never pause while modal is open
if (wanwanVid) {
  wanwanVid.addEventListener('pause', () => {
    if (mlbbModal.classList.contains('open')) wanwanVid.play().catch(() => {});
  });
  wanwanVid.addEventListener('ended', () => {
    wanwanVid.currentTime = 0; wanwanVid.play().catch(() => {});
  });
}

document.getElementById('gamingCard').addEventListener('click', e => {
  if (e.target.closest('.gsw-btn')) return;
  openModal(currentGame === 'mlbb' ? mlbbModal : mcModal);
});

document.getElementById('closeMLBB').addEventListener('click', () => closeModal(mlbbModal));
document.getElementById('closeMC').addEventListener('click',   () => closeModal(mcModal));

[mlbbModal, mcModal].forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) closeModal(m); });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(mlbbModal); closeModal(mcModal); }
});
