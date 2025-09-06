// Advanced Logo Loader Animation
document.addEventListener('DOMContentLoaded', function() {
  // References to loader elements
  const logoLoader = document.querySelector('.logo-loader');
  const loadingBar = document.querySelector('.loading-bar');
  const loadingProgress = document.querySelector('.loading-progress');
  const loadingFact = document.querySelector('.loading-fact');
  
  // Get current page type 
  const currentPath = window.location.pathname;
  const isHomePage = currentPath === '/' || currentPath.includes('index.html');
  
  // Make sure the loader is visible when DOM is loaded
  // This prevents the brief flash of unstyled content
  if (logoLoader) {
    logoLoader.style.display = 'flex';
    logoLoader.style.opacity = '1';
    logoLoader.style.visibility = 'visible';
  }
  
  // For non-home pages, show a quick loader
  if (!isHomePage) {
    const quickProgress = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (loadingBar) loadingBar.style.width = progress + '%';
        if (loadingProgress) loadingProgress.textContent = 'Loading: ' + progress + '%';
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Only hide loader after a slight delay to ensure page is rendered
          setTimeout(() => {
            if (logoLoader) {
              logoLoader.classList.add('hidden');
              setTimeout(() => {
                logoLoader.style.visibility = 'hidden';
              }, 500); // Wait for transition to complete
            }
            
            // Dispatch event to trigger page animations
            const event = new Event('loaderComplete');
            window.dispatchEvent(event);
          }, 200);
        }
      }, 15); // Make it quick (total time: ~150ms)
    };
    
    // Start quick progress immediately
    quickProgress();
    return; // Exit the function for non-home pages
  }
  
  // For home page, continue with full loading experience
  // Array of cloud/tech facts
  const facts = [
    "Cloud computing market is expected to reach $1,251.09 billion by 2028.",
    "Linux powers 96.3% of the world's top one million servers.",
    "AWS holds 32% of the cloud market share as of 2023.",
    "The term 'cloud computing' was first used by Compaq in 1996.",
    "Infrastructure as Code reduces provisioning time by up to 97%.",
    "Over 90% of enterprises are using multi-cloud strategies.",
    "DevOps implementations can lead to 63% improvement in software quality.",
    "Containerized applications can be deployed 22x more frequently than traditional ones.",
    "The average cost of downtime is $5,600 per minute.",
    "Approximately 94% of enterprises already use a cloud service."
  ];
  
  // Start with random fact
  const startFactIndex = Math.floor(Math.random() * facts.length);
  if (loadingFact) {
    loadingFact.textContent = facts[startFactIndex];
    loadingFact.classList.add('visible');
  }
  
  // Change facts every few seconds
  let factIndex = startFactIndex;
  const rotateFacts = setInterval(function() {
    if (!loadingFact) {
      clearInterval(rotateFacts);
      return;
    }
    
    loadingFact.classList.remove('visible');
    
    setTimeout(function() {
      factIndex = (factIndex + 1) % facts.length;
      loadingFact.textContent = facts[factIndex];
      loadingFact.classList.add('visible');
    }, 300);
  }, 3000);
  
  // Controlled loading progress to take exactly 2.5 seconds
  let progress = 0;
  const totalDuration = 2500; // 2.5 seconds in milliseconds
  const steps = 25; // Number of updates during the loading (10 updates per second)
  const increment = 100 / steps; // Each step adds this percentage
  const intervalTime = totalDuration / steps; // Time between steps
  
  const loadingInterval = setInterval(function() {
    progress += increment;
    
    // Add slight randomness to make it look natural while maintaining timing
    const randomAdjustment = (Math.random() * 0.5) - 0.25; // -0.25 to +0.25
    const displayProgress = Math.min(100, progress + randomAdjustment);
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      clearInterval(rotateFacts);
      
      // Finish animation immediately at 2.5 second mark
      if (logoLoader) {
        logoLoader.classList.add('hidden');
        
        // Make sure it's completely removed from flow after transition
        setTimeout(() => {
          logoLoader.style.visibility = 'hidden';
        }, 500); // Match the CSS transition duration
      }
      
      // Dispatch event to trigger page animations
      const event = new Event('loaderComplete');
      window.dispatchEvent(event);
    }
    
    if (loadingBar) loadingBar.style.width = displayProgress + '%';
    if (loadingProgress) loadingProgress.textContent = 'Loading: ' + Math.floor(displayProgress) + '%';
  }, intervalTime);
}); 