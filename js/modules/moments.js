/**
 * moments.js — Bastione scattered photo gallery.
 */

export default function initMoments() {

    const section = document.querySelector('#moments');
  
    if (!section) {
      return;
    }
  
    const stage = section.querySelector('[data-moments-stage]');
    const cards = [
      ...section.querySelectorAll('[data-moment-card]')
    ];
  
    if (!stage || !cards.length) {
      return;
    }
  
  
    /* =======================================================
       CONFIG
       ======================================================= */
  
    const revealDuration = 900;
    const revealStagger = 110;
    const hoverScale = 1.035;
    const dragPadding = 18;
  
  
    /* =======================================================
       STATE
       ======================================================= */
  
    let highestZ = 10;
  
    let activeCard = null;
  
    let isDragging = false;
  
    let pointerId = null;
  
    let startPointerX = 0;
    let startPointerY = 0;
  
    let startX = 0;
    let startY = 0;
  
    let currentX = 0;
    let currentY = 0;
  
    let initialized = false;
  
  
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  
  
    /* =======================================================
       HELPERS
       ======================================================= */
  
    const getRotation = (card) => {
  
      const value = parseFloat(
        card.dataset.rotation || '0'
      );
  
      return Number.isFinite(value)
        ? value
        : 0;
    };
  
  
    const getPosition = (card) => {
  
      return {
        x: parseFloat(card.dataset.x || '0'),
        y: parseFloat(card.dataset.y || '0')
      };
    };
  
  
    const setPosition = (card, x, y) => {
  
      card.dataset.x = x;
      card.dataset.y = y;
    };
  
  
    const setTransform = (
      card,
      x,
      y,
      rotation,
      scale = 1
    ) => {
  
      card.style.transform = `
        translate3d(${x}px, ${y}px, 0)
        rotate(${rotation}deg)
        scale(${scale})
      `;
    };
  
  
    const bringToFront = (card) => {
  
      highestZ += 1;
  
      card.style.zIndex = highestZ;
    };
  
  
    /* =======================================================
       INITIAL STACK
       ======================================================= */
  
    const prepareCards = () => {
  
      cards.forEach((card, index) => {
  
        const rotation = getRotation(card);
  
        const stackOffset =
          (index - (cards.length - 1) / 2) * 2;
  
        setPosition(
          card,
          stackOffset,
          stackOffset
        );
  
        card.style.zIndex = index + 1;
  
        if (reduceMotion) {
  
          setTransform(
            card,
            0,
            0,
            rotation,
            1
          );
  
        } else {
  
          setTransform(
            card,
            stackOffset,
            stackOffset,
            rotation * 0.35,
            0.96
          );
  
        }
  
      });
    };
  
  
    /* =======================================================
       REVEAL
       ======================================================= */
  
    const revealCards = () => {
  
      if (initialized) {
        return;
      }
  
      initialized = true;
  
  
      cards.forEach((card, index) => {
  
        const rotation =
          getRotation(card);
  
        const delay =
          reduceMotion
            ? 0
            : index * revealStagger;
  
  
        window.setTimeout(() => {
  
          setPosition(
            card,
            0,
            0
          );
  
          setTransform(
            card,
            0,
            0,
            rotation,
            1
          );
  
        }, delay);
  
      });
  
    };
  
  
    /* =======================================================
       OBSERVER
       ======================================================= */
  
    const observer = new IntersectionObserver(
      (entries) => {
  
        entries.forEach((entry) => {
  
          if (
            entry.isIntersecting &&
            entry.intersectionRatio > 0.15
          ) {
  
            revealCards();
  
            observer.disconnect();
  
          }
  
        });
  
      },
      {
        threshold: [0.15]
      }
    );
  
  
    observer.observe(section);
  
  
    /* =======================================================
       DRAG START
       ======================================================= */
  
    const startDrag = (event, card) => {
  
      if (
        event.pointerType === 'mouse' &&
        event.button !== 0
      ) {
        return;
      }
  
  
      activeCard = card;
  
      isDragging = true;
  
      pointerId = event.pointerId;
  
  
      bringToFront(card);
  
  
      startPointerX = event.clientX;
      startPointerY = event.clientY;
  
  
      const position =
        getPosition(card);
  
  
      startX = position.x;
      startY = position.y;
  
  
      currentX = startX;
      currentY = startY;
  
  
      card.classList.add('is-dragging');
  
  
      try {
        card.setPointerCapture(pointerId);
      } catch {
        // Pointer capture may not be supported.
      }
  
  
      event.preventDefault();
    };
  
  
    /* =======================================================
       DRAG MOVE
       ======================================================= */
  
    const moveDrag = (event) => {
  
      if (
        !isDragging ||
        !activeCard ||
        event.pointerId !== pointerId
      ) {
        return;
      }
  
  
      const deltaX =
        event.clientX - startPointerX;
  
      const deltaY =
        event.clientY - startPointerY;
  
  
      let nextX =
        startX + deltaX;
  
      let nextY =
        startY + deltaY;
  
  
      const stageRect =
        stage.getBoundingClientRect();
  
      const cardRect =
        activeCard.getBoundingClientRect();
  
  
      const maxX =
        stageRect.width -
        cardRect.width +
        dragPadding;
  
  
      const maxY =
        stageRect.height -
        cardRect.height +
        dragPadding;
  
  
      nextX = Math.max(
        -dragPadding,
        Math.min(nextX, maxX)
      );
  
  
      nextY = Math.max(
        -dragPadding,
        Math.min(nextY, maxY)
      );
  
  
      currentX = nextX;
      currentY = nextY;
  
  
      setTransform(
        activeCard,
        currentX,
        currentY,
        getRotation(activeCard),
        hoverScale
      );
  
  
      event.preventDefault();
    };
  
  
    /* =======================================================
       DRAG END
       ======================================================= */
  
    const endDrag = (event) => {
  
      if (
        !isDragging ||
        !activeCard
      ) {
        return;
      }
  
  
      if (
        event.pointerId !== undefined &&
        event.pointerId !== pointerId
      ) {
        return;
      }
  
  
      const card =
        activeCard;
  
  
      isDragging = false;
  
      pointerId = null;
  
      activeCard = null;
  
  
      card.classList.remove(
        'is-dragging'
      );
  
  
      setPosition(
        card,
        currentX,
        currentY
      );
  
  
      card.style.transition =
        'transform 260ms var(--ease-smooth)';
  
  
      setTransform(
        card,
        currentX,
        currentY,
        getRotation(card),
        1
      );
  
  
      window.setTimeout(() => {
  
        card.style.transition = '';
  
      }, 300);
  
    };
  
  
    /* =======================================================
       HOVER
       ======================================================= */
  
    const hoverIn = (event, card) => {
  
      if (
        isDragging ||
        event.pointerType !== 'mouse'
      ) {
        return;
      }
  
  
      bringToFront(card);
  
  
      const position =
        getPosition(card);
  
  
      setTransform(
        card,
        position.x,
        position.y,
        getRotation(card),
        hoverScale
      );
  
    };
  
  
    const hoverOut = (event, card) => {
  
      if (
        isDragging ||
        event.pointerType !== 'mouse'
      ) {
        return;
      }
  
  
      const position =
        getPosition(card);
  
  
      setTransform(
        card,
        position.x,
        position.y,
        getRotation(card),
        1
      );
  
    };
  
  
    /* =======================================================
       EVENTS
       ======================================================= */
  
    cards.forEach((card) => {
  
      card.addEventListener(
        'pointerdown',
        (event) => {
          startDrag(event, card);
        }
      );
  
  
      card.addEventListener(
        'pointermove',
        moveDrag
      );
  
  
      card.addEventListener(
        'pointerup',
        endDrag
      );
  
  
      card.addEventListener(
        'pointercancel',
        endDrag
      );
  
  
      card.addEventListener(
        'pointerenter',
        (event) => {
          hoverIn(event, card);
        }
      );
  
  
      card.addEventListener(
        'pointerleave',
        (event) => {
          hoverOut(event, card);
        }
      );
  
  
      const image =
        card.querySelector('img');
  
  
      if (image) {
  
        image.addEventListener(
          'dragstart',
          (event) => {
            event.preventDefault();
          }
        );
  
      }
  
    });
  
  
    /* =======================================================
       INITIALIZE
       ======================================================= */
  
    prepareCards();
  
  
    const rect =
      section.getBoundingClientRect();
  
  
    if (
      rect.top < window.innerHeight * 0.85 &&
      rect.bottom > 0
    ) {
  
      window.setTimeout(
        revealCards,
        150
      );
  
    }
  
  }