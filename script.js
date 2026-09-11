document.addEventListener('DOMContentLoaded', () => {

  // ── MENÚ MÓVIL (HAMBURGUESA) ──
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navSocial = document.querySelector('.nav-social');

  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    navMenu.classList.remove('active');
    if (navSocial) navSocial.classList.remove('active');
    document.body.classList.remove('nav-open');
  }

  function openMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    navMenu.classList.add('active');
    if (navSocial) navSocial.classList.add('active');
    document.body.classList.add('nav-open');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    // Cierra el menú al hacer clic en un enlace
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Cierra el menú al hacer clic fuera de él
    document.addEventListener('click', e => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (!isOpen) return;
      const clickedInsideMenu = navMenu.contains(e.target) || navToggle.contains(e.target) || (navSocial && navSocial.contains(e.target));
      if (!clickedInsideMenu) closeMenu();
    });

    // Cierra el menú al redimensionar a escritorio
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });

    // Cierra el menú con la tecla Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ── CURSOR INTERACTIVO ──
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  (function animCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    
    if (cursor && ring) {
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
      ring.style.left   = rx + 'px';
      ring.style.top    = ry + 'px';
    }
    requestAnimationFrame(animCursor);
  })();

  // Se añade '.project-card' y '.cert-link' para que el cursor reaccione a tus proyectos
  document.querySelectorAll('a, button, .skill-cat, .stat-card, .brand-card, .project-card, .cert-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (ring && cursor) {
        ring.style.width = '54px';
        ring.style.height = '54px';
        ring.style.opacity = '0.8';
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      }
    });
    
    el.addEventListener('mouseleave', () => {
      if (ring && cursor) {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.opacity = '0.5';
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });
  });

  // ── CANVAS DE FONDO (HERO) ──
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function initP() {
      particles = [];
      const cols = Math.floor(W / 55), rows = Math.floor(H / 55);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push({
            x: (i / cols) * W + 27,
            y: (j / rows) * H + 27,
            ox: (i / cols) * W + 27,
            oy: (j / rows) * H + 27,
            r: Math.random() * 1.2 + 0.3,
            a: Math.random() * Math.PI * 2,
            s: Math.random() * 0.4 + 0.2,
            alpha: Math.random() * 0.35 + 0.08
          });
        }
      }
    }

    window.addEventListener('resize', () => { resize(); initP(); });
    resize();
    initP();

    let mX = W / 2, mY = H / 2;
    const heroSection = canvas.closest('section');
    if (heroSection) {
      heroSection.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mX = e.clientX - r.left;
        mY = e.clientY - r.top;
      });
    }

    (function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(137, 77, 248, 0.05)';
      ctx.lineWidth = 1;

      for (let x = 0; x < W; x += 55) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 55) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      particles.forEach(p => {
        p.a += p.s * 0.015;
        p.x = p.ox + Math.sin(p.a) * 6;
        p.y = p.oy + Math.cos(p.a * 0.8) * 6;

        const dx = mX - p.x, dy = mY - p.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          p.x -= dx * 0.04;
          p.y -= dy * 0.04;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 70) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(137, 77, 248, ${0.1 * (1 - d / 70)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  // ── SCROLL REVEAL ──
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

});