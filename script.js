document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     GSAP SCENE SYSTEM  (new)
     ========================================================= */
  const hasGSAP = typeof window.gsap !== 'undefined';
  const bgImages = {
  
  contact: 'assets/purple orange natural color palette sunset instagram post.png'
};
document.querySelectorAll('.bg-scene').forEach(scene => {
  const img = scene.querySelector('.bg-img');
  if (img) img.style.backgroundImage = "url('" + bgImages[scene.dataset.scene] + "')";
});
  const navButtons = document.querySelectorAll('header nav button');

  if (!hasGSAP) {
    // Fallback: original behaviour if GSAP failed to load
    navButtons.forEach(button => {
      button.addEventListener('click', function () {
        const target = document.querySelector(this.getAttribute('data-target'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  } else {
    if (window.ScrollToPlugin) gsap.registerPlugin(ScrollToPlugin);

    const order = ['home', 'about', 'skills', 'projects', 'contact'];
    const sections = order.map(id => document.getElementById(id));
    const bgScenes = {};
    order.forEach(id => (bgScenes[id] = document.querySelector('.bg-scene[data-scene="' + id + '"]')));
    const bar = document.getElementById('scene-progress');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // What animates in each section (existing elements only)
    const groups = {
      home: [
        { t: '#intro-text > *', from: { y: 40 }, stagger: 0.12 },
        { t: '#home .gradient-border', from: { scale: 0.85 }, dur: 1.2, at: 0.1 }
      ],
      about: [
        { t: '#about .about-heading', from: { x: -60 } },
        { t: '#about #box2', from: { y: 50 }, at: 0.15, dur: 1 }
      ],
      skills: [
        { t: '#skills .skills-heading', from: { x: -60 } },
        { t: '#skills .skill-item', from: { scale: 0.85, y: 30 }, stagger: 0.07, at: 0.1 }
      ],
      projects: [
        { t: '#projects .projects-heading', from: { x: -60 } },
        { t: '#projects .project-card', from: { y: i => (i % 2 ? 70 : 40), scale: 0.95 }, stagger: 0.12, at: 0.1 }
      ],
      contact: [
        { t: '#contact .contact-heading', from: { x: -60 } },
        { t: '#contact #box18', from: { y: 50 }, at: 0.15, dur: 1 },
        { t: '#contact .glow-btn', from: { scale: 0.5, y: 15 }, stagger: 0.1, at: 0.6, ease: 'back.out(1.6)' }
      ]
    };

    const targetsOf = id => groups[id].flatMap(g => gsap.utils.toArray(g.t));

    // Hide all content up-front; each scene reveals its own
    gsap.set(order.flatMap(targetsOf), { opacity: 0 });
    gsap.set(Object.values(bgScenes), { opacity: 0 });

   const contentIn = id => {
  const tl = gsap.timeline();
  groups[id].forEach(g => {
    const els = gsap.utils.toArray(g.t);
    if (!els.length) return;
    tl.fromTo(
      els,
      Object.assign({ opacity: 0 }, g.from),
      {
        opacity: 1, x: 0, y: 0, scale: 1,
        duration: g.dur || 0.9,
        ease: g.ease || 'power3.out',
        stagger: g.stagger || 0,
        overwrite: 'auto',
        clearProps: 'transform,opacity'
      },
      g.at || 0
    );
  });
  // NEW: framed photo drops in while the text box resizes
  if (id === 'about' && window.aboutFrameIn) tl.add(window.aboutFrameIn(), 0.1);
  return tl;
};

const contentOut = id => {
  // NEW: frame leaves and its column collapses
  if (id === 'about' && window.aboutFrameOut) window.aboutFrameOut();
  return gsap.to(targetsOf(id), {
    opacity: 0, y: -24, duration: 0.5, ease: 'power2.in',
    stagger: 0.03, overwrite: 'auto'
  });
};
    let current = null;
    let busy = false;
    let pending = null;
    let zTop = 1;

    const activeFromScroll = () => {
      const mid = window.innerHeight / 2;
      const hit = sections.find(s => {
        const r = s.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      });
      return hit ? hit.id : null;
    };

    function go(id, opts) {
      const scroll = !opts || opts.scroll !== false;

      if (busy) { if (scroll) pending = id; return; }
      if (id === current) {
        if (scroll) gsap.to(window, { scrollTo: { y: '#' + id }, duration: 0.8, ease: 'power3.inOut' });
        return;
      }

      busy = true;
      const prev = current;
      current = id;
      const dir = prev ? (order.indexOf(id) > order.indexOf(prev) ? 1 : -1) : 1;

      const scene = bgScenes[id];
      const img = scene.querySelector('.bg-img');
      const ov = scene.querySelector('.bg-overlay');

      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
        onComplete: () => {
          if (pending && pending !== current) { const p = pending; pending = null; go(p); return; }
          pending = null;
        }
      });
      if (reduceMotion) tl.timeScale(20);

      // 1. current content leaves
      if (prev) tl.add(contentOut(prev), 0);

      // 2. scroll to the section while everything plays
      if (scroll) {
        tl.to(window, { scrollTo: { y: '#' + id }, duration: 1.2, ease: 'power3.inOut' }, 0.15);
      }

      // 3. new background zooms in with parallax drift
      gsap.set(scene, { zIndex: ++zTop });
      tl.fromTo(scene, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 0.1)
        .fromTo(img, { scale: 1.15, xPercent: 3 * dir }, { scale: 1, xPercent: 0, duration: 2.2, ease: 'power3.out' }, 0.1)
        .fromTo(ov, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power1.inOut' }, 0.3);

      // old background drifts away, then is hidden once the new one is fully opaque
      if (prev) {
        const prevScene = bgScenes[prev];
        tl.to(prevScene.querySelector('.bg-img'), { scale: 1.06, xPercent: -2 * dir, duration: 1.4, ease: 'power2.inOut' }, 0.1)
          .set(prevScene, { opacity: 0 }, 1.3);
      }

      // thin glow line = transition progress
      if (bar) {
        tl.fromTo(bar, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
          .to(bar, { opacity: 0, duration: 0.4 }, 1.2);
      }

      // 4. new content staggers in
      tl.add(contentIn(id), prev ? 0.8 : 0.5);

      // unlock early so quick clicks feel responsive
      tl.call(() => {
        busy = false;
        if (pending && pending !== current) { const p = pending; pending = null; go(p); }
      }, null, 1.5);
    }

    // Navigation (same data-target buttons)
    navButtons.forEach(button => {
      button.addEventListener('click', function () {
        const target = document.querySelector(this.getAttribute('data-target'));
        if (target) go(target.id);
      });
    });

    // Manual scrolling also switches scenes
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking || busy) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const id = activeFromScroll();
        if (id && id !== current) go(id, { scroll: false });
      });
    }, { passive: true });

    // Opening scene
    go(activeFromScroll() || 'home', { scroll: false });
  }

  /* =========================================================
     YOUR EXISTING CODE (unchanged)
     ========================================================= */
  window.downloadCV = function () {
    const link = document.createElement('a');
    link.href = 'assets\\Swarnima Mohanta_CV.pdf';
    link.download = 'Swarnima_Mohanta_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const textElement = document.querySelector(".gradient-text");
  const texts = ["AI/ML Developer", "Coder"];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 70;
  const pauseBeforeDelete = 1500;
  const pauseBeforeType = 500;

  function typeWriter() {
    const currentText = texts[textIndex];
    if (isDeleting) {
      textElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => isDeleting = true, pauseBeforeDelete);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(() => {}, pauseBeforeType);
    }

    const currentSpeed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeWriter, currentSpeed);
  }

  typeWriter();
});
