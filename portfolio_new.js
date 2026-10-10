(() => {
  const stage = document.getElementById('stage');
  if (!stage || typeof gsap === 'undefined') return;

  // Reduced motion: keep the static illustration
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const $ = s => stage.querySelector(s);
  const layer = {
    base: $('.gl-base'),
    hair: $('.gl-hair'),
    body: $('.gl-body'),
    head: $('.gl-head'),
    strands: $('.gl-strands'),
    glow: $('.gl-glow')
  };

  gsap.set([layer.head, layer.strands, layer.hair, layer.body], { transformPerspective: 900 });

  /* ---------- quickTo setters (mouse tracking) ---------- */
  const qt = (el, props, d) =>
    Object.fromEntries(props.map(p => [p, gsap.quickTo(el, p, { duration: d, ease: 'power2.out' })]));

  const head    = qt(layer.head,    ['x', 'y', 'rotation', 'rotationY', 'rotationX'], 1.0);
  const strands = qt(layer.strands, ['x', 'y', 'rotation', 'rotationY'], 1.15);
  const hair    = qt(layer.hair,    ['x', 'y', 'rotation'], 1.4);
  const body    = qt(layer.body,    ['x', 'y'], 1.3);
  const base    = qt(layer.base,    ['x', 'y'], 1.6);
  const glow    = qt(layer.glow,    ['x', 'y'], 1.8);

  const clamp = v => Math.max(-1, Math.min(1, v));

  function aim(nx, ny) {
    // head: gentle turn / tilt, chin up when cursor goes up
    head.rotation(nx * 3);
    head.rotationY(nx * 8);
    head.rotationX(-ny * 5);
    head.x(nx * 8);
    head.y(ny * 6);

    // front strands move slightly more than the head
    strands.x(nx * 12);
    strands.y(ny * 8);
    strands.rotation(nx * 3.5);
    strands.rotationY(nx * 10);

    // hair behind: opposite direction for depth
    hair.x(-nx * 10);
    hair.y(-ny * 5);
    hair.rotation(-nx * 1.2);

    // shoulders / suit and background
    body.x(nx * 4);
    body.y(ny * 2);
    base.x(-nx * 6);
    base.y(-ny * 4);

    // rim light shifts with the cursor
    glow.x(-nx * 24);
    glow.y(-ny * 16);
  }

  /* ---------- pointer → normalized (-1..1) relative to the portrait ---------- */
  let visible = true;

  function track(e) {
    if (!visible) return;
    const r = stage.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.3;           // head height, not image center

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // symmetric range: far-left and far-right of the screen both reach ±1
    const nx = dx < 0 ? dx / Math.max(cx, 1) : dx / Math.max(innerWidth - cx, 1);
    const ny = dy < 0 ? dy / Math.max(cy, 1) : dy / Math.max(innerHeight - cy, 1);

    aim(clamp(nx), clamp(ny));
  }

  window.addEventListener('pointermove', track, { passive: true });

  // cursor leaves window / tab loses focus / touch ends → return to original pose
  document.documentElement.addEventListener('mouseleave', () => aim(0, 0));
  window.addEventListener('blur', () => aim(0, 0));
  window.addEventListener('pointerup', e => {
    if (e.pointerType === 'touch') aim(0, 0);
  });

  /* ---------- idle animation (on inner wrappers, so it adds to mouse movement) ---------- */
  const idle = [
    // breathing
    gsap.to(layer.body.firstElementChild, {
      scaleY: 1.008, transformOrigin: '50% 100%',
      duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1
    }),
    // tiny head float
    gsap.to(layer.head.firstElementChild, {
      y: -2, rotation: 0.6, transformOrigin: '48% 46%',
      duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1
    }),
    // floating hair
    gsap.to(layer.hair.firstElementChild, {
      x: 3, y: 2, rotation: 0.8, transformOrigin: '50% 30%',
      duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1
    }),
    gsap.to(layer.strands.firstElementChild, {
      x: -2.5, y: 2, rotation: -0.7, transformOrigin: '48% 30%',
      duration: 2.9, ease: 'sine.inOut', yoyo: true, repeat: -1
    }),
    // glow pulse
    gsap.to(layer.glow, {
      opacity: 0.55, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1
    })
  ];

  // Home section off-screen → pause idle + tracking (saves battery on mobile),
  // and settle back to the neutral pose
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    idle.forEach(t => (visible ? t.play() : t.pause()));
    if (!visible) aim(0, 0);
  }, { threshold: 0.05 }).observe(stage);
})();