/**
 * Utility Functions
 * Helper functions for the portfolio site
 */

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
function throttle(func, limit) {
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
}

/**
 * Debounce function to delay function execution until after a specified wait period
 * @param {Function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Returns true if the device is likely a mobile/touch device
 * @returns {boolean} - Whether the device is mobile/touch
 */
function isMobileDevice() {
  return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
  );
}

/**
 * Get viewport dimensions
 * @returns {Object} - Object with width and height properties
 */
function getViewportDimensions() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  };
}

/**
 * Checks if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @param {number} offset - Optional offset (percentage as decimal)
 * @returns {boolean} - Whether the element is in viewport
 */
function isInViewport(element, offset = 0) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const threshold = windowHeight * offset;
  
  return (
    rect.top <= windowHeight - threshold &&
    rect.bottom >= threshold
  );
}

/**
 * Smooth scroll to element
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} offset - Optional offset in pixels
 * @param {number} duration - Duration of scroll animation in ms
 */
function scrollToElement(elementId, offset = 0, duration = 1000) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - offset;
  
  // Use native smooth scrolling if supported
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    return;
  }
  
  // Fallback for browsers that don't support smooth scrolling
  const startPosition = window.scrollY;
  const distance = offsetPosition - startPosition;
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeInOutCubic = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo(0, startPosition + distance * easeInOutCubic);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

/**
 * Creates and triggers a custom event
 * @param {string} eventName - Name of the event
 * @param {Object} detail - Event details
 */
function triggerCustomEvent(eventName, detail = {}) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(event);
}

/**
 * Formats a date object to locale string
 * @param {Date|string} date - Date object or date string
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
function formatDate(date, options = {}) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return dateObj.toLocaleDateString(
    navigator.language || 'en-US',
    { ...defaultOptions, ...options }
  );
}

/**
 * Handles lazy loading of images
 * @param {string} selector - CSS selector for images to lazy load
 */
function setupLazyLoading(selector = 'img[data-src]') {
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.removeAttribute('data-src');
          }
          
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    
    const lazyImages = document.querySelectorAll(selector);
    lazyImages.forEach(img => lazyImageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    const lazyImages = document.querySelectorAll(selector);
    
    function lazyLoad() {
      lazyImages.forEach(img => {
        if (isInViewport(img) && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    }
    
    // Initial check
    lazyLoad();
    
    // Attach scroll event with throttle
    window.addEventListener('scroll', throttle(lazyLoad, 200));
    window.addEventListener('resize', throttle(lazyLoad, 200));
  }
}

// Export utility functions
window.utils = {
  throttle,
  debounce,
  isMobileDevice,
  getViewportDimensions,
  isInViewport,
  scrollToElement,
  triggerCustomEvent,
  formatDate,
  setupLazyLoading
}; 