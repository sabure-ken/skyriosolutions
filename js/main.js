// Main JavaScript for SkyrioSolutions
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeAnimations();
    initializeCurrentYear();
    initializeSmoothScroll();
    setActiveMenu();
    initializeThemeEnhancements();
    initializeMobileForms();
    initializeTouchInteractions();
    initializeMobilePerformance();
    initializePortfolioFilter();
}

// Navigation functionality - UPDATED FOR MOBILE
function initializeNavigation() {
    const header = document.querySelector('.header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navCTA = document.querySelector('.nav-cta');

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle - UPDATED
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                // Move CTA button into mobile menu
                if (navCTA && window.innerWidth <= 768) {
                    navLinks.appendChild(navCTA);
                }
            } else {
                document.body.style.overflow = 'auto';
                // Move CTA button back to original position
                if (navCTA && window.innerWidth <= 768) {
                    document.querySelector('.nav-container').appendChild(navCTA);
                }
            }
        });

        // Close mobile menu when clicking on links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Move CTA button back to original position
                if (navCTA && window.innerWidth <= 768) {
                    document.querySelector('.nav-container').appendChild(navCTA);
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Move CTA button back to original position
                if (navCTA && window.innerWidth <= 768) {
                    document.querySelector('.nav-container').appendChild(navCTA);
                }
            }
        });

        // Close mobile menu on window resize if it becomes desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Ensure CTA button is in correct position
                if (navCTA && !document.querySelector('.nav-container').contains(navCTA)) {
                    document.querySelector('.nav-container').appendChild(navCTA);
                }
            }
        });
    }
}

// Animation initialization
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Specific animations for slide-in classes
    const slideLeftElements = document.querySelectorAll('.slide-in-left');
    slideLeftElements.forEach(el => {
        el.style.transform = 'translateX(-50px)';
    });

    const slideRightElements = document.querySelectorAll('.slide-in-right');
    slideRightElements.forEach(el => {
        el.style.transform = 'translateX(50px)';
    });
}

// Set current year in footer
function initializeCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScroll() {
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
}

// Form handling - ENHANCED FOR MOBILE
function handleContactForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Mobile-specific validation
            if (window.innerWidth <= 768) {
                if (!validateMobileForm(this)) {
                    showNotification('Please fill all required fields correctly.', 'error');
                    return;
                }
            }
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Mobile-optimized loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            submitBtn.style.minHeight = '44px'; // Maintain touch target size
            
            // Add loading state styles
            submitBtn.style.background = 'var(--accent-teal)';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.style.opacity = '0.8';
            
            // Simulate API call
            setTimeout(() => {
                // Show success message with theme colors
                showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.style.cursor = 'pointer';
                submitBtn.style.opacity = '1';
            }, 2000);
        });

        // Real-time validation for mobile
        if (window.innerWidth <= 768) {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateField(this);
                });
            });
        }
    }
}

// NEW: Mobile form validation
function validateMobileForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// NEW: Individual field validation
function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.style.borderColor = '#ef4444';
        field.style.background = 'rgba(239, 68, 68, 0.1)';
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            field.style.borderColor = '#ef4444';
            field.style.background = 'rgba(239, 68, 68, 0.1)';
            return false;
        }
    }
    
    // Reset styles if valid
    field.style.borderColor = '';
    field.style.background = '';
    return true;
}

// UPDATED: Notification system for mobile
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    // Mobile-optimized styles
    const isMobile = window.innerWidth <= 768;
    
    notification.style.cssText = `
        position: fixed;
        top: ${isMobile ? '80px' : '100px'};
        ${isMobile ? 'left: 1rem; right: 1rem;' : 'right: 2rem;'}
        padding: ${isMobile ? '1rem' : '1rem 1.5rem'};
        background: ${type === 'success' ? 'var(--gradient-tech)' : 
                     type === 'error' ? 'var(--gradient-secondary)' : 
                     'rgba(30, 41, 59, 0.95)'};
        color: white;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: ${isMobile ? 'translateY(-100px)' : 'translateX(400px)'};
        transition: transform 0.3s ease;
        max-width: ${isMobile ? 'calc(100vw - 2rem)' : '300px'};
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        text-align: ${isMobile ? 'center' : 'left'};
        font-size: ${isMobile ? '0.9rem' : '1rem'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0) translateY(0)';
    }, 100);
    
    // Auto-remove after delay
    setTimeout(() => {
        notification.style.transform = isMobile ? 'translateY(-100px)' : 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Allow tap to dismiss on mobile
    if (isMobile) {
        notification.style.cursor = 'pointer';
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateY(-100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
}

// Initialize contact forms
document.addEventListener('DOMContentLoaded', function() {
    handleContactForm('contactForm');
});

// Utility function for scroll-to-top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll-to-top button dynamically
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        background: var(--gradient-tech);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.25rem;
        box-shadow: var(--shadow-lg);
        transition: all 0.3s ease;
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-5px) scale(1.1)';
        scrollBtn.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0) scale(1)';
        scrollBtn.style.boxShadow = 'var(--shadow-lg)';
    });
    
    scrollBtn.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(100px)';
        }
    });
}

// Initialize scroll-to-top button
document.addEventListener('DOMContentLoaded', addScrollToTopButton);

// Active menu highlighting - UPDATED FOR MULTI-PAGE NAVIGATION
function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Check if this link matches the current page
        if (linkHref === currentPage) {
            link.classList.add('active');
        }
        
        // Special case for index.html and root
        if ((currentPage === 'index.html' || currentPage === '') && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
}

// NEW: Theme enhancements for the cool color scheme
function initializeThemeEnhancements() {
    // Add loading animation to buttons with loading states
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn[type="submit"]') || e.target.closest('.btn[type="submit"]')) {
            const btn = e.target.matches('.btn') ? e.target : e.target.closest('.btn');
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
        }
    });

    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.card, .portfolio-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Add intersection observer for stats counting (if you have stats)
    initializeStatsCounter();
}

// NEW: Stats counter animation
function initializeStatsCounter() {
    const statItems = document.querySelectorAll('.stat-item strong');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.textContent);
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target;
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current);
                    }
                }, 30);
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    statItems.forEach(item => {
        observer.observe(item);
    });
}

// NEW: Portfolio filtering enhancement
function initializePortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                portfolioCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// NEW: Enhanced mobile form handling
function initializeMobileForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Prevent zoom on focus in iOS
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    this.style.fontSize = '16px'; // Prevent zoom
                }
            });
            
            // Add input event for real-time validation on mobile
            input.addEventListener('input', function() {
                if (window.innerWidth <= 768 && this.hasAttribute('required')) {
                    validateField(this);
                }
            });
        });

        // Improve touch targets for mobile
        if (window.innerWidth <= 768) {
            const buttons = form.querySelectorAll('button, .btn');
            buttons.forEach(button => {
                button.style.minHeight = '44px';
                button.style.padding = '12px 16px';
            });
            
            // Add larger touch targets for form elements
            const labels = form.querySelectorAll('label');
            labels.forEach(label => {
                label.style.padding = '8px 0';
            });
        }
    });
}

// NEW: Touch-friendly carousel/slider for mobile
function initializeTouchInteractions() {
    // Add touch swipe support for portfolio items
    const portfolioSection = document.querySelector('.portfolio');
    if (portfolioSection && window.innerWidth <= 768) {
        let startX = 0;
        let currentX = 0;
        
        portfolioSection.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        portfolioSection.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });
        
        portfolioSection.addEventListener('touchend', () => {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                // You can add portfolio navigation here
                console.log('Swipe detected:', diff > 0 ? 'left' : 'right');
            }
        });
    }
    
    // Improve touch experience for buttons and links
    if (window.innerWidth <= 768) {
        const interactiveElements = document.querySelectorAll('button, a, .btn, .card, .portfolio-card');
        interactiveElements.forEach(element => {
            element.style.webkitTapHighlightColor = 'rgba(14, 165, 233, 0.3)';
        });
    }
}

// NEW: Mobile performance optimizations
function initializeMobilePerformance() {
    // Debounce scroll events for mobile performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Heavy operations after scroll ends
        }, 100);
    });

    // Optimize animations for mobile
    if (window.innerWidth <= 768) {
        // Reduce animation intensity on mobile
        document.documentElement.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(15, 23, 42, 0.1)');
        
        // Optimize transition durations for better mobile performance
        const animatedElements = document.querySelectorAll('*');
        animatedElements.forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.transition && style.transition !== 'all 0s ease 0s') {
                el.style.transition = style.transition.replace(/\d\.\d+s/g, '0.3s');
            }
        });
    }
}

// NEW: Mobile viewport height fix for iOS
function initializeViewportHeightFix() {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // We listen to the resize event
    window.addEventListener('resize', () => {
        // We execute the same script as before
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

// Initialize viewport height fix for mobile
document.addEventListener('DOMContentLoaded', initializeViewportHeightFix);

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        handleContactForm,
        scrollToTop,
        showNotification,
        initializePortfolioFilter
    };
}