// Main JavaScript for SkyrioSolutions - UPDATED FOR NEW CSS
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

// Navigation functionality - COMPLETELY UPDATED FOR NEW CSS
function initializeNavigation() {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Header scroll effect with improved performance
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down for mobile
        if (window.innerWidth <= 768) {
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
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

    // Mobile menu toggle - UPDATED FOR NEW STRUCTURE
    if (hamburger && mobileMenu) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Toggle body scroll
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                createBackdrop();
            } else {
                document.body.style.overflow = '';
                removeBackdrop();
            }
        });

        // Close mobile menu when clicking on links
        mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !mobileMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1023 && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function closeMobileMenu() {
        if (hamburger && mobileMenu) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open navigation menu');
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            removeBackdrop();
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

// Animation initialization - UPDATED FOR NEW CSS CLASSES
function initializeAnimations() {
    // Use Intersection Observer API for better performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add specific animation classes based on existing classes
                if (entry.target.classList.contains('slide-in-left')) {
                    entry.target.style.transform = 'translateX(0)';
                }
                if (entry.target.classList.contains('slide-in-right')) {
                    entry.target.style.transform = 'translateX(0)';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and portfolio items with staggered animation
    const animatedElements = document.querySelectorAll('.card, .portfolio-card, .testimonial-card');
    animatedElements.forEach((el, index) => {
        if (!el.classList.contains('visible')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        }
    });

    // Hero animations - only if not already animated
    const heroElements = document.querySelectorAll('.hero-kicker, .hero-title, .hero-subtitle, .hero-ctas, .hero-features, .hero-card');
    let hasAnimated = sessionStorage.getItem('heroAnimated');
    
    if (!hasAnimated) {
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
            
            // Trigger animations after a short delay
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        });
        sessionStorage.setItem('heroAnimated', 'true');
    }

    // Initialize stats counter if exists
    initializeStatsCounter();
}

// Set current year in footer
function initializeCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Smooth scrolling for anchor links - ENHANCED
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
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

                // Update URL without page jump
                history.pushState(null, null, href);
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
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

// Theme enhancements for the cool color scheme
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

    // Add gradient animation to hero elements
    const gradientElements = document.querySelectorAll('.hero-title, .site-title');
    gradientElements.forEach(el => {
        el.style.backgroundSize = '200% 200%';
        el.style.animation = 'gradientShift 3s ease infinite';
    });
}

// Stats counter animation
function initializeStatsCounter() {
    const statItems = document.querySelectorAll('.stat-item strong');
    if (statItems.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.textContent.replace(/,/g, ''));
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        element.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current).toLocaleString();
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

// Portfolio filtering enhancement
function initializePortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (filterBtns.length === 0 || portfolioCards.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            const filterValue = this.getAttribute('data-filter') || 'all';
            
            // Filter portfolio items with animation
            portfolioCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || category === filterValue;
                
                if (shouldShow) {
                    // Show with staggered animation
                    setTimeout(() => {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    }, index * 50);
                } else {
                    // Hide with animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Initialize with 'all' filter active
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn && !allBtn.classList.contains('active')) {
        allBtn.classList.add('active');
        allBtn.setAttribute('aria-pressed', 'true');
    }
}

// Enhanced mobile form handling
function initializeMobileForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Prevent zoom on focus in iOS for better UX
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Store original font size
            const originalFontSize = window.getComputedStyle(input).fontSize;
            
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    this.style.fontSize = originalFontSize;
                    this.style.transform = 'scale(1)';
                }
            });
            
            input.addEventListener('blur', function() {
                this.style.fontSize = '';
                this.style.transform = '';
            });

            // Enhanced validation with better UX
            input.addEventListener('input', function() {
                if (window.innerWidth <= 768) {
                    this.style.borderColor = '';
                    this.style.background = '';
                    
                    if (this.hasAttribute('required') && this.value.trim()) {
                        this.style.borderColor = '#10b981';
                    }
                }
            });
        });

        // Optimize form layout for mobile
        if (window.innerWidth <= 768) {
            const labels = form.querySelectorAll('label');
            labels.forEach(label => {
                if (!label.style.padding) {
                    label.style.padding = '8px 0';
                    label.style.display = 'block';
                }
            });
            
            // Ensure proper spacing
            form.style.gap = '1rem';
            form.style.display = 'flex';
            form.style.flexDirection = 'column';
        }
    });
    
    // Handle viewport changes
    window.addEventListener('resize', () => {
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (window.innerWidth > 768) {
                    input.style.fontSize = '';
                    input.style.borderColor = '';
                    input.style.transform = '';
                }
            });
        });
    });
}

// Contact form handling
function initializeContactForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Mobile-specific validation
            if (window.innerWidth <= 768) {
                if (!validateMobileForm(this)) {
                    showNotification('Please fill all required fields correctly.', 'error');
                    return;
                }
            } else {
                // Desktop validation
                if (!validateForm(this)) {
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
            submitBtn.style.minHeight = '44px';
            
            // Add loading state styles
            submitBtn.style.background = 'var(--accent-teal)';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.style.opacity = '0.8';
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.style.cursor = '';
                submitBtn.style.opacity = '1';
            }, 2000);
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Clear error state when user starts typing
                if (this.value.trim()) {
                    this.style.borderColor = '';
                    this.style.background = '';
                }
            });
        });
    }
}

// Mobile form validation
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

// Desktop form validation
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            input.style.background = 'rgba(239, 68, 68, 0.1)';
            isValid = false;
        } else {
            input.style.borderColor = '';
            input.style.background = '';
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.style.borderColor = '#ef4444';
                input.style.background = 'rgba(239, 68, 68, 0.1)';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Individual field validation
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

// Notification system for mobile
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    
    // Mobile-optimized styles
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
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: ${isMobile ? 'calc(100vw - 2rem)' : '300px'};
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        text-align: ${isMobile ? 'center' : 'left'};
        font-size: ${isMobile ? '0.9rem' : '1rem'};
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = isMobile ? 'translateY(0)' : 'translateX(0)';
    }, 100);
    
    // Auto-remove after delay
    const autoRemoveTimeout = setTimeout(() => {
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
            clearTimeout(autoRemoveTimeout);
            notification.style.transform = 'translateY(-100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
}

// Touch-friendly interactions
function initializeTouchInteractions() {
    // Add touch swipe support for portfolio items
    const portfolioSection = document.querySelector('.portfolio');
    if (portfolioSection && window.innerWidth <= 768) {
        let startX = 0;
        let currentX = 0;
        
        portfolioSection.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        portfolioSection.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        portfolioSection.addEventListener('touchend', () => {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                // Optional: Add portfolio navigation here
                console.log('Swipe detected:', diff > 0 ? 'left' : 'right');
            }
        }, { passive: true });
    }
    
    // Improve touch experience for buttons and links
    if (window.innerWidth <= 768) {
        const interactiveElements = document.querySelectorAll('button, a, .btn, .card, .portfolio-card');
        interactiveElements.forEach(element => {
            element.style.webkitTapHighlightColor = 'rgba(14, 165, 233, 0.3)';
        });
    }
}

// Mobile performance optimizations
function initializeMobilePerformance() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            optimizeAnimationsForPerformance();
        }, 250);
    });

    // Optimize scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Heavy operations after scroll ends
        }, 100);
    });

    // Reduce animation intensity on low-performance devices
    function optimizeAnimationsForPerformance() {
        const isLowPerformance = window.innerWidth <= 768 || 
                                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isLowPerformance) {
            document.documentElement.style.setProperty('--shadow-lg', '0 4px 6px -1px rgba(0, 0, 0, 0.1)');
            
            const animatedElements = document.querySelectorAll('*');
            animatedElements.forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.transition && style.transition !== 'all 0s ease 0s') {
                    if (el.classList.contains('btn') || el.classList.contains('card')) {
                        el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
                    }
                }
            });
        }
    }

    // Initial optimization
    optimizeAnimationsForPerformance();
}

// Mobile viewport height fix for iOS
function initializeViewportHeightFix() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

// Scroll-to-top functionality
function addScrollToTopButton() {
    // Remove existing button if any
    const existingBtn = document.querySelector('.scroll-to-top');
    if (existingBtn) {
        existingBtn.remove();
    }

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
    
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-5px) scale(1.1)';
        scrollBtn.style.boxShadow = '0 10px 25px rgba(14, 165, 233, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        if (parseInt(scrollBtn.style.opacity) === 1) {
            scrollBtn.style.transform = 'translateY(0) scale(1)';
            scrollBtn.style.boxShadow = 'var(--shadow-lg)';
        }
    });
    
    scrollBtn.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll position
    function updateScrollButton() {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
            scrollBtn.style.pointerEvents = 'auto';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(100px)';
            scrollBtn.style.pointerEvents = 'none';
        }
    }
    
    window.addEventListener('scroll', updateScrollButton);
    updateScrollButton(); // Initial check
}

// Utility function for scroll-to-top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Close mobile menu function (used in navigation)
function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove backdrop
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

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        initializeContactForms,
        scrollToTop,
        showNotification,
        initializePortfolioFilter,
        closeMobileMenu
    };
}