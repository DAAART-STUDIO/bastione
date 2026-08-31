/**
 * dishes-wheel.js — Bastione CUISINE dish wheel.
 *
 * Twelve petals surround a circular "plate". Hovering, focusing or
 * tapping a petal swaps the large centre photo, its name and its
 * short description — all driven by data-i18n, so a language switch
 * always matches whatever dish is currently shown.
 */

export default function initDishesWheel() {
    const stage = document.querySelector('[data-dishes-wheel]');
  
    if (!stage) {
      return;
    }
  
    const petals = [...stage.querySelectorAll('[data-dish-petal]')];
    const centerImage = stage.querySelector('[data-dishes-center-image]');
    const centerLabel = stage.querySelector('[data-dishes-center-label]');
    const centerCaption = stage.querySelector('[data-dishes-center-caption]');
  
    if (!petals.length || !centerImage || !centerLabel || !centerCaption) {
      return;
    }
  
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const fadeDelay = reduceMotion ? 0 : 180;
  
    const setActive = (petal) => {
      if (petal.classList.contains('is-active')) {
        return;
      }
  
      const image = petal.querySelector('img');
      const name = petal.querySelector('[data-dish-name]');
      const description = petal.querySelector('[data-dish-description]');
  
      if (!image || !name || !description) {
        return;
      }
  
      petals.forEach((p) => {
        const isActive = p === petal;
  
        p.classList.toggle('is-active', isActive);
        p.setAttribute('aria-pressed', String(isActive));
      });
  
      centerImage.classList.add('is-fading');
  
      window.setTimeout(() => {
        centerImage.src = image.src;
        centerLabel.dataset.i18n = name.dataset.i18n;
        centerLabel.textContent = name.textContent;
        centerCaption.dataset.i18n = description.dataset.i18n;
        centerCaption.textContent = description.textContent;
        centerImage.classList.remove('is-fading');
      }, fadeDelay);
    };
  
    petals.forEach((petal) => {
      petal.addEventListener('mouseenter', () => setActive(petal));
      petal.addEventListener('focus', () => setActive(petal));
      petal.addEventListener('click', () => setActive(petal));
    });
  }