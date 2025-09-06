document.addEventListener('DOMContentLoaded', () => {
    // Menu Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const hamburger = document.querySelector('.hamburger');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    let followerX = 0;
    let followerY = 0;
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Position cursor immediately at mouse position
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Smooth follower animation
    function animateFollower() {
        const speed = 0.15; // Increased speed for more responsive cursor
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .menu-toggle, input, textarea');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-active');
            cursorFollower.classList.add('cursor-active');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-active');
            cursorFollower.classList.remove('cursor-active');
        });
    });
    
    // Enhanced click animation - follower moves to center and merges
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
    
    // Dark Mode Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeToggle) return;
    
    // Check saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark-mode');
        themeToggle.classList.add('active');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        themeToggle.classList.toggle('active');
        
        // Save preference
        const isDark = document.documentElement.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Trigger animation refresh if needed
        if (window.updateAnimations) {
            window.updateAnimations();
        }
    });
    
    // Menu State
    let isMenuOpen = false;
    
    // Toggle Menu Function
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active');
        fullscreenMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
        
        // Animate menu links if menu is open
        if (fullscreenMenu.classList.contains('open')) {
            animateMenuLinks();
        }
    }
    
    // Event Listeners
    if (menuToggle && fullscreenMenu) {
        menuToggle.addEventListener('click', toggleMenu);
        
        // Close menu when clicking overlay
        const menuOverlay = document.querySelector('.menu-overlay');
        if (menuOverlay) {
            menuOverlay.addEventListener('click', toggleMenu);
        }
    }
    
    // Active Menu Link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Animate menu links
    function animateMenuLinks() {
        gsap.from('.menu-link', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power3.out',
            delay: 0.2
        });
    }
});

// GSAP ScrollTrigger initialization
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize scroll animations
        window.updateAnimations = () => {
            // Refresh ScrollTrigger to account for any layout changes
            ScrollTrigger.refresh();
        };
    }
});

// Form submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const formStatus = document.getElementById('form-status');
        
        if (!submitBtn || !formStatus) return;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Simulate API call - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success
            formStatus.textContent = 'Message sent successfully!';
            formStatus.classList.add('success');
            formStatus.classList.remove('hidden');
            formStatus.classList.remove('error');
            
            // Reset form
            contactForm.reset();
            
            // Reset button after short delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
                
                // Hide status after 5 seconds
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 5000);
            }, 1000);
            
        } catch (error) {
            // Error
            formStatus.textContent = 'Something went wrong. Please try again.';
            formStatus.classList.add('error');
            formStatus.classList.remove('hidden');
            formStatus.classList.remove('success');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Try Again';
        }
    });
}); 