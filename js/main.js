// === SkyrioSolutions Main Script ===
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    handleContactForm('contactForm');
    addScrollToTopButton();
    initializeViewportHeightFix();
});

// === Initialize Application ===
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

// === Navigation ===
function initializeNavigation() {
    const header = document.querySelector('.header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navCTA = document.querySelector('.nav-cta');
    const navContainer = document.querySelector('.nav-container');

    // Header scroll styling
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 100);
    });

    if (!hamburger || !navLinks) return;

    const closeMenu = () => {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (navCTA && window.innerWidth <= 768 && !navContainer.contains(navCTA)) {
            navContainer.appendChild(navCTA);
        }
    };

    hamburger.addEventListener('click', e => {
        e.stopPropagation();
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !expanded);
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';

        if (navCTA && window.innerWidth <= 768) {
            navLinks.classList.contains('active') ? navLinks.appendChild(navCTA) : navContainer.appendChild(navCTA);
        }
    });

    navLinks.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', closeMenu)
    );

    document.addEventListener('click', e => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
}

// === Animations ===
function initializeAnimations() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transform =
            el.classList.contains('slide-in-left') ? 'translateX(-50px)' :
            el.classList.contains('slide-in-right') ? 'translateX(50px)' : 'translateY(30px)';
        observer.observe(el);
    });
}

// === Footer Year ===
function initializeCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
}

// === Smooth Scroll ===
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// === Contact Form ===
function handleContactForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (window.innerWidth <= 768 && !validateMobileForm(form)) {
            showNotification('Please fill all required fields correctly.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.8';

        setTimeout(() => {
            showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }, 2000);
    });

    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
}

function validateMobileForm(form) {
    return Array.from(form.querySelectorAll('[required]')).every(validateField);
}

function validateField(field) {
    const error = field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    if (field.hasAttribute('required') && (!field.value.trim() || error)) {
        field.style.borderColor = '#ef4444';
        field.style.background = 'rgba(239,68,68,0.1)';
        return false;
    }
    field.style.borderColor = '';
    field.style.background = '';
    return true;
}

// === Notification System ===
function showNotification(message, type = 'info') {
    const isMobile = window.innerWidth <= 768;
    const div = document.createElement('div');
    div.textContent = message;
    div.style.cssText = `
        position: fixed;
        top: ${isMobile ? '80px' : '100px'};
        ${isMobile ? 'left:1rem;right:1rem;' : 'right:2rem;'}
        background: ${type === 'success' ? 'var(--gradient-tech)' :
                     type === 'error' ? 'var(--gradient-secondary)' :
                     'rgba(30,41,59,0.95)'};
        color:white;border-radius:8px;
        padding:1rem;text-align:${isMobile?'center':'left'};
        transition:transform 0.3s ease;
        transform:${isMobile?'translateY(-100px)':'translateX(400px)'};
        z-index:9999;backdrop-filter:blur(10px);
    `;
    document.body.appendChild(div);
    setTimeout(() => div.style.transform = 'translate(0)', 100);
    setTimeout(() => {
        div.style.transform = isMobile ? 'translateY(-100px)' : 'translateX(400px)';
        setTimeout(() => div.remove(), 300);
    }, 5000);
    if (isMobile) div.onclick = () => div.remove();
}

// === Scroll to Top Button ===
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addScrollToTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    Object.assign(btn.style, {
        position: 'fixed', bottom: '2rem', right: '2rem',
        width: '3rem', height: '3rem', borderRadius: '50%',
        background: 'var(--gradient-tech)', color: '#fff',
        border: 'none', boxShadow: 'var(--shadow-lg)',
        opacity: '0', transform: 'translateY(100px)',
        cursor: 'pointer', transition: 'all 0.3s ease', zIndex: '1000'
    });
    btn.addEventListener('click', scrollToTop);
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        const visible = window.scrollY > 500;
        btn.style.opacity = visible ? '1' : '0';
        btn.style.transform = visible ? 'translateY(0)' : 'translateY(100px)';
    });
}

// === Active Menu Highlight ===
function setActiveMenu() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === current);
    });
}

// === Theme Enhancements ===
function initializeThemeEnhancements() {
    document.addEventListener('click', e => {
        if (e.target.matches('.btn[type="submit"], .btn[type="submit"] *')) {
            const btn = e.target.closest('.btn');
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
        }
    });
    initializeStatsCounter();
}

// === Stats Counter ===
function initializeStatsCounter() {
    const stats = document.querySelectorAll('.stat-item strong');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target, target = +el.textContent;
                let n = 0, inc = target / 50;
                const timer = setInterval(() => {
                    n += inc;
                    if (n >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else el.textContent = Math.floor(n);
                }, 30);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(s => observer.observe(s));
}

// === Portfolio Filter ===
function initializePortfolioFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.portfolio-card');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.style.display = show ? 'block' : 'none';
                card.style.opacity = show ? '1' : '0';
                card.style.transform = show ? 'scale(1)' : 'scale(0.8)';
            });
        });
    });
}

// === Mobile Enhancements ===
function initializeMobileForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('focus', () => {
                if (window.innerWidth <= 768) input.style.fontSize = '16px';
            });
            input.addEventListener('input', () => {
                if (window.innerWidth <= 768 && input.required) validateField(input);
            });
        });
    });
}

// === Touch Support ===
function initializeTouchInteractions() {
    const portfolio = document.querySelector('.portfolio');
    if (!portfolio || window.innerWidth > 768) return;

    let startX = 0, currentX = 0;
    portfolio.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    portfolio.addEventListener('touchmove', e => currentX = e.touches[0].clientX);
    portfolio.addEventListener('touchend', () => {
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) console.log('Swipe:', diff > 0 ? 'left' : 'right');
    });
}

// === Mobile Performance ===
function initializeMobilePerformance() {
    let timeout;
    window.addEventListener('scroll', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {}, 100);
    });
    if (window.innerWidth <= 768) {
        document.documentElement.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(15,23,42,0.1)');
    }
}

// === Viewport Height Fix (iOS) ===
function initializeViewportHeightFix() {
    const setVH = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    setVH();
    window.addEventListener('resize', setVH);
}

// === Export (for modules) ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        handleContactForm,
        scrollToTop,
        showNotification,
        initializePortfolioFilter
    };
}
