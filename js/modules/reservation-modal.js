export function initReservationModal() {
    const modal = document.querySelector('#reservation-modal');
  
    if (!modal) return;
  
    const openButtons = document.querySelectorAll('[data-reservation-open]');
    const closeButtons = modal.querySelectorAll('[data-reservation-close]');
    const dialog = modal.querySelector('.reservation-modal__dialog');
  
    if (!openButtons.length || !dialog) return;
  
    let lastFocusedElement = null;
  
  
    /* =========================================================
       OPEN
       ========================================================= */
  
    function openModal(button = null) {
      lastFocusedElement = button || document.activeElement;
  
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
  
      document.documentElement.classList.add('is-reservation-open');
      document.body.classList.add('is-reservation-open');
  
      /*
       * Prevent the page behind the modal from scrolling.
       * Padding compensates for the scrollbar disappearing.
       */
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
  
      if (scrollbarWidth > 0) {
        document.documentElement.style.setProperty(
          '--reservation-scrollbar-width',
          `${scrollbarWidth}px`
        );
      }
  
      requestAnimationFrame(() => {
        const closeButton = modal.querySelector('.reservation-modal__close');
  
        if (closeButton) {
          closeButton.focus();
        }
      });
    }
  
  
    /* =========================================================
       CLOSE
       ========================================================= */
  
    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
  
      document.documentElement.classList.remove('is-reservation-open');
      document.body.classList.remove('is-reservation-open');
  
      document.documentElement.style.removeProperty(
        '--reservation-scrollbar-width'
      );
  
      /*
       * Return focus to the button that opened the modal.
       */
      if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === 'function'
      ) {
        lastFocusedElement.focus();
      }
  
      lastFocusedElement = null;
    }
  
  
    /* =========================================================
       OPEN BUTTONS
       ========================================================= */
  
    openButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
  
        openModal(button);
      });
    });
  
  
    /* =========================================================
       CLOSE BUTTONS
       ========================================================= */
  
    closeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        closeModal();
      });
    });
  
  
    /* =========================================================
       ESCAPE
       ========================================================= */
  
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
  
      if (!modal.classList.contains('is-open')) return;
  
      closeModal();
    });
  
  
    /* =========================================================
       FOCUS TRAP
       ========================================================= */
  
    modal.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
  
      const focusableElements = modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
  
      if (!focusableElements.length) return;
  
      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1];
  
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }
  
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    });
  
  
    /* =========================================================
       PREVENT SCROLLING INSIDE PAGE
       ========================================================= */
  
    modal.addEventListener('wheel', (event) => {
      /*
       * Allow normal scrolling inside the dialog.
       * The event is intentionally not prevented.
       */
    }, { passive: true });
  
  
    /* =========================================================
       PUBLIC API
       ========================================================= */
  
    window.reservationModal = {
      open: openModal,
      close: closeModal
    };
  }