document.addEventListener('DOMContentLoaded', () => {
    // Menu Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const hamburger = document.querySelector('.hamburger');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const menuLinks = document.querySelectorAll('.menu-link');
    
    // Menu State
    let isMenuOpen = false;

    // Initialize GSAP if available
    if (typeof gsap !== 'undefined') {
        // Menu Links Animation
        menuLinks.forEach((link, index) => {
            link.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    // Toggle Menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        fullscreenMenu.classList.toggle('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    // Event Listeners
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking overlay
    document.querySelector('.menu-overlay').addEventListener('click', toggleMenu);

    // Handle menu link clicks (no need for scroll behavior with multi-page)
    menuLinks.forEach(link => {
        // Get current page
        const currentPage = window.location.pathname.split('/').pop();
        const linkHref = link.getAttribute('href');
        
        // Highlight active link
        if ((currentPage === '' || currentPage === '/' || currentPage === 'index.html') && linkHref === 'index.html') {
            link.classList.add('active');
        } else if (currentPage === linkHref) {
            link.classList.add('active');
        }
        
        // Simple navigation - no need for fancy scrolling in multi-page
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    });
    
    // Page transition animations if GSAP is available
    if (typeof gsap !== 'undefined') {
        // Add page-specific animations here if needed
        const pageTimeline = gsap.timeline({
            defaults: { ease: 'power3.out' }
        });
        
        // Common elements to animate across all pages
        if (document.querySelector('.section-title')) {
            pageTimeline.from('.section-title', { 
                opacity: 0, 
                y: 30, 
                duration: 0.8 
            });
        }
        
        if (document.querySelector('.shape')) {
            pageTimeline.from('.shape', { 
                opacity: 0, 
                scale: 0.8, 
                duration: 1, 
                stagger: 0.2 
            }, '-=0.6');
        }
    }
}); 