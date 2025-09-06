// Page Content Animation System
document.addEventListener('DOMContentLoaded', function() {
  // Immediately hide page content until ready to animate
  const pageContent = document.querySelector('main');
  if (pageContent) {
    pageContent.style.opacity = '0';
  }
  
  // Get current page type based on URL path
  const currentPath = window.location.pathname;
  const isHomePage = currentPath === '/' || currentPath.includes('index.html');
  const isAboutPage = currentPath.includes('about.html');
  const isProjectsPage = currentPath.includes('projects.html');
  const isContactPage = currentPath.includes('contact.html');
  
  // Common elements to animate on all pages
  const navLogo = document.querySelector('.nav-logo');
  const navToggle = document.querySelector('.fullscreen-nav-toggle');
  
  // Get page-specific elements (home page only)
  // Home page elements
  const heroHeadline = document.querySelector('.hero-headline');
  const heroSubheadline = document.querySelector('.hero-subheadline');
  const heroDescription = document.querySelector('.hero-description');
  const heroCta = document.querySelector('.hero-cta');
  
  // About page elements
  const aboutHeading = isAboutPage ? document.querySelector('.about-heading') : null;
  const aboutTexts = isAboutPage ? document.querySelectorAll('.about-text') : null;
  const aboutImage = isAboutPage ? document.querySelector('.about-image') : null;
  const cvLink = isAboutPage ? document.querySelector('.cv-link') : null;
  
  // Projects page elements
  const projectHeading = isProjectsPage ? document.querySelector('.project-heading') : null;
  const projectCount = isProjectsPage ? document.querySelector('.project-count') : null;
  const projectDivider = isProjectsPage ? document.querySelector('.project-divider') : null;
  const projectImage = isProjectsPage ? document.querySelector('.project-image') : null;
  const projectList = isProjectsPage ? document.querySelector('.project-list') : null;
  
  // Contact page elements
  const contactHeading = isContactPage ? document.querySelector('.contact-heading') : null;
  const contactIntro = isContactPage ? document.querySelector('.contact-intro') : null;
  const contactItems = isContactPage ? document.querySelectorAll('.contact-item') : null;
  const contactForm = isContactPage ? document.querySelector('.contact-form') : null;
  
  // Listen for when loader is hidden
  const logoLoader = document.querySelector('.logo-loader');
  
  // For secondary pages, we still need the loader
  if (!isHomePage && logoLoader) {
    // Make sure page content is visible when loader is removed
    logoLoader.addEventListener('transitionend', function() {
      if (this.classList.contains('hidden')) {
        if (pageContent) {
          pageContent.style.opacity = '1';
          pageContent.style.transition = 'opacity 0.3s ease';
        }
      }
    });
    
    // Show navigation elements
    if (navLogo) navLogo.classList.add('visible');
    if (navToggle) navToggle.classList.add('visible');
    
    // Trigger page-specific content animations
    window.addEventListener('loaderComplete', function() {
      if (pageContent) {
        pageContent.style.opacity = '1';
        pageContent.style.transition = 'opacity 0.3s ease';
      }
      
      // Slight delay to ensure DOM is ready and content is visible
      setTimeout(() => {
        animatePageContent();
      }, 100);
    });
  }
  
  // Function to animate elements (home page only)
  function animateElements() {
    // Make sure page content is visible
    if (pageContent) {
      pageContent.style.opacity = '1';
      pageContent.style.transition = 'opacity 0.3s ease';
    }
    
    // Wait a bit after loader is hidden to start animations
    setTimeout(() => {
      // Animate navigation elements
      if (navLogo) navLogo.classList.add('visible');
      if (navToggle) navToggle.classList.add('visible');
      
      // Home page specific animations
      if (heroSubheadline) heroSubheadline.classList.add('visible');
      setTimeout(() => {
        if (heroHeadline) heroHeadline.classList.add('visible');
      }, 200);
      
      setTimeout(() => {
        if (heroDescription) heroDescription.classList.add('visible');
      }, 400);
      
      setTimeout(() => {
        if (heroCta) heroCta.classList.add('visible');
      }, 600);
    }, 100);
  }
  
  // Function to animate page-specific content for secondary pages
  function animatePageContent() {
    if (isAboutPage) {
      // About page animations
      if (aboutHeading) {
        aboutHeading.style.opacity = "0";
        aboutHeading.style.transform = "translateY(-30px)";
        setTimeout(() => {
          aboutHeading.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          aboutHeading.style.opacity = "1";
          aboutHeading.style.transform = "translateY(0)";
        }, 100);
      }
      
      if (aboutTexts) {
        aboutTexts.forEach((text, index) => {
          text.style.opacity = "0";
          text.style.transform = "translateY(30px)";
          setTimeout(() => {
            text.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            text.style.opacity = "1";
            text.style.transform = "translateY(0)";
          }, 300 + (index * 150));
        });
      }
      
      if (aboutImage) {
        aboutImage.style.opacity = "0";
        aboutImage.style.transform = "translateX(30px)";
        setTimeout(() => {
          aboutImage.style.transition = "opacity 1s ease, transform 1s ease";
          aboutImage.style.opacity = "1";
          aboutImage.style.transform = "translateX(0)";
        }, 300);
      }
      
      if (cvLink) {
        cvLink.style.opacity = "0";
        cvLink.style.transform = "translateY(20px)";
        setTimeout(() => {
          cvLink.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          cvLink.style.opacity = "1";
          cvLink.style.transform = "translateY(0)";
        }, 800);
      }
    }
    
    if (isProjectsPage) {
      // Projects page animations
      if (projectHeading) {
        projectHeading.style.opacity = "0";
        projectHeading.style.transform = "translateY(-30px)";
        setTimeout(() => {
          projectHeading.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          projectHeading.style.opacity = "1";
          projectHeading.style.transform = "translateY(0)";
        }, 100);
      }
      
      if (projectCount) {
        projectCount.style.opacity = "0";
        projectCount.style.transform = "translateX(30px)";
        setTimeout(() => {
          projectCount.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          projectCount.style.opacity = "1";
          projectCount.style.transform = "translateX(0)";
        }, 300);
      }
      
      if (projectDivider) {
        projectDivider.style.opacity = "0";
        projectDivider.style.transform = "scaleX(0)";
        setTimeout(() => {
          projectDivider.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          projectDivider.style.opacity = "1";
          projectDivider.style.transform = "scaleX(1)";
        }, 500);
      }
      
      if (projectImage) {
        projectImage.style.opacity = "0";
        projectImage.style.transform = "translateX(-30px)";
        setTimeout(() => {
          projectImage.style.transition = "opacity 1s ease, transform 1s ease";
          projectImage.style.opacity = "1";
          projectImage.style.transform = "translateX(0)";
        }, 300);
      }
      
      if (projectList) {
        projectList.style.opacity = "0";
        projectList.style.transform = "translateY(30px)";
        setTimeout(() => {
          projectList.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          projectList.style.opacity = "1";
          projectList.style.transform = "translateY(0)";
        }, 700);
      }
    }
    
    if (isContactPage) {
      // Contact page animations
      if (contactHeading) {
        contactHeading.style.opacity = "0";
        contactHeading.style.transform = "translateY(-30px)";
        setTimeout(() => {
          contactHeading.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          contactHeading.style.opacity = "1";
          contactHeading.style.transform = "translateY(0)";
        }, 100);
      }
      
      if (contactIntro) {
        contactIntro.style.opacity = "0";
        contactIntro.style.transform = "translateY(20px)";
        setTimeout(() => {
          contactIntro.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          contactIntro.style.opacity = "1";
          contactIntro.style.transform = "translateY(0)";
        }, 300);
      }
      
      if (contactItems) {
        contactItems.forEach((item, index) => {
          item.style.opacity = "0";
          item.style.transform = "translateX(-30px)";
          setTimeout(() => {
            item.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            item.style.opacity = "1";
            item.style.transform = "translateX(0)";
          }, 500 + (index * 150));
        });
      }
      
      if (contactForm) {
        contactForm.style.opacity = "0";
        contactForm.style.transform = "translateY(30px)";
        setTimeout(() => {
          contactForm.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          contactForm.style.opacity = "1";
          contactForm.style.transform = "translateY(0)";
        }, 700);
      }
    }
  }
  
  // Handle animation triggers only for home page
  if (isHomePage) {
    // 1. MutationObserver to watch for class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'class' &&
            logoLoader.classList.contains('hidden')) {
          animateElements();
          observer.disconnect(); // Stop observing once triggered
        }
      });
    });
    
    observer.observe(logoLoader, { attributes: true });
    
    // 2. Direct hook into the loader.js logic
    window.addEventListener('loaderComplete', animateElements);
  }
}); 