// Mobile gesture utilities for enhanced touch interactions

export class MobileGestureHandler {
  constructor() {
    this.touchStart = null;
    this.touchEnd = null;
    this.minSwipeDistance = 50;
    this.maxSwipeTime = 300;
    this.tapTimeout = null;
    this.doubleTapDelay = 300;
    this.longPressDelay = 500;
  }

  // Handle swipe gestures
  handleSwipe(touchStartEvent, touchEndEvent, callbacks = {}) {
    if (!touchStartEvent || !touchEndEvent) return null;

    const deltaX = touchEndEvent.changedTouches[0].clientX - touchStartEvent.touches[0].clientX;
    const deltaY = touchEndEvent.changedTouches[0].clientY - touchStartEvent.touches[0].clientY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const swipeTime = touchEndEvent.timeStamp - touchStartEvent.timeStamp;

    // Check if it's a valid swipe
    if (swipeTime > this.maxSwipeTime) return null;
    if (Math.max(absDeltaX, absDeltaY) < this.minSwipeDistance) return null;

    // Determine swipe direction
    let direction = null;
    if (absDeltaX > absDeltaY) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    // Execute callback
    if (callbacks[direction]) {
      callbacks[direction]({ deltaX, deltaY, direction, swipeTime });
    }

    return { direction, deltaX, deltaY, swipeTime };
  }

  // Handle tap gestures (single, double, long press)
  handleTap(touchEvent, callbacks = {}) {
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
    const now = Date.now();

    if (touchEvent.type === 'touchstart') {
      this.touchStart = {
        x: touch.clientX,
        y: touch.clientY,
        time: now
      };

      // Long press detection
      this.longPressTimer = setTimeout(() => {
        if (callbacks.longPress) {
          callbacks.longPress(touchEvent);
        }
      }, this.longPressDelay);

    } else if (touchEvent.type === 'touchend') {
      clearTimeout(this.longPressTimer);

      if (!this.touchStart) return;

      const deltaX = Math.abs(touch.clientX - this.touchStart.x);
      const deltaY = Math.abs(touch.clientY - this.touchStart.y);
      const tapTime = now - this.touchStart.time;

      // Check if it's a tap (not a drag)
      if (deltaX < 10 && deltaY < 10 && tapTime < this.maxSwipeTime) {
        if (this.tapTimeout) {
          // Double tap
          clearTimeout(this.tapTimeout);
          this.tapTimeout = null;
          if (callbacks.doubleTap) {
            callbacks.doubleTap(touchEvent);
          }
        } else {
          // Potential single tap - wait for double tap
          this.tapTimeout = setTimeout(() => {
            this.tapTimeout = null;
            if (callbacks.singleTap) {
              callbacks.singleTap(touchEvent);
            }
          }, this.doubleTapDelay);
        }
      }

      this.touchStart = null;
    }
  }

  // Handle pinch/zoom gestures
  handlePinch(touchEvent, callback) {
    if (touchEvent.touches.length !== 2) return;

    const touch1 = touchEvent.touches[0];
    const touch2 = touchEvent.touches[1];

    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );

    if (touchEvent.type === 'touchstart') {
      this.initialPinchDistance = distance;
    } else if (touchEvent.type === 'touchmove' && this.initialPinchDistance) {
      const scale = distance / this.initialPinchDistance;
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      if (callback) {
        callback({ scale, centerX, centerY, distance });
      }
    }
  }

  // Prevent default behaviors for better mobile experience
  preventDefaultBehaviors(element) {
    element.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    element.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  // Enable smooth scrolling
  enableSmoothScrolling(element) {
    element.style.webkitOverflowScrolling = 'touch';
    element.style.scrollBehavior = 'smooth';
  }

  // Optimize touch response
  optimizeTouchResponse(element) {
    element.style.touchAction = 'manipulation';
    element.style.webkitTapHighlightColor = 'transparent';
    element.style.userSelect = 'none';
  }
}

// Touch event utilities
export const touchUtils = {
  // Get touch coordinates
  getTouchCoordinates(touchEvent) {
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0];
    return {
      x: touch.clientX,
      y: touch.clientY,
      pageX: touch.pageX,
      pageY: touch.pageY
    };
  },

  // Calculate distance between two points
  getDistance(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) +
      Math.pow(point2.y - point1.y, 2)
    );
  },

  // Calculate angle between two points
  getAngle(point1, point2) {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
  },

  // Throttle touch events for performance
  throttleTouch(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Debounce touch events
  debounceTouch(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
};

// React hook for mobile gestures
export const useMobileGestures = () => {
  const gestureHandler = new MobileGestureHandler();

  const createTouchHandlers = (callbacks) => {
    let touchStart = null;

    return {
      onTouchStart: (e) => {
        touchStart = e;
        gestureHandler.handleTap(e, callbacks);
      },

      onTouchEnd: (e) => {
        gestureHandler.handleTap(e, callbacks);
        if (touchStart) {
          gestureHandler.handleSwipe(touchStart, e, callbacks);
        }
        touchStart = null;
      },

      onTouchMove: (e) => {
        gestureHandler.handlePinch(e, callbacks.pinch);
      }
    };
  };

  return {
    gestureHandler,
    createTouchHandlers,
    touchUtils
  };
};