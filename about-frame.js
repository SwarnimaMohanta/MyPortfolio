(() => {
  const wrap  = document.querySelector('.about-portrait');
  const frame = document.getElementById('aboutFrame');
  if (!wrap || !frame || typeof gsap === 'undefined') return;

  const reduce  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesk  = () => window.matchMedia('(min-width: 901px)').matches;
  const GAP     = 40;

  // Hidden start state (only when GSAP is available; otherwise the frame just shows)
  function reset() {
    gsap.set(frame, { y: '-120vh', rotation: 0, opacity: 0 });
    if (isDesk()) gsap.set(wrap, { flexBasis: 0, marginRight: 0 });
    else gsap.set(wrap, { clearProps: 'flexBasis,marginRight' });
  }
  reset();

  // Called by portfolio.js when the About section opens
  window.aboutFrameIn = () => {
    const tl = gsap.timeline();

    if (reduce) {
      gsap.set(frame, { y: 0, rotation: 0, opacity: 1 });
      gsap.set(wrap, { clearProps: 'flexBasis,marginRight' });
      return tl;
    }

    // 1) column grows → text box resizes and slides right automatically
    if (isDesk()) {
      tl.fromTo(
        wrap,
        { flexBasis: 0, marginRight: 0 },
        { flexBasis: frame.offsetWidth, marginRight: GAP, duration: 1.1, ease: 'power3.inOut' },
        0
      );
    }

    // 2) frame drops in from above
    tl.fromTo(
      frame,
      { y: '-120vh', opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
      0.15
    );

    // 3) hung-picture swing as it settles
    tl.fromTo(
      frame,
      { rotation: 7 },
      { rotation: 0, duration: 1.8, ease: 'elastic.out(1, 0.35)' },
      0.35
    );

    return tl;
  };

  // Called when leaving About
  window.aboutFrameOut = () => {
    if (reduce) return;
    gsap.to(frame, { opacity: 0, y: -60, duration: 0.5, ease: 'power2.in', overwrite: 'auto' });
    if (isDesk()) {
      gsap.to(wrap, { flexBasis: 0, marginRight: 0, duration: 0.6, ease: 'power2.in', delay: 0.1, overwrite: 'auto' });
    }
  };
})();