/* =========================================================
   SkyrioSolutions — Full Interactive Script (Fixed Version)
   Compatible with the consolidated CSS structure
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initializeHeader();
  initializeMobileMenu();
  initializeSmoothScroll();
  initializeFadeInAnimations();
  initializeFormEnhancements();
  initializeNotifications();
  initializeScrollToTop();
  initializePortfolioFilter();
  initializeActiveNav();
  updateFooterYear();
});

/* ==============================
   HEADER SCROLL EFFECT
============================== */
function initializeHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  const handleScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  };

  window.addEventListener("scroll", debounce(handleScroll, 10));
}

/* ==============================
   MOBILE MENU — FIXED VERSION
============================== */
function initializeMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileClose = document.getElementById("mobileClose");

  if (!hamburger || !mobileMenu) return;

  // Create overlay dynamically if it doesn't exist
  let overlay = document.querySelector(".menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.classList.add("menu-overlay");
    document.body.appendChild(overlay);
  }

  const openMenu = () => {
    mobileMenu.classList.add("active");
    hamburger.classList.add("active");
    document.body.classList.add("menu-open");
    overlay.classList.add("visible");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("active");
    hamburger.classList.remove("active");
    document.body.classList.remove("menu-open");
    overlay.classList.remove("visible");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  const toggleMenu = () => {
    if (mobileMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Event listeners
  hamburger.addEventListener("click", toggleMenu);
  
  if (mobileClose) {
    mobileClose.addEventListener("click", closeMenu);
  }

  overlay.addEventListener("click", closeMenu);

  // Close menu when clicking on mobile menu links
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  // Close menu on window resize (desktop breakpoint)
  window.addEventListener("resize", throttle(() => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  }, 250));
}

/* ==============================
   SMOOTH SCROLL - ENHANCED
============================== */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      
      // Skip if it's just "#" or empty
      if (targetId === "#" || !targetId || targetId === "#home") return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        
        // Close mobile menu if open
        closeMobileMenu();
        
        const headerHeight = document.querySelector(".header")?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}

// Helper function to close mobile menu
function closeMobileMenu() {
  const mobileMenu = document.querySelector(".mobile-menu");
  const hamburger = document.querySelector(".hamburger");
  const overlay = document.querySelector(".menu-overlay");
  
  if (mobileMenu && mobileMenu.classList.contains("active")) {
    mobileMenu.classList.remove("active");
    hamburger?.classList.remove("active");
    document.body.classList.remove("menu-open");
    overlay?.classList.remove("visible");
    document.body.style.overflow = "";
  }
}

/* ==============================
   FADE-IN ANIMATIONS - ENHANCED
============================== */
function initializeFadeInAnimations() {
  const fadeItems = document.querySelectorAll(
    ".section, .card, .testimonial-card, .portfolio-card, .hero-feature, .process-step, .pricing-card"
  );
  
  if (!fadeItems.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          obs.unobserve(entry.target);
        }
      });
    },
    { 
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  // Set initial state for fade-in elements
  fadeItems.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

/* ==============================
   FORM ENHANCEMENTS - UPDATED
============================== */
function initializeFormEnhancements() {
  const forms = document.querySelectorAll("form");
  const inputs = document.querySelectorAll(".form-input, .form-textarea, .form-select");
  
  if (!forms.length && !inputs.length) return;
  
  // Input focus effects
  inputs.forEach((input) => {
    // Set initial state
    if (input.value.trim()) {
      input.parentElement?.classList.add("focused");
    }
    
    input.addEventListener("focus", () => {
      input.parentElement?.classList.add("focused");
    });
    
    input.addEventListener("blur", () => {
      if (!input.value.trim()) {
        input.parentElement?.classList.remove("focused");
      }
    });
  });
  
  // Form submission handling
  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!submitBtn) return;
      
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;
      
      try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showToast("Message sent successfully!", "success");
        form.reset();
        
        // Remove focused classes
        inputs.forEach(input => {
          input.parentElement?.classList.remove("focused");
        });
        
      } catch (error) {
        showToast("Failed to send message. Please try again.", "error");
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  });
}

/* ==============================
   TOAST NOTIFICATIONS - ENHANCED
============================== */
function initializeNotifications() {
  const triggers = document.querySelectorAll("[data-toast]");
  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const message = btn.getAttribute("data-toast");
      const type = btn.getAttribute("data-toast-type") || "info";
      showToast(message, type);
    });
  });
}

function showToast(message, type = "info") {
  // Remove existing toasts
  document.querySelectorAll(".toast").forEach(toast => toast.remove());
  
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute("aria-live", "polite");
  
  // Add styles if not already in CSS
  if (!document.querySelector('#toast-styles')) {
    const styles = document.createElement('style');
    styles.id = 'toast-styles';
    styles.textContent = `
      .toast {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient-tech);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
      }
      .toast.visible {
        transform: translateX(0);
      }
      .toast-success { background: var(--gradient-secondary); }
      .toast-error { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
      @media (max-width: 768px) {
        .toast {
          right: 10px;
          left: 10px;
          max-width: none;
          transform: translateY(-100px);
        }
        .toast.visible {
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.classList.add("visible"), 10);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, 4000);
}

/* ==============================
   SCROLL TO TOP BUTTON - ENHANCED
============================== */
function initializeScrollToTop() {
  // Create button if it doesn't exist
  let scrollBtn = document.querySelector(".scroll-top");
  if (!scrollBtn) {
    scrollBtn = document.createElement("button");
    scrollBtn.className = "scroll-top";
    scrollBtn.innerHTML = "↑";
    scrollBtn.setAttribute("aria-label", "Scroll to top");
    document.body.appendChild(scrollBtn);
    
    // Add styles if not in CSS
    if (!document.querySelector('#scroll-top-styles')) {
      const styles = document.createElement('style');
      styles.id = 'scroll-top-styles';
      styles.textContent = `
        .scroll-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          background: var(--gradient-tech);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          z-index: 999;
          font-size: 1.2rem;
          box-shadow: var(--shadow-md);
        }
        .scroll-top.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .scroll-top:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        @media (max-width: 768px) {
          .scroll-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
          }
        }
      `;
      document.head.appendChild(styles);
    }
  }
  
  const handleScroll = () => {
    scrollBtn.classList.toggle("visible", window.scrollY > 500);
  };
  
  window.addEventListener("scroll", debounce(handleScroll, 10));
  
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ==============================
   PORTFOLIO FILTER - ENHANCED
============================== */
function initializePortfolioFilter() {
  const filters = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".portfolio-card");
  
  if (!filters.length || !cards.length) return;
  
  // Set initial active state
  const initialActive = document.querySelector('.filter-btn.active') || filters[0];
  if (initialActive) {
    initialActive.classList.add('active');
  }
  
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      
      const category = btn.getAttribute("data-category") || "all";
      
      // Filter cards with animation
      cards.forEach((card, index) => {
        const shouldShow = category === "all" || card.getAttribute("data-category") === category;
        
        if (shouldShow) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, index * 100);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

/* ==============================
   ACTIVE NAV LINK HIGHLIGHTING
============================== */
function initializeActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-menu-links a");
  
  if (!sections.length || !navLinks.length) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const linkHref = link.getAttribute("href");
            if (linkHref && linkHref.includes(id)) {
              // Remove active class from all links
              navLinks.forEach(l => l.classList.remove("active"));
              // Add active class to current link
              link.classList.add("active");
            }
          });
        }
      });
    },
    { 
      threshold: 0.5,
      rootMargin: "-20% 0px -20% 0px"
    }
  );
  
  sections.forEach((section) => observer.observe(section));
}

/* ==============================
   FOOTER YEAR UPDATE
============================== */
function updateFooterYear() {
  const yearEls = document.querySelectorAll(".current-year");
  yearEls.forEach((el) => {
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  });
}

/* ==============================
   PERFORMANCE OPTIMIZATIONS
============================== */
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for resize events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Apply optimizations to window events
window.addEventListener('scroll', debounce(() => {
  // Scroll-based functions can be added here
}, 10));

window.addEventListener('resize', throttle(() => {
  // Resize-based functions can be added here
}, 250));