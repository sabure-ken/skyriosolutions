// =========================
// Advanced Animations
// =========================

class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.createObserver();
        this.observeElements();
        this.setupParallax();
    }

    createObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateIn(entry.target);
                } else {
                    this.animateOut(entry.target);
                }
            });
        }, options);
    }

    observeElements() {
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(el => {
            this.animatedElements.add(el);
            this.observer.observe(el);
            
            // Set initial state
            this.setInitialState(el);
        });
    }

    setInitialState(element) {
        const animationType = element.dataset.animate;
        
        switch(animationType) {
            case 'fade-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                break;
            case 'fade-down':
                element.style.opacity = '0';
                element.style.transform = 'translateY(-30px)';
                break;
            case 'fade-left':
                element.style.opacity = '0';
                element.style.transform = 'translateX(30px)';
                break;
            case 'fade-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-30px)';
                break;
            case 'scale':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                break;
            default:
                element.style.opacity = '0';
        }
        
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    animateIn(element) {
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0) scale(1)';
        }, delay);
    }

    animateOut(element) {
        // Only animate out if specifically requested
        if (element.dataset.animateOut) {
            this.setInitialState(element);
        }
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(el => {
                    const rate = el.dataset.parallaxRate || 0.5;
                    const movement = -(scrolled * rate);
                    el.style.transform = `translateY(${movement}px)`;
                });
            });
        }
    }
}

// Typing Animation
class TypeWriter {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: options.typeSpeed || 50,
            deleteSpeed: options.deleteSpeed || 30,
            pauseTime: options.pauseTime || 2000,
            loop: options.loop !== false,
            ...options
        };
        
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            // Deleting text
            this.currentCharIndex--;
        } else {
            // Typing text
            this.currentCharIndex++;
        }
        
        // Display current text
        this.element.textContent = currentText.substring(0, this.currentCharIndex);
        
        // Calculate typing speed
        let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
        
        // Add random variation to make it look more natural
        typeSpeed += Math.random() * 50;
        
        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            // Finished typing, pause then start deleting
            typeSpeed = this.options.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            // Finished deleting, move to next text
            this.isDeleting = false;
            this.currentTextIndex++;
            
            if (this.currentTextIndex >= this.texts.length) {
                if (this.options.loop) {
                    this.currentTextIndex = 0;
                } else {
                    return; // Stop if not looping
                }
            }
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Counter Animation
class Counter {
    constructor(element, options = {}) {
        this.element = element;
        this.target = parseInt(element.dataset.count) || 0;
        this.options = {
            duration: options.duration || 2000,
            separator: options.separator || ',',
            ...options
        };
        
        this.startTime = null;
        this.initialValue = 0;
        this.animate();
    }

    animate(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        
        const progress = timestamp - this.startTime;
        const percentage = Math.min(progress / this.options.duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
        
        const currentValue = Math.floor(this.initialValue + (this.target - this.initialValue) * easeOutQuart);
        
        // Format number with separator
        this.element.textContent = currentValue.toLocaleString();
        
        if (percentage < 1) {
            requestAnimationFrame((ts) => this.animate(ts));
        } else {
            this.element.textContent = this.target.toLocaleString();
        }
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize typing animation if element exists
    const typeWriterElement = document.querySelector('[data-typewriter]');
    if (typeWriterElement) {
        const texts = JSON.parse(typeWriterElement.dataset.texts || '[]');
        new TypeWriter(typeWriterElement, texts);
    }
    
    // Initialize counters
    const counterElements = document.querySelectorAll('[data-count]');
    counterElements.forEach(el => {
        // Only animate when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    new Counter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(el);
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ScrollAnimations,
        TypeWriter,
        Counter
    };
}