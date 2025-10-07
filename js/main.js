// Main JavaScript for SkyrioSolutions - UPDATED FOR YOUR HTML STRUCTURE
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
    initializeViewportHeightFix();
    initializeContactForms();
    addScrollToTopButton();
    
    console.log('SkyrioSolutions - Enhanced Mobile Experience Loaded');
}

// Navigation functionality - UPDATED FOR YOUR EXISTING HTML
function initializeNavigation() {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navCTA = document.querySelector('.nav-cta');

    // Header scroll effect
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = window.scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // Mobile menu toggle - USING EXISTING NAV-LINKS
    if (hamburger && navLinks) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle body scroll
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                createBackdrop();
                
                // Move CTA to mobile menu on small screens
                if (window.innerWidth <= 768 && navCTA && !navLinks.contains(navCTA)) {
                    navLinks.appendChild(navCTA);
                    navCTA.classList.add('mobile-cta');
                }
            } else {
                document.body.style.overflow = '';
                removeBackdrop();
                
                // Move CTA back to original position
                if (navCTA && navCTA.classList.contains('mobile-cta')) {
                    document.querySelector('.nav-container').appendChild(navCTA);
                    navCTA.classList.remove('mobile-cta');
                }
            }
        });

        // Close mobile menu when clicking on links
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !navLinks.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1023 && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // Ensure CTA is in correct position on resize
            if (window.innerWidth > 768 && navCTA && navCTA.classList.contains('mobile-cta')) {
                document.querySelector('.nav-container').appendChild(navCTA);
                navCTA.classList.remove('mobile-cta');
            }
        });
    }

    function closeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const navCTA = document.querySelector('.nav-cta');
        
        if (hamburger && navLinks) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open navigation menu');
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            removeBackdrop();
            
            // Move CTA back to original position
            if (navCTA && navCTA.classList.contains('mobile-cta')) {
                document.querySelector('.nav-container').appendChild(navCTA);
                navCTA.classList.remove('mobile-cta');
            }
        }
    }

    function createBackdrop() {
        if (!document.querySelector('.mobile-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'mobile-backdrop';
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(2px);
                z-index: 998;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(backdrop);
            
            // Animate in
            requestAnimationFrame(() => {
                backdrop.style.opacity = '1';
            });
            
            // Close menu when backdrop is clicked
            backdrop.addEventListener('click', closeMobileMenu);
        }
    }

    function removeBackdrop() {
        const backdrop = document.querySelector('.mobile-backdrop');
        if (backdrop) {
            backdrop.style.opacity = '0';
            setTimeout(() => {
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            }, 300);
        }
    }
}

// Animation initialization - UPDATED
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card, .portfolio-card, .testimonial-card');
    animatedElements.forEach((el, index) => {
        if (!el.classList.contains('visible')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        }
    });

    // Hero animations
    const heroElements = document.querySelectorAll('.hero-kicker, .hero-title, .hero-subtitle, .hero-ctas, .hero-features, .hero-card');
    heroElements.forEach((el, index) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
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
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Active menu highlighting
function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Theme enhancements
function initializeThemeEnhancements() {
    // Add loading animation to buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn[type="submit"]') || e.target.closest('.btn[type="submit"]')) {
            const btn = e.target.matches('.btn') ? e.target : e.target.closest('.btn');
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
        }
    });
}

// Portfolio filtering
function initializePortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (filterBtns.length === 0 || portfolioCards.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter') || 'all';
            
            // Filter portfolio items
            portfolioCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || category === filterValue;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Mobile form handling
function initializeMobileForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Improve touch targets for mobile
        if (window.innerWidth <= 768) {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.style.minHeight = '44px';
            });
            
            const buttons = form.querySelectorAll('button, .btn');
            buttons.forEach(button => {
                button.style.minHeight = '48px';
            });
        }
    });
}

// Contact form handling
function initializeContactForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    
    const isMobile = window.innerWidth <= 768;
    
    notification.style.cssText = `
        position: fixed;
        top: ${isMobile ? '80px' : '100px'};
        ${isMobile ? 'left: 1rem; right: 1rem;' : 'right: 2rem;'}
        padding: ${isMobile ? '1rem' : '1rem 1.5rem'};
        background: ${type === 'success' ? 'var(--gradient-tech)' : 
                     type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 
                     'rgba(30, 41, 59, 0.95)'};
        color: white;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: ${isMobile ? 'translateY(-100px)' : 'translateX(400px)'};
        transition: all 0.3s ease;
        max-width: ${isMobile ? 'calc(100vw - 2rem)' : '300px'};
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        text-align: center;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = isMobile ? 'translateY(0)' : 'translateX(0)';
    }, 100);
    
    // Auto-remove after delay
    setTimeout(() => {
        notification.style.transform = isMobile ? 'translateY(-100px)' : 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Touch interactions
function initializeTouchInteractions() {
    // Improve touch experience
    if (window.innerWidth <= 768) {
        const interactiveElements = document.querySelectorAll('button, a, .btn');
        interactiveElements.forEach(element => {
            element.style.webkitTapHighlightColor = 'rgba(14, 165, 233, 0.3)';
        });
    }
}

// Mobile performance
function initializeMobilePerformance() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Performance optimizations
        }, 250);
    });
}

// Viewport height fix for iOS
function initializeViewportHeightFix() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

// Scroll-to-top button
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
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
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll
    function updateScrollButton() {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(100px)';
        }
    }
    
    window.addEventListener('scroll', updateScrollButton);
    updateScrollButton();
}

// Utility function for scroll-to-top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Close mobile menu function
function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navCTA = document.querySelector('.nav-cta');
    const backdrop = document.querySelector('.mobile-backdrop');
    
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks) navLinks.classList.remove('active');
    if (backdrop) backdrop.remove();
    document.body.style.overflow = '';
    
    if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
    }
    
    // Move CTA back to original position
    if (navCTA && navLinks && navLinks.contains(navCTA)) {
        document.querySelector('.nav-container').appendChild(navCTA);
    }
}