/**
 * scroll-morph.js — Cinematic scroll-pinned photo morph.
 *
 * A handful of photo fragments gather at the centre, scatter
 * across the frame, then dissolve into a single full-bleed image
 * as the reader scrolls through the section — used by The Place
 * and Events.
 *
 * Pinning comes from CSS `position: sticky` on [data-morph-stage];
 * this module only measures scroll progress through the tall
 * [data-scroll-morph] wrapper and exposes it as four CSS custom
 * properties. Every visual detail (scatter position, opacity,
 * scale) stays declarative in place.css / events.css.
 *
 * No GSAP, no external dependencies — same approach as
 * view-gallery.js and moments.js.
 */

const PHASES = [
    ['gather', 0, 0.22],
    ['scatter', 0.22, 0.55],
    ['merge', 0.55, 0.8],
    ['reveal', 0.8, 1],
  ];
  
  function phaseProgress(progress, start, end) {
    if (progress <= start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / (end - start);
  }
  
  function applyProgress(wrapper, progress) {
    wrapper.style.setProperty('--progress', progress.toFixed(3));
  
    PHASES.forEach(([key, start, end]) => {
      wrapper.style.setProperty(
        `--p-${key}`,
        phaseProgress(progress, start, end).toFixed(3)
      );
    });
  }
  
  function watch(wrapper) {
    let ticking = false;
  
    const measure = () => {
      ticking = false;
  
      const rect = wrapper.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
  
      const progress = scrollable > 0
        ? Math.min(1, Math.max(0, -rect.top / scrollable))
        : 1;
  
      applyProgress(wrapper, progress);
    };
  
    const request = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    };
  
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
  
    measure();
  }
  
  export function initScrollMorph() {
    const wrappers = [...document.querySelectorAll('[data-scroll-morph]')];
  
    if (!wrappers.length) return;
  
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  
    wrappers.forEach((wrapper) => {
      if (reduceMotion) {
        applyProgress(wrapper, 1);
        return;
      }
      watch(wrapper);
    });
  }