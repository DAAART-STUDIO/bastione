/**
 * scroll-progress.js
 * Bastione vertical scroll progress indicator.
 */

export function initScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
  
    if (!progress) return;
  
    const bar = progress.querySelector('.scroll-progress__bar');
    const thumb = progress.querySelector('.scroll-progress__thumb');
    const value = progress.querySelector('.scroll-progress__value');
  
    if (!bar || !thumb || !value) return;
  
    let ticking = false;
    let scrollTimeout;
  
    function update() {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
  
      const percent = scrollHeight > 0
        ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
        : 0;
  
      bar.style.height = `${percent}%`;
      thumb.style.top = `${percent}%`;
      value.textContent = `${Math.round(percent)}%`;
  
      progress.classList.toggle(
        'is-complete',
        percent >= 99.5
      );
  
      ticking = false;
    }
  
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
  
      progress.classList.add('is-scrolling');
  
      clearTimeout(scrollTimeout);
  
      scrollTimeout = setTimeout(() => {
        progress.classList.remove('is-scrolling');
      }, 700);
    }
  
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
  
    window.addEventListener('resize', update);
  
    update();
  }