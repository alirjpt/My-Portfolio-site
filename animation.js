/**
 * Portfolio Animations
 * Using GSAP and ScrollTrigger for smooth animations
 */

// Initialize animations when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not found. Animations will not work.');
    return;
  }

  // Register GSAP plugins
  registerPlugins();
  
  // Initialize all animations
  initHeaderAnimation();
  initHeroAnimation();
  initSectionAnimations();
  initProjectAnimations();
  initSkillAnimations();
  initCursorEffect();
  
  // Refresh ScrollTrigger on window resize
  window.addEventListener('resize', () => {
    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  });
});

/**
 * Register required GSAP plugins
 */
function registerPlugins() {
  if (gsap && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
    
    // Set defaults for smoother animations
    gsap.defaults({
      ease: 'power2.out',
      duration: 0.8
    });
  }
}

/**
 * Header animations (scroll effect)
 */
function initHeaderAnimation() {
  const header = document.querySelector('header');
  if (!header) return;

  // Add scroll class to header when scrolling down
  ScrollTrigger.create({
    start: 'top -80',
    onEnter: () => header.classList.add('header-scrolled'),
    onLeaveBack: () => header.classList.remove('header-scrolled')
  });
}

/**
 * Hero section animations
 */
function initHeroAnimation() {
  const heroElements = {
    greeting: document.querySelector('.hero-greeting'),
    name: document.querySelector('.hero-name'),
    role: document.querySelector('.hero-role'),
    description: document.querySelector('.hero-description'),
    cta: document.querySelector('.hero-cta')
  };

  // Exit if hero section doesn't exist
  if (!heroElements.name) return;

  // Create staggered animation timeline
  const heroTimeline = gsap.timeline({ defaults: { opacity: 0, y: 30 } });
  
  heroTimeline
    .from(heroElements.greeting, { delay: 0.2 })
    .from(heroElements.name, { y: 50 }, '-=0.3')
    .from(heroElements.role, {}, '-=0.3')
    .from(heroElements.description, { y: 20 }, '-=0.2')
    .from(heroElements.cta, { y: 20 }, '-=0.1');
}

/**
 * Section reveal animations
 */
function initSectionAnimations() {
  // Animate section titles and content
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      opacity: 0,
      y: 30,
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
      }
    });
  });

  // Animate section subtitles
  gsap.utils.toArray('.section-subtitle').forEach(subtitle => {
    gsap.from(subtitle, {
      opacity: 0,
      y: 20,
      scrollTrigger: {
        trigger: subtitle,
        start: 'top 85%',
      }
    });
  });
}

/**
 * Project card animations
 */
function initProjectAnimations() {
  const projects = document.querySelectorAll('.project-card');
  if (projects.length === 0) return;

  // Stagger animation for project cards
  gsap.from(projects, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    scrollTrigger: {
      trigger: projects[0].parentNode,
      start: 'top 75%',
    }
  });
}

/**
 * Skill item animations
 */
function initSkillAnimations() {
  const skillCategories = document.querySelectorAll('.skill-category');
  if (skillCategories.length === 0) return;

  skillCategories.forEach(category => {
    const title = category.querySelector('.skill-category-title');
    const skills = category.querySelectorAll('.skill-item');
    
    if (title && skills.length > 0) {
      // Create timeline for each category
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: category,
          start: 'top 80%',
        }
      });
      
      tl.from(title, { opacity: 0, x: -30 })
        .from(skills, { 
          opacity: 0, 
          y: 30, 
          stagger: 0.05,
          duration: 0.6 
        }, '-=0.4');
    }
  });
}

/**
 * Enhanced cursor effect with GSAP
 */
function initCursorEffect() {
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  if (!cursor || !cursorFollower) return;

  // Set initial positions off-screen
  gsap.set([cursor, cursorFollower], {
    xPercent: -50,
    yPercent: -50,
    x: -100,
    y: -100
  });
  
  // Variables for smooth movement
  let mouseX = -100;
  let mouseY = -100;
  let posX = -100;
  let posY = -100;
  let speed = 0.15; // Increased speed for more responsive cursor
  
  // Update cursor position on mousemove
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Animation loop for smooth following
  gsap.ticker.add(() => {
    // Calculate smooth movement with easing
    posX += (mouseX - posX) * speed;
    posY += (mouseY - posY) * speed;
    
    // Apply position to cursor elements
    gsap.set(cursor, { x: mouseX, y: mouseY });
    gsap.set(cursorFollower, { x: posX, y: posY });
  });
  
  // Handle hover effects for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, .project-card, .highlight-card, .theme-toggle, .hamburger');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to([cursor, cursorFollower], {
        scale: 1.5,
        duration: 0.3,
        ease: 'power2.out'
      });
      cursor.classList.add('cursor-active');
      cursorFollower.classList.add('cursor-active');
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to([cursor, cursorFollower], {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
      cursor.classList.remove('cursor-active');
      cursorFollower.classList.remove('cursor-active');
    });
  });
}

/**
 * Text reveal animation for headings (for use in components)
 * @param {Element} element - The heading element to animate
 * @param {Object} options - Animation options
 */
function animateTextReveal(element, options = {}) {
  if (!element) return;
  
  const defaults = {
    duration: 1,
    delay: 0,
    stagger: 0.02,
    ease: 'power2.out'
  };
  
  const settings = {...defaults, ...options};
  
  // Split text into words and wrap in spans
  const text = element.innerHTML;
  const words = text.split(' ');
  
  let wrappedText = '';
  words.forEach((word) => {
    wrappedText += `<span class="reveal-word"><span class="reveal-word-inner">${word}</span></span> `;
  });
  
  element.innerHTML = wrappedText;
  
  // Animate words
  const revealWords = element.querySelectorAll('.reveal-word-inner');
  
  gsap.from(revealWords, {
    y: '100%',
    opacity: 0,
    duration: settings.duration,
    delay: settings.delay,
    stagger: settings.stagger,
    ease: settings.ease
  });
}

// Make functions available globally
window.portfolioAnimations = {
  refreshScrollTrigger: () => ScrollTrigger && ScrollTrigger.refresh(),
  animateTextReveal
}; 