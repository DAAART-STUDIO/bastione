/**
 * experience.js — Bastione EXPERIENCE floating cards.
 *
 * Desktop only (≥1024px): five cards drop in with a soft bounce,
 * drift gently at rest, tilt toward the cursor on hover, and the
 * whole group parallaxes with the mouse. GSAP + ScrollTrigger
 * drive it, loaded via CDN in index.html.
 *
 * Mobile, prefers-reduced-motion, or GSAP failing to load (e.g. no
 * network): cards simply sit in the static CSS grid defined in
 * experience.css. No JS branch below is required for that state —
 * it's the default appearance before this module touches anything.
 */

const initExperience = () => {
    const section = document.querySelector('#experience');
  
    if (!section || !window.gsap) {
      return;
    }
  
    const { gsap, ScrollTrigger } = window;
  
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
  
    const cards = [...section.querySelectorAll('[data-experience-card]')];
    const indexItems = [...section.querySelectorAll('.experience__index li')];
    const stage = section.querySelector('[data-experience-stage]');
  
    if (!cards.length || !stage) {
      return;
    }
  
    const mm = gsap.matchMedia();
  
    mm.add('(min-width: 1024px)', () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
      cards.forEach((card) => {
        card.dataset.restRot = parseFloat(card.dataset.rot) || 0;
      });
  
      /*
       * Reduced motion: land everything in its resting place
       * instantly, skip entrance, idle float, parallax and tilt.
       */
      if (reduced) {
        gsap.set(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: (i, el) => parseFloat(el.dataset.restRot) || 0,
        });
  
        if (indexItems.length) {
          gsap.set(indexItems, { opacity: 1, x: 0 });
        }
  
        return;
      }
  
      /*
       * ----------------------------------------------------------
       * Entrance
       * ----------------------------------------------------------
       */
  
      gsap.set(cards, {
        y: -70,
        opacity: 0,
        scale: 0.85,
        rotation: (i, el) => (parseFloat(el.dataset.restRot) || 0) + 18,
      });
  
      if (indexItems.length) {
        gsap.set(indexItems, { opacity: 0, x: 12 });
      }
  
      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });
  
      entrance
        .to(indexItems, { opacity: 1, x: 0, duration: 0.6, stagger: 0.06 }, 0)
        .to(
          cards,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: (i, el) => parseFloat(el.dataset.restRot) || 0,
            duration: 1,
            stagger: { each: 0.09, from: 'center' },
            ease: 'back.out(1.5)',
          },
          0.1
        );
  
      /*
       * ----------------------------------------------------------
       * Continuous idle float
       * ----------------------------------------------------------
       */
  
      const floats = cards.map((card, i) =>
        gsap.to(card, {
          y: `+=${5 + (i % 3) * 3}`,
          duration: 2.6 + (i % 3) * 0.5,
          delay: 0.6 + i * 0.08,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      );
  
      /*
       * ----------------------------------------------------------
       * Pointer-only: mouse parallax on the group + per-card tilt
       * ----------------------------------------------------------
       */
  
      const cleanups = [];
  
      if (window.matchMedia('(pointer: fine)').matches) {
        let mx = 0;
        let my = 0;
        let tx = 0;
        let ty = 0;
        let raf;
  
        const onStageMove = (event) => {
          const rect = stage.getBoundingClientRect();
          mx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          my = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        };
  
        const onStageLeave = () => {
          mx = 0;
          my = 0;
        };
  
        const tick = () => {
          tx += (mx - tx) * 0.06;
          ty += (my - ty) * 0.06;
  
          cards.forEach((card, i) => {
            const depth = 6 + (i % 4) * 2;
            card.style.translate = `${tx * depth}px ${ty * depth * 0.6}px`;
          });
  
          raf = requestAnimationFrame(tick);
        };
  
        stage.addEventListener('mousemove', onStageMove);
        stage.addEventListener('mouseleave', onStageLeave);
        raf = requestAnimationFrame(tick);
  
        cleanups.push(() => {
          cancelAnimationFrame(raf);
          stage.removeEventListener('mousemove', onStageMove);
          stage.removeEventListener('mouseleave', onStageLeave);
        });
  
        cards.forEach((card, i) => {
          const restRot = parseFloat(card.dataset.restRot) || 0;
          const indexItem = indexItems[i];
  
          const onCardMove = (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
  
            gsap.to(card, {
              rotateX: -py * 10,
              rotateY: px * 10,
              rotation: restRot * 0.3,
              scale: 1.08,
              zIndex: 20,
              duration: 0.4,
              ease: 'power2.out',
              transformPerspective: 700,
              overwrite: 'auto',
            });
  
            indexItem?.classList.add('is-focused');
          };
  
          const onCardLeave = () => {
            gsap.to(card, {
              rotateX: 0,
              rotateY: 0,
              rotation: restRot,
              scale: 1,
              zIndex: '',
              duration: 0.7,
              ease: 'elastic.out(1, 0.6)',
              overwrite: 'auto',
            });
  
            indexItem?.classList.remove('is-focused');
          };
  
          card.addEventListener('mousemove', onCardMove);
          card.addEventListener('mouseleave', onCardLeave);
  
          cleanups.push(() => {
            card.removeEventListener('mousemove', onCardMove);
            card.removeEventListener('mouseleave', onCardLeave);
          });
        });
      }
  
      return () => {
        floats.forEach((tween) => tween.kill());
        cleanups.forEach((cleanup) => cleanup());
      };
    });
  };
  
  export default initExperience;