/**
 * cuisine.js — Bastione CUISINE panel strip.
 *
 * Desktop expands panels on hover via CSS alone; this only adds the
 * click/tap toggle so touch devices (no :hover) can open one panel
 * at a time, keeping aria-pressed in sync.
 */

export default function initCuisine() {
    const panels = [
      ...document.querySelectorAll('[data-cuisine-panel]')
    ];
  
    if (!panels.length) {
      return;
    }
  
    const setActive = (target) => {
      panels.forEach((panel) => {
        const isActive = panel === target;
  
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-pressed', String(isActive));
      });
    };
  
    panels.forEach((panel) => {
      panel.addEventListener('click', () => setActive(panel));
    });
  }