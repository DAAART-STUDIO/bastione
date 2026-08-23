/**
 * experience.js — wave photo strip overlaid on the View gallery.
 *
 * Finite, native scroll — no loop. The strip lives inside a plain
 * `overflow-y: auto` track; once it reaches its own top or bottom,
 * `overscroll-behavior` is left at its default so the scroll simply
 * chains up to the page, carrying the visitor into the next section.
 * This module only reads scroll position to apply a per-item
 * sine-wave sideways offset — it never changes scrollTop itself.
 *
 * Desktop pointers additionally get a click-and-drag affordance on
 * top of native scrolling. Touch relies on native momentum scrolling
 * only, so it never fights the page's own vertical scroll.
 */

const initExperience = () => {
    const track = document.querySelector('[data-wave-track]');
    const items = track ? [...track.querySelectorAll('[data-wave-item]')] : [];
  
    if (!track || !items.length) {
      return;
    }
  
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    let ticking = false;
  
    const applyWave = () => {
      ticking = false;
  
      if (reducedMotion) {
        return;
      }
  
      const scrollTop = track.scrollTop;
  
      items.forEach((item, i) => {
        const center = item.offsetTop + item.offsetHeight / 2 - scrollTop;
        const offset = Math.sin(center * 0.012 + i * 0.4) * 18;
        item.style.transform = `translateX(${offset}px)`;
      });
    };
  
    track.addEventListener(
      'scroll',
      () => {
        if (ticking) {
          return;
        }
  
        ticking = true;
        window.requestAnimationFrame(applyWave);
      },
      { passive: true }
    );
  
    applyWave();
  
    /*
     * Pointer-only: click-and-drag on top of native scrolling.
     */
    if (window.matchMedia('(pointer: fine)').matches) {
      let isDragging = false;
      let startY = 0;
      let startScrollTop = 0;
  
      const onDown = (event) => {
        isDragging = true;
        startY = event.clientY;
        startScrollTop = track.scrollTop;
        track.classList.add('is-dragging');
        event.preventDefault();
      };
  
      const onMove = (event) => {
        if (!isDragging) {
          return;
        }
  
        track.scrollTop = startScrollTop - (event.clientY - startY);
      };
  
      const onUp = () => {
        isDragging = false;
        track.classList.remove('is-dragging');
      };
  
      track.addEventListener('mousedown', onDown);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    }
  };
  
  export default initExperience;