/**
 * Bastione — VIEW Gallery
 *
 * Vanilla JS gallery inspired by the WTC CodePen interaction.
 * No GSAP / no external dependencies.
 *
 * Behaviour:
 * - active image fills the gallery
 * - inactive image becomes a floating thumbnail
 * - clicking thumbnail expands it to fullscreen
 * - previous active image becomes the new thumbnail
 * - keyboard + touch/swipe supported
 */

export function initViewGallery() {
    const gallery = document.querySelector('.view__gallery');
  
    if (!gallery) return;
  
    const items = [...gallery.querySelectorAll('.view__visual')];
  
    if (items.length < 2) return;
  
    const counter = gallery.querySelector('.view__gallery-counter');
  
    let activeIndex = 0;
    let isAnimating = false;
  
    const TRANSITION_DURATION = 1100;
  
    /*
     * ----------------------------------------------------------
     * Geometry
     * ----------------------------------------------------------
     *
     * Thumbnail position is calculated from the gallery size.
     * We use CSS variables so CSS handles the actual animation.
     */
  
    function getThumbnailGeometry() {
      const width = gallery.clientWidth;
      const height = gallery.clientHeight;
  
      const mobile = window.matchMedia('(max-width: 600px)').matches;
      const tablet = window.matchMedia('(max-width: 900px)').matches;
  
      if (mobile) {
        return {
          width: Math.min(width * 0.46, 240),
          height: Math.min(height * 0.30, 210),
          right: 16,
          bottom: 16,
        };
      }
  
      if (tablet) {
        return {
          width: Math.min(width * 0.34, 300),
          height: Math.min(height * 0.27, 230),
          right: 28,
          bottom: 28,
        };
      }
  
      return {
        width: Math.min(width * 0.30, 360),
        height: Math.min(height * 0.32, 250),
        right: 48,
        bottom: 48,
      };
    }
  
  
    /*
     * ----------------------------------------------------------
     * State
     * ----------------------------------------------------------
     */
  
    function updateCounter() {
      if (!counter) return;
  
      counter.textContent =
        `${String(activeIndex + 1).padStart(2, '0')} / ` +
        `${String(items.length).padStart(2, '0')}`;
    }
  
  
    function updateAria() {
      items.forEach((item, index) => {
        const active = index === activeIndex;
  
        item.setAttribute(
          'aria-current',
          active ? 'true' : 'false'
        );
  
        item.setAttribute(
          'aria-label',
          active
            ? 'Current view'
            : 'Open this view'
        );
      });
    }
  
  
    /*
     * ----------------------------------------------------------
     * Apply visual state
     * ----------------------------------------------------------
     */
  
    function applyState(animate = true) {
      const geometry = getThumbnailGeometry();
  
      gallery.style.setProperty(
        '--gallery-thumb-width',
        `${geometry.width}px`
      );
  
      gallery.style.setProperty(
        '--gallery-thumb-height',
        `${geometry.height}px`
      );
  
      gallery.style.setProperty(
        '--gallery-thumb-right',
        `${geometry.right}px`
      );
  
      gallery.style.setProperty(
        '--gallery-thumb-bottom',
        `${geometry.bottom}px`
      );
  
      items.forEach((item, index) => {
        const isActive = index === activeIndex;
  
        item.classList.toggle(
          'is-active',
          isActive
        );
  
        item.classList.toggle(
          'is-preview',
          !isActive
        );
  
        item.dataset.index = index;
      });
  
      updateCounter();
      updateAria();
  
      if (!animate) {
        gallery.classList.add('is-initialized');
  
        requestAnimationFrame(() => {
          gallery.classList.add('is-ready');
        });
  
        return;
      }
  
      gallery.classList.add('is-animating');
  
      window.setTimeout(() => {
        gallery.classList.remove('is-animating');
      }, TRANSITION_DURATION);
    }
  
  
    /*
     * ----------------------------------------------------------
     * Activate slide
     * ----------------------------------------------------------
     */
  
    function activate(index) {
      if (isAnimating) return;
  
      if (index < 0) {
        index = items.length - 1;
      }
  
      if (index >= items.length) {
        index = 0;
      }
  
      if (index === activeIndex) return;
  
      isAnimating = true;
  
      activeIndex = index;
  
      applyState(true);
  
      window.setTimeout(() => {
        isAnimating = false;
      }, TRANSITION_DURATION + 50);
    }
  
  
    /*
     * ----------------------------------------------------------
     * Click
     * ----------------------------------------------------------
     */
  
    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        activate(index);
      });
  
      item.addEventListener('keydown', (event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
  
          activate(index);
        }
      });
    });
  
  
    /*
     * ----------------------------------------------------------
     * Keyboard
     * ----------------------------------------------------------
     */
  
    gallery.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
  
        activate(
          (activeIndex + 1) % items.length
        );
      }
  
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
  
        activate(
          (activeIndex - 1 + items.length) %
          items.length
        );
      }
    });
  
  
    /*
     * ----------------------------------------------------------
     * Touch / swipe
     * ----------------------------------------------------------
     */
  
    let touchStartX = 0;
    let touchStartY = 0;
  
    gallery.addEventListener(
      'touchstart',
      (event) => {
        if (!event.touches.length) return;
  
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      },
      { passive: true }
    );
  
  
    gallery.addEventListener(
      'touchend',
      (event) => {
        if (!event.changedTouches.length) return;
  
        const touch = event.changedTouches[0];
  
        const deltaX =
          touch.clientX - touchStartX;
  
        const deltaY =
          touch.clientY - touchStartY;
  
        /*
         * Ignore vertical scrolling.
         */
  
        if (
          Math.abs(deltaX) < 50 ||
          Math.abs(deltaX) < Math.abs(deltaY)
        ) {
          return;
        }
  
        if (deltaX < 0) {
          activate(
            (activeIndex + 1) % items.length
          );
        } else {
          activate(
            (activeIndex - 1 + items.length) %
            items.length
          );
        }
      },
      { passive: true }
    );
  
  
    /*
     * ----------------------------------------------------------
     * Resize
     * ----------------------------------------------------------
     */
  
    let resizeTimer;
  
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
  
      resizeTimer = window.setTimeout(() => {
        applyState(false);
      }, 100);
    });
  
  
    /*
     * ----------------------------------------------------------
     * Initial state
     * ----------------------------------------------------------
     */
  
    applyState(false);
  }