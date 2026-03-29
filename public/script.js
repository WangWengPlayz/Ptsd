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

/* ============================================================
   LYRICS DATA (LRC parsed)
   ============================================================ */
const LYRICS = [
  { t: 3.971,   l: "Rotting in bed numb and upset" },
  { t: 7.590,   l: "The hands on the clock are moving along and" },
  { t: 11.992,  l: "Feels like I'm dead but I'm here instead" },
  { t: 16.149,  l: "Please make it stop I'm always wrong and" },
  { t: 20.191,  l: "Stuck inside my never-ending thoughts" },
  { t: 27.802,  l: "I'm trying hard 'cause I know what it costs" },
  { t: 34.258,  l: "'Cause one day we'll run out of" },
  { t: 37.560,  l: "Time" },
  { t: 38.743,  l: "Memories we'll leave them behind" },
  { t: 42.632,  l: "Many things we can't control" },
  { t: 45.844,  l: "I hope you know it's better to try" },
  { t: 50.671,  l: "'Cause one day we'll run out of" },
  { t: 53.728,  l: "All of these are natural no one's really in control" },
  { t: 57.370,  l: "But we live a little 'cause we know" },
  { t: 59.565,  l: "When we vanish we don't really go" },
  { t: 61.200,  l: "So I try to run an extra mile hoping for a sign" },
  { t: 63.826,  l: "If there isn't one then I'm leaving mine" },
  { t: 66.015,  l: "And for those behind seek and you will find" },
  { t: 68.227,  l: "There's no reason not to try" },
  { t: 70.209,  l: "Watching everything from the backseat it's beautiful" },
  { t: 73.709,  l: "But at times it gets really ugly you already know what to do" },
  { t: 77.378,  l: "When we've get nothing to lose what we're not changing we choose" },
  { t: 81.454,  l: "Fighting for whatever cause if the light's dying" },
  { t: 84.373,  l: "Don't you ever cease to refuse" },
  { t: 86.492,  l: "Stuck inside my never-ending thoughts" },
  { t: 94.293,  l: "I'm trying hard 'cause I know what it costs" },
  { t: 100.769, l: "'Cause one day we'll run out of" },
  { t: 104.075, l: "Time" },
  { t: 105.263, l: "Memories we'll leave them behind" },
  { t: 109.121, l: "Many things we can't control" },
  { t: 112.080, l: "I hope you know it's better to try" },
  { t: 117.135, l: "'Cause one day we'll run out of" },
  { t: 120.531, l: "Time" },
  { t: 121.571, l: "Memories we'll leave them behind" },
  { t: 125.581, l: "Darling when push comes to shove" },
  { t: 128.484, l: "Your best is enough it won't hurt to try" },
  { t: 133.731, l: "'Cause one day we'll run out of" },
  { t: 135.762, l: "Time and time again it rains things I don't understand" },
  { t: 139.616, l: "Drenched all over still I endure all I can" },
  { t: 143.847, l: "And I'm well aware there's no reset in this world" },
  { t: 147.802, l: "So I'll never ever walk away with stones left unturned" },
  { t: 151.548, l: "'Cause if I'm leaving anyway I'm spending every day" },
  { t: 156.119, l: "Scattering stars in the night sky hoping it'll lead the way for better days" },
  { t: 161.101, l: "Savor every moment with me while we're here" },
  { t: 163.305, l: "'Cause I know one day" },
  { t: 168.805, l: "Time" },
  { t: 170.620, l: "Memories we'll leave them behind" },
  { t: 174.440, l: "Many things we can't control" },
  { t: 177.608, l: "And I hope you know it's better to try" },
  { t: 182.572, l: "'Cause one day we'll run out of" },
  { t: 187.745, l: "Time" },
  { t: 189.076, l: "Memories we'll leave them behind (oh oh)" },
  { t: 193.168, l: "Many things we can't control (we can't control)" },
  { t: 196.173, l: "I hope you know it's better to try (I hope you know oh)" },
  { t: 200.996, l: "'Cause one day we'll run out of" },
  { t: 204.418, l: "Time" },
  { t: 205.615, l: "Memories we'll leave them behind" },
  { t: 209.278, l: "Darling when push comes to shove" },
  { t: 212.509, l: "Your best is enough it won't hurt to try" },
  { t: 217.386, l: "'Cause one day we'll run out of" },
];

/* ============================================================
   MUSIC PLAYER + LYRICS ENGINE
   ============================================================ */
const bgMusic       = document.getElementById('bgMusic');
const musicToggle   = document.getElementById('musicToggle');
const lyricsOverlay = document.getElementById('lyricsOverlay');
const lyricPrev     = document.getElementById('lyricPrev');
const lyricCurrent  = document.getElementById('lyricCurrent');
const lyricNext     = document.getElementById('lyricNext');

let musicPlaying    = false;
let currentLyricIdx = -1;
let lyricRaf        = null;

/* ---- Build animated word HTML ---- */
function buildWordHTML(text) {
  return text.split(' ').map((word, i) => {
    const isTime = word.toLowerCase().replace(/[^a-z]/g, '') === 'time';
    const cls    = isTime ? 'ly-word ly-time' : 'ly-word';
    return `<span class="${cls}" style="--wi:${i}">${word}</span>`;
  }).join(' ');
}

/* ---- Update 3-line display ---- */
function renderLyrics(idx) {
  const prev = idx > 0 ? LYRICS[idx - 1].l : '';
  const cur  = idx >= 0 ? LYRICS[idx].l : '';
  const next = idx >= 0 && idx < LYRICS.length - 1 ? LYRICS[idx + 1].l : '';

  lyricPrev.textContent = prev;
  lyricNext.textContent = next;

  // Animate current line in
  lyricCurrent.classList.remove('swap-in');
  void lyricCurrent.offsetWidth; // reflow
  lyricCurrent.innerHTML = cur ? buildWordHTML(cur) : '';
  lyricCurrent.classList.add('swap-in');

  // Particle burst on line change
  burstParticles();
}

/* ---- Lyric sync loop (rAF for smooth sync) ---- */
function lyricLoop() {
  if (!musicPlaying) return;
  const ct = bgMusic.currentTime;
  let idx   = -1;
  for (let i = LYRICS.length - 1; i >= 0; i--) {
    if (ct >= LYRICS[i].t) { idx = i; break; }
  }
  if (idx !== currentLyricIdx) {
    currentLyricIdx = idx;
    renderLyrics(idx);
  }
  lyricRaf = requestAnimationFrame(lyricLoop);
}

/* ---- Start music ---- */
function startMusic() {
  bgMusic.play().then(() => {
    musicPlaying = true;
    musicToggle.classList.add('playing');
    musicToggle.classList.remove('muted');
    lyricsOverlay.classList.add('visible');
    currentLyricIdx = -1;
    lyricRaf = requestAnimationFrame(lyricLoop);
  }).catch(() => {});
}

/* ---- Stop music ---- */
function stopMusic() {
  bgMusic.pause();
  musicPlaying = false;
  musicToggle.classList.remove('playing');
  musicToggle.classList.add('muted');
  lyricsOverlay.classList.remove('visible');
  if (lyricRaf) cancelAnimationFrame(lyricRaf);
  lyricRaf = null;
  lyricCurrent.innerHTML = '';
  lyricPrev.textContent  = '';
  lyricNext.textContent  = '';
}

/* ---- Toggle ---- */
musicToggle.addEventListener('click', () => {
  if (musicPlaying) stopMusic();
  else startMusic();
});

/* Auto-start after intro (5s) with slight delay for smoothness */
setTimeout(() => { startMusic(); }, 5400);

/* ---- Lyrics particle canvas burst ---- */
const lyricPC  = document.getElementById('lyricParticles');
const lyricPCX = lyricPC ? lyricPC.getContext('2d') : null;
let   lcParts  = [];

function resizeLyricCanvas() {
  if (!lyricPC) return;
  lyricPC.width  = lyricPC.offsetWidth  || window.innerWidth;
  lyricPC.height = lyricPC.offsetHeight || 120;
}
resizeLyricCanvas();
window.addEventListener('resize', resizeLyricCanvas, { passive: true });

function burstParticles() {
  if (!lyricPCX) return;
  const cx = (lyricPC.width || window.innerWidth) / 2;
  const cy = (lyricPC.height || 60) / 2;
  const colors = ['#4f8ef7','#7c5cbf','#ffd700','#ff6b6b','#00e5ff'];
  for (let i = 0; i < 22; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    lcParts.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      r: Math.random() * 3 + 1,
      life: 1,
      col: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  if (lcParts.length > 0 && !lcAnimRunning) animLyricParticles();
}

let lcAnimRunning = false;
function animLyricParticles() {
  if (!lyricPCX) return;
  lcAnimRunning = true;
  lyricPCX.clearRect(0, 0, lyricPC.width, lyricPC.height);
  lcParts = lcParts.filter(p => p.life > 0.01);
  lcParts.forEach(p => {
    p.x   += p.vx;
    p.y   += p.vy;
    p.vy  += 0.08;
    p.life -= 0.035;
    lyricPCX.beginPath();
    lyricPCX.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    lyricPCX.fillStyle = p.col;
    lyricPCX.globalAlpha = p.life;
    lyricPCX.fill();
    lyricPCX.globalAlpha = 1;
  });
  if (lcParts.length > 0) requestAnimationFrame(animLyricParticles);
  else { lcAnimRunning = false; lyricPCX.clearRect(0, 0, lyricPC.width, lyricPC.height); }
}
