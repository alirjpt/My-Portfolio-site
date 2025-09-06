// Get canvas and context
const canvas = document.getElementById('animated-bg');
const ctx = canvas.getContext('2d');

// Performance settings
let particleCount = 100;
let animationEnabled = true;
const isMobile = window.innerWidth < 768;

// Reduce particles on mobile
if (isMobile) {
    particleCount = 30; // Fewer particles on mobile
}

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize canvas
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        if (this.x < -50 || this.x > canvas.width + 50 || 
            this.y < -50 || this.y > canvas.height + 50) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// Create particles
const particles = [];

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Animation loop
function animate() {
    if (!animationEnabled) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

// Monitor performance
let lastFrameTime = performance.now();
let framesCount = 0;
let frameRate = 60;

function checkPerformance() {
    framesCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - lastFrameTime;
    
    if (elapsed >= 1000) {
        frameRate = framesCount;
        framesCount = 0;
        lastFrameTime = currentTime;
        
        // If framerate drops below 30, reduce particles
        if (frameRate < 30 && particleCount > 20) {
            particleCount = Math.max(20, particleCount - 10);
            
            // Remove excess particles
            particles.splice(particleCount);
        }
    }
    
    requestAnimationFrame(checkPerformance);
}

// Start animation and performance monitoring
animate();
checkPerformance();

// Add event listener to disable animation when page is not visible
document.addEventListener('visibilitychange', () => {
    animationEnabled = !document.hidden;
    if (animationEnabled) {
        animate();
    }
}); 