document.addEventListener('DOMContentLoaded', () => {
  // Initialize cursor
  initCustomCursor();
  
  // Initialize animations
  initAnimations();
  
  // Initialize fullscreen navigation
  initFullscreenNav();
});

// Custom cursor implementation
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  if (!cursor || !cursorFollower) return;
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let followerX = 0;
  let followerY = 0;
  
  // Main cursor position with no delay
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position cursor immediately at mouse position
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });
  
  // Enhanced animation to cursor follower with improved smoothness
  function animateFollower() {
    // Calculate the distance between current position and target
    // Increased speed factor for more responsive movement
    const speed = 0.15; // Increased speed for more responsive cursor
    followerX += (mouseX - followerX) * speed;
    followerY += (mouseY - followerY) * speed;
    
    // Apply position with smooth delay and improved easing
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
  }
  
  animateFollower();
  
  // Add interactive hover effects for links and buttons
  const interactiveElements = document.querySelectorAll('a, button, .btn, .three-dot-menu');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    });
  });
  
  // Add enhanced click animation with smooth follower movement to center
  document.addEventListener('mousedown', (e) => {
    cursor.classList.add('clicking');
    cursorFollower.classList.add('clicking');
    
    // Calculate the exact center position
    const centerX = e.clientX;
    const centerY = e.clientY;
    
    // Use GSAP for smooth animation if available, otherwise use CSS transitions
    if (typeof gsap !== 'undefined') {
      // Animate follower to exact center position using left/top for consistency
      gsap.to(cursorFollower, {
        left: centerX,
        top: centerY,
        duration: 0.12,
        ease: "power2.out",
        onComplete: () => {
          // Brief pause at center, then return to normal following
          gsap.delayedCall(0.08, () => {
            cursorFollower.classList.remove('clicking');
            // Reset position for normal following
            followerX = centerX;
            followerY = centerY;
            // Clear any GSAP transforms to ensure normal following works
            gsap.set(cursorFollower, { clearProps: "all" });
          });
        }
      });
    } else {
      // Fallback to CSS transition
      cursorFollower.style.transition = 'all 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      cursorFollower.style.left = centerX + 'px';
      cursorFollower.style.top = centerY + 'px';
      
      setTimeout(() => {
        cursorFollower.style.transition = 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, transform 0.3s ease';
        cursorFollower.classList.remove('clicking');
        // Reset position for normal following
        followerX = centerX;
        followerY = centerY;
      }, 120);
    }
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
    // Ensure follower returns to normal following behavior
    if (cursorFollower.classList.contains('clicking')) {
      cursorFollower.classList.remove('clicking');
      // Reset position to current mouse position for smooth transition
      followerX = mouseX;
      followerY = mouseY;
    }
  });
  
  // Make cursor visible only when it's on the page
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });
  
  // Handle text selection - make cursor more visible when over text
  document.addEventListener('selectstart', () => {
    cursor.classList.add('selecting');
    cursorFollower.classList.add('selecting');
  });
  
  document.addEventListener('selectionchange', () => {
    if (document.getSelection().toString().length === 0) {
      cursor.classList.remove('selecting');
      cursorFollower.classList.remove('selecting');
    }
  });
}

// Initialize animations
function initAnimations() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Animate elements on scroll
  const animateElements = document.querySelectorAll('.animate-fadeIn');
  
  if (animateElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1
    });
    
    animateElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      observer.observe(element);
    });
  }
}

// Fullscreen navigation implementation
function initFullscreenNav() {
  const navToggle = document.querySelector('.fullscreen-nav-toggle');
  const fullscreenNav = document.querySelector('.fullscreen-nav');
  const navLinks = document.querySelectorAll('.fullscreen-nav .nav-item-link');
  
  if (!navToggle || !fullscreenNav) return;
  
  // Toggle menu on click
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    fullscreenNav.classList.toggle('active');
    document.body.classList.toggle('nav-open');
    
    // Store original overflow settings when opening nav
    if (fullscreenNav.classList.contains('active')) {
      document.body.dataset.originalOverflow = document.body.style.overflow;
      document.documentElement.dataset.originalOverflow = document.documentElement.style.overflow;
      
      // Always prevent scrolling when menu is open
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore original overflow settings when closing menu
      // For home page: keep hidden, for other pages: restore auto
      if (document.body.classList.contains('home-page')) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = document.body.dataset.originalOverflow || '';
        document.documentElement.style.overflow = document.documentElement.dataset.originalOverflow || '';
      }
    }
  });
  
  // Close menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      fullscreenNav.classList.remove('active');
      document.body.classList.remove('nav-open');
      
      // Restore original overflow settings based on page type
      if (document.body.classList.contains('home-page')) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = document.body.dataset.originalOverflow || '';
        document.documentElement.style.overflow = document.documentElement.dataset.originalOverflow || '';
      }
    });
  });
  
  // Add current page indicator
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath.split('/').pop() || 
        (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Create floating background effect
  const navBackground = document.querySelector('.nav-background');
  if (navBackground) {
    document.addEventListener('mousemove', (e) => {
      if (!fullscreenNav.classList.contains('active')) return;
      
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      const blobs = document.querySelectorAll('.nav-blob');
      if (blobs.length > 0) {
        blobs[0].style.transform = `translate(${(mouseX - 0.5) * 40}px, ${(mouseY - 0.5) * 40}px) scale(${1 + mouseY * 0.2})`;
        if (blobs.length > 1) {
          blobs[1].style.transform = `translate(${(mouseX - 0.5) * -30}px, ${(mouseY - 0.5) * -30}px) scale(${1 + (1-mouseY) * 0.1})`;
        }
      }
    });
  }
} 