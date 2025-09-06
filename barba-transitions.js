// Barba.js and GSAP transitions for smooth page navigation
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Barba
  initBarba();
  // Initialize Enhanced Page Transition Loader
  initEnhancedPageTransitionLoader();
});

function initBarba() {
  // Don't initialize if Barba isn't loaded
  if (typeof barba === 'undefined' || typeof gsap === 'undefined') {
    console.error('Barba.js or GSAP not loaded');
    return;
  }

  // Create page transition overlay if it doesn't exist
  if (!document.querySelector('.page-transition-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgb(40, 42, 54)';
    overlay.style.zIndex = '9990';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
  }

  // Hooks that run before any page transition
  barba.hooks.before((data) => {
    // Add a class to the html element to prevent FOUC
    document.documentElement.classList.add('transition-active');
    
    // Only show loader if navigating to home or on initial load
    const toHome = (data && data.next && (
      data.next.url && (
        data.next.url.path === '/' ||
        data.next.url.path === '/index.html' ||
        data.next.url.path.endsWith('/index.html')
      )
    ));
    const isInitialLoad = !data || !data.trigger;
    if (toHome || isInitialLoad) {
      const pageTransitionLoader = document.querySelector('.page-transition-loader');
      if (pageTransitionLoader) {
        // Subtle fade-in animation for loader
        pageTransitionLoader.style.transition = 'opacity 0.18s cubic-bezier(0.4,0,0.2,1)';
        pageTransitionLoader.style.opacity = '0';
        pageTransitionLoader.style.visibility = 'visible';
        setTimeout(() => {
          pageTransitionLoader.style.opacity = '1';
        }, 10);
        // Update the sublabel with a random message
        const sublabel = pageTransitionLoader.querySelector('.page-loader-sublabel');
        if (sublabel) {
          const messages = [
            'Loading assets...',
            'Preparing content...',
            'Building interface...',
            'Organizing cloud resources...',
            'Initializing components...'
          ];
          sublabel.textContent = messages[Math.floor(Math.random() * messages.length)];
        }
      }
    }
  });

  // Hooks that run after any page transition
  barba.hooks.after((data) => {
    document.documentElement.classList.remove('transition-active');
    // Only hide loader if it was shown
    const toHome = (data && data.next && (
      data.next.url && (
        data.next.url.path === '/' ||
        data.next.url.path === '/index.html' ||
        data.next.url.path.endsWith('/index.html')
      )
    ));
    const isInitialLoad = !data || !data.trigger;
    if (toHome || isInitialLoad) {
      const pageTransitionLoader = document.querySelector('.page-transition-loader');
      if (pageTransitionLoader) {
        // Fade out quickly, then hide
        pageTransitionLoader.style.transition = 'opacity 0.18s cubic-bezier(0.4,0,0.2,1)';
        pageTransitionLoader.style.opacity = '0';
        setTimeout(() => {
          pageTransitionLoader.style.visibility = 'hidden';
        }, 180);
      }
    }
    
    // Set appropriate overflow based on page
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname === '/index.html' || 
                      window.location.pathname.endsWith('/index.html');
    
    const isAboutPage = window.location.pathname.includes('/about.html') || 
                       window.location.pathname.endsWith('/about.html');
    
    document.body.classList.toggle('home-page', isHomePage);
    document.body.classList.toggle('about-page', isAboutPage);
    document.documentElement.classList.toggle('about-page', isAboutPage);
    
    // Update overflow settings - don't override about page
    if (isHomePage) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else if (isAboutPage) {
      // Don't set inline styles for about page - let CSS handle it
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = 'auto';
    }
  });

  // Define transitions
  barba.init({
    debug: false, // Set to true for debugging
    // Add CSS for preventing FOUC
    stylesheet: `
      html.transition-active { opacity: 0; }
      .page-transition-overlay { 
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(40, 42, 54);
        z-index: 9990;
      }
    `,
    transitions: [
      // Default fade transition
      {
        name: 'fade-transition',
        
        // Apply this transition only when no other transition matches
        // This ensures our advanced transitions take precedence when we want them to
        once(data) {
          // Initial page load animation
          // Ensure the page is visible before animating
          gsap.set(data.next.container, { opacity: 0 });
          return gsap.to(data.next.container, {
            opacity: 1,
            duration: 0.5,
            delay: 0.2,
            clearProps: 'opacity'
          });
        },
        
        // Transition between any pages
        leave(data) {
          // Animation to run when leaving a page
          const done = this.async();
          
          // Save the scroll position
          window.scrollPosition = window.pageYOffset;
          
          // Hide next page content until it's ready
          if (data.next.container) {
            gsap.set(data.next.container, { opacity: 0 });
          }
          
          // Animate out
          gsap.to(data.current.container, {
            opacity: 0,
            duration: 0.3,
            onComplete: done
          });
        },
        
        enter(data) {
          // Animation to run when entering a page
          const done = this.async();
          
          // Initial state - invisible
          gsap.set(data.next.container, { opacity: 0 });
          
          // Animate in
          gsap.to(data.next.container, {
            opacity: 1,
            duration: 0.5,
            delay: 0.1,
            onComplete: done,
            clearProps: 'opacity'
          });
        },
        
        // This runs after the new content has been added to the page
        // but before the enter animation starts
        beforeEnter(data) {
          // Scroll to the top of the page
          window.scrollTo(0, 0);
          
          // Check if the destination is home page
          const isHomePage = data.next.url.path === '/' || 
                             data.next.url.path === '/index.html' || 
                             data.next.url.path.endsWith('/index.html');
                             
          // Add or remove home-page class
          data.next.container.closest('body').classList.toggle('home-page', isHomePage);
        },
        
        // After transition is complete
        after(data) {
          // Reinitialize scripts that should run on the new page
          reinitializeScripts();
        }
      },
      
      // Advanced overlay transition
      {
        name: 'overlay-transition',
        
        // Custom rules to determine when to use this transition
        // This will match when navigating to/from specific pages
        // You can customize this logic based on your preference
        to: {
          namespace: ['home', 'projects', 'about', 'contact']
        },
        
        leave(data) {
          // Animation to run when leaving a page
          const done = this.async();
          const overlay = document.querySelector('.page-transition-overlay');
          
          // Save the scroll position
          window.scrollPosition = window.pageYOffset;
          
          // Hide next page content until it's ready
          if (data.next.container) {
            gsap.set(data.next.container, { opacity: 0 });
          }
          
          // Create timeline for coordinated animations
          const tl = gsap.timeline({
            onComplete: done
          });
          
          // Animate overlay in from top
          tl.set(overlay, {
            transformOrigin: 'top', 
            scaleY: 0,
            display: 'block'
          })
          .to(overlay, {
            duration: 0.3,
            scaleY: 1,
            ease: 'power3.inOut'
          })
          .to(data.current.container, {
            opacity: 0,
            duration: 0.2
          }, '-=0.2');
        },
        
        enter(data) {
          // Animation to run when entering a page
          const done = this.async();
          const overlay = document.querySelector('.page-transition-overlay');
          
          // Set initial state
          gsap.set(data.next.container, { opacity: 0 });
          
          // Create timeline for coordinated animations
          const tl = gsap.timeline({
            onComplete: done
          });
          
          // Animate overlay out to bottom
          tl.to(data.next.container, {
            opacity: 1,
            duration: 0.3,
            clearProps: 'opacity'
          })
          .to(overlay, {
            duration: 0.3,
            scaleY: 0,
            transformOrigin: 'bottom',
            ease: 'power3.inOut'
          })
          .set(overlay, {
            display: 'none'
          });
        },
        
        beforeEnter(data) {
          // Scroll to the top of the page
          window.scrollTo(0, 0);
        },
        
        after(data) {
          // Reinitialize scripts that should run on the new page
          reinitializeScripts();
        }
      }
    ],
    
    // Prevent default behavior for views with specific data attributes
    prevent: ({ el }) => el.classList && el.classList.contains('prevent-barba')
  });
}

// Reinitialize all scripts that need to run on page change
function reinitializeScripts() {
  // Reinitialize all the custom scripts from the main JS file
  if (typeof initCustomCursor === 'function') initCustomCursor();
  if (typeof initAnimations === 'function') initAnimations();
  if (typeof initMenu === 'function') initMenu();
  if (typeof initScrollEvents === 'function') initScrollEvents();
  if (typeof highlightActiveLink === 'function') highlightActiveLink();
  if (typeof initFormValidation === 'function') initFormValidation();
  
  // If theme toggle exists, initialize it
  if (typeof initDarkMode === 'function') initDarkMode();
}

// Enhanced Page Transition Loader Animation
function initEnhancedPageTransitionLoader() {
  // Create page transition loader if it doesn't exist
  if (!document.querySelector('.page-transition-loader')) {
    const transLoader = document.createElement('div');
    transLoader.className = 'page-transition-loader';
    transLoader.style.position = 'fixed';
    transLoader.style.top = '50%';
    transLoader.style.left = '50%';
    transLoader.style.transform = 'translate(-50%, -50%)';
    transLoader.style.zIndex = '9997';
    transLoader.style.opacity = '0';
    transLoader.style.visibility = 'hidden';
    transLoader.style.transition = 'opacity 0.3s ease';
    transLoader.style.pointerEvents = 'none';
    transLoader.style.backgroundColor = 'rgba(40, 42, 54, 0.15)';
    transLoader.style.backdropFilter = 'blur(8px)';
    transLoader.style.webkitBackdropFilter = 'blur(8px)';
    transLoader.style.padding = '30px 40px';
    transLoader.style.borderRadius = '16px';
    transLoader.style.border = '1px solid rgba(149, 128, 255, 0.2)';
    transLoader.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(149, 128, 255, 0.2)';
    
    // Create cloud container with particles
    const cloudContainer = document.createElement('div');
    cloudContainer.className = 'transition-cloud-container';
    cloudContainer.style.width = '60px';
    cloudContainer.style.height = '60px';
    cloudContainer.style.margin = '0 auto 15px auto';
    cloudContainer.style.position = 'relative';
    
    const cloud = document.createElement('div');
    cloud.className = 'transition-cloud';
    cloud.style.width = '100%';
    cloud.style.height = '100%';
    cloud.style.backgroundImage = 'url(\'assets/images/logo.png\')';
    cloud.style.backgroundSize = 'contain';
    cloud.style.backgroundRepeat = 'no-repeat';
    cloud.style.backgroundPosition = 'center';
    cloud.style.filter = 'drop-shadow(0 0 8px rgba(149, 128, 255, 0.6))';
    cloud.style.animation = 'cloudFloat 2s infinite ease-in-out';
    
    const particles = document.createElement('div');
    particles.className = 'transition-particles';
    particles.style.position = 'absolute';
    particles.style.width = '100%';
    particles.style.height = '100%';
    particles.style.top = '0';
    particles.style.left = '0';
    
    // Create 6 particles with different positions
    const particlePositions = [
      {top: '25%', left: '-10%', delay: '0.2s'},
      {top: '10%', left: '20%', delay: '0.5s'},
      {top: '65%', left: '10%', delay: '0.1s'},
      {top: '80%', left: '30%', delay: '0.7s'},
      {top: '20%', left: '80%', delay: '0.3s'},
      {top: '70%', left: '85%', delay: '0.6s'}
    ];
    
    particlePositions.forEach((pos) => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.position = 'absolute';
      particle.style.width = '6px';
      particle.style.height = '6px';
      particle.style.borderRadius = '50%';
      particle.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))';
      particle.style.opacity = '0';
      particle.style.animation = 'particleFloat 2s infinite ease-out';
      particle.style.animationDelay = pos.delay;
      particle.style.top = pos.top;
      particle.style.left = pos.left;
      particles.appendChild(particle);
    });
    
    // Progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-bar-container';
    progressContainer.style.width = '180px';
    progressContainer.style.height = '4px';
    progressContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    progressContainer.style.borderRadius = '2px';
    progressContainer.style.margin = '20px auto 15px auto';
    progressContainer.style.overflow = 'hidden';
    progressContainer.style.position = 'relative';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.height = '100%';
    progressBar.style.width = '0';
    progressBar.style.background = 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))';
    progressBar.style.borderRadius = '2px';
    progressBar.style.position = 'relative';
    progressBar.style.animation = 'loadProgress 2s infinite';
    
    // Create pseudo-element effect with JavaScript
    const progressGlow = document.createElement('div');
    progressGlow.style.position = 'absolute';
    progressGlow.style.top = '0';
    progressGlow.style.left = '0';
    progressGlow.style.width = '100%';
    progressGlow.style.height = '100%';
    progressGlow.style.background = 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)';
    progressGlow.style.animation = 'progressGlow 2s infinite';
    
    // Labels
    const label = document.createElement('div');
    label.className = 'page-loader-label';
    label.textContent = 'Navigating to page...';
    label.style.marginTop = '10px';
    label.style.fontSize = '14px';
    label.style.color = 'var(--text-color)';
    label.style.fontFamily = '\'Space Grotesk\', sans-serif';
    label.style.textAlign = 'center';
    label.style.animation = 'fadeIn 0.5s ease';
    label.style.fontWeight = '500';
    label.style.letterSpacing = '1px';
    
    const sublabel = document.createElement('div');
    sublabel.className = 'page-loader-sublabel';
    sublabel.textContent = 'Preparing content';
    sublabel.style.fontSize = '12px';
    sublabel.style.color = 'rgba(var(--color-text-rgb), 0.6)';
    sublabel.style.textAlign = 'center';
    sublabel.style.marginTop = '8px';
    
    // Add keyframes for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cloudFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-5px) scale(1.05); }
      }
      
      @keyframes particleFloat {
        0% { transform: translate(0, 0) scale(0); opacity: 0; }
        20% { transform: translate(-5px, -5px) scale(1); opacity: 0.8; }
        80% { transform: translate(-15px, -15px) scale(0.5); opacity: 0.4; }
        100% { transform: translate(-20px, -20px) scale(0); opacity: 0; }
      }
      
      @keyframes loadProgress {
        0% { width: 0%; }
        50% { width: 70%; }
        80% { width: 85%; }
        100% { width: 98%; }
      }
      
      @keyframes progressGlow {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    
    // Assemble the elements
    cloudContainer.appendChild(cloud);
    cloudContainer.appendChild(particles);
    progressContainer.appendChild(progressBar);
    progressBar.appendChild(progressGlow);
    
    transLoader.appendChild(cloudContainer);
    transLoader.appendChild(progressContainer);
    transLoader.appendChild(label);
    transLoader.appendChild(sublabel);
    
    document.body.appendChild(transLoader);
  }
} 