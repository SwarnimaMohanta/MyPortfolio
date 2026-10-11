(() => {
  if (typeof gsap === 'undefined') return;

  const section = document.getElementById('skills');
  if (!section) return;

  const reduce  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  const cards = gsap.utils.toArray('#skills .sk-card');
  const logos = gsap.utils.toArray('#skills .sk-logo');
  const bars  = gsap.utils.toArray('#skills .sk-bar i');
  const lines = gsap.utils.toArray('#skills .sk-lines path');
  const dots  = gsap.utils.toArray('#skills .sk-dot');

  // read each bar's level from its inline width, then start empty
  const levels = bars.map(b => b.style.width || '80%');
  gsap.set(bars, { width: '0%' });

  // light-sweep element on every tile
  const shines = cards.map(c => {
    const s = document.createElement('span');
    s.className = 'sk-shine';
    c.appendChild(s);
    return s;
  });

  /* ---------- entrance extras (called from portfolio.js) ---------- */
  window.skillsIn = () => {
    const tl = gsap.timeline();

    if (reduce) {
      gsap.set(bars, { width: i => levels[i] });
      gsap.set(lines, { strokeDashoffset: 0 });
      return tl;
    }

    const grid = { each: 0.08, grid: [3, 3], from: 'start' };

    // decorative lines draw themselves
    tl.fromTo(lines, { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.6, ease: 'power2.out', stagger: 0.15 }, 0);

    // progress bars fill
    tl.fromTo(bars, { width: '0%' },
      { width: i => levels[i], duration: 1.2, ease: 'power3.out', stagger: grid }, 0.7);

    // light sweep across each tile
    tl.fromTo(shines, { xPercent: -150 },
      { xPercent: 450, duration: 0.9, ease: 'power2.inOut', stagger: grid }, 0.6);

    return tl;
  };

  window.skillsOut = () => {
    gsap.delayedCall(0.5, () => gsap.set(bars, { width: '0%' }));
  };

  if (reduce) return;

  /* ---------- hover: 3D tilt + lift (desktop only) ---------- */
  if (canHover) {
    cards.forEach(card => {
      card.addEventListener('pointermove', e => {
        const r  = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width  - 0.5;
        const py = (e.clientY - r.top)  / r.height - 0.5;
        card.classList.add('is-hover');
        gsap.to(card, {
          rotationY: px * 14, rotationX: -py * 14,
          y: -8, scale: 1.05, transformPerspective: 700,
          duration: 0.4, ease: 'power2.out', overwrite: 'auto'
        });
      });

      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-hover');
        gsap.to(card, {
          rotationX: 0, rotationY: 0, y: 0, scale: 1,
          duration: 0.6, ease: 'power3.out', overwrite: 'auto'
        });
      });
    });
  }

  /* ---------- idle: floating logos + twinkling dots ---------- */
  const idle = [
    gsap.to(logos, {
      y: -6, duration: () => 2 + Math.random() * 1.5,
      ease: 'sine.inOut', yoyo: true, repeat: -1,
      stagger: { each: 0.2, from: 'random' }
    }),
    gsap.to(dots, {
      opacity: 0.25, scale: 0.7, duration: () => 1.5 + Math.random() * 2,
      ease: 'sine.inOut', yoyo: true, repeat: -1,
      stagger: { each: 0.3, from: 'random' }
    })
  ];

  // pause idle animations when Skills is off-screen
  new IntersectionObserver(([entry]) => {
    idle.forEach(t => (entry.isIntersecting ? t.play() : t.pause()));
  }, { threshold: 0.05 }).observe(section);
})();