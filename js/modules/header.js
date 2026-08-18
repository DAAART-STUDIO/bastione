/**
 * header.js — Bastione header scroll state.
 */

export function initHeader() {
    const header = document.querySelector('[data-header]');
  
    if (!header) return;
  
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
  
    update();
  
    window.addEventListener('scroll', update, {
      passive: true,
    });
  }