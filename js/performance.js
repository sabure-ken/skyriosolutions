// Performance optimization for hero background
class HeroOptimizer {
  constructor() {
    this.hero = document.querySelector('.hero');
    this.init();
  }

  init() {
    this.lazyLoadBackground();
    this.optimizeAnimations();
  }

  lazyLoadBackground() {
    // Only load high-quality background when needed
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadHighQualityBackground();
            observer.unobserve(entry.target);
          }
        });
      });

      if (this.hero) {
        observer.observe(this.hero);
      }
    }
  }

  loadHighQualityBackground() {
    // You can load a higher quality background here if needed
    console.log('Loading optimized hero background');
  }

  optimizeAnimations() {
    // Reduce animations if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HeroOptimizer();
});