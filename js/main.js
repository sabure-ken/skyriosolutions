/* =========================================================
   SkyrioSolutions — Interactive Script (Clean & Modern Version)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initFadeInAnimations();
  initFormEnhancements();
  initNotifications();
  initScrollToTop();
  initPortfolioFilter();
  initActiveNav();
  updateFooterYear();
});

/* ==============================
   HEADER SCROLL EFFECT
============================== */
const initHeader = () => {
  const header = document.querySelector(".header");
  if (!header) return;

  const handleScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  };

  window.addEventListener("scroll", debounce(handleScroll, 15));
};

/* ==============================
   CLOSE MOBILE MENU (hoisted, global)
============================== */
function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");
  const overlay = document.querySelector(".menu-overlay");

  if (mobileMenu) {
    mobileMenu.classList.remove("active");
    mobileMenu.setAttribute("aria-hidden", "true");
  }
  if (hamburger) {
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  }
  if (overlay) {
    overlay.classList.remove("visible");
  }
  document.body.style.overflow = "";
}

/* ==============================
   MOBILE MENU (robust / delegated)
============================== */
const initMobileMenu = () => {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("mobileClose");
  if (!hamburger || !mobileMenu) return;

  // Create overlay if it doesn't exist
  let overlay = document.querySelector(".menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);
  }

  const openMenu = () => {
    mobileMenu.classList.add("active");
    mobileMenu.setAttribute("aria-hidden", "false");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  };

  const closeMenuLocal = () => {
    mobileMenu.classList.remove("active");
    mobileMenu.setAttribute("aria-hidden", "true");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
  };

  // Toggle button
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.contains("active") ? closeMenuLocal() : openMenu();
  });

  // Close triggers
  closeBtn?.addEventListener("click", closeMenuLocal);
  overlay.addEventListener("click", closeMenuLocal);

  // Delegated link handler (inside mobile menu) - FIXED VERSION
  mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href")?.trim();
    
    if (!href || href === "#") {
      e.preventDefault();
      closeMenuLocal();
      return;
    }

    // In-page anchor (smooth scroll)
    if (href.startsWith("#")) {
      e.preventDefault();
      closeMenuLocal();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.querySelector(".header")?.offsetHeight || 70;
        const offset = Math.max(target.getBoundingClientRect().top + window.pageYOffset - headerHeight, 0);
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
      return;
    }

    // External links (http, mailto, tel) — let browser handle
    if (/^(https?:|mailto:|tel:)/i.test(href)) {
      closeMenuLocal();
      return; // Let browser handle normally
    }

    // Local pages - navigate immediately - THIS IS THE FIX
    e.preventDefault();
    closeMenuLocal();
    window.location.href = href; // ← CHANGED THIS LINE
  });

  // Auto close on desktop resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains("active")) {
      closeMenuLocal();
    }
  });

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenuLocal();
  });
};

/* ==============================
   SMOOTH SCROLL
============================== */
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#" || targetId.startsWith("http")) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        closeMobileMenu();
        const headerHeight = document.querySelector(".header")?.offsetHeight || 70;
        const offset = target.offsetTop - headerHeight;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    });
  });
};

/* ==============================
   FADE-IN ANIMATIONS
============================== */
const initFadeInAnimations = () => {
  const items = document.querySelectorAll(
    ".section, .card, .portfolio-card, .hero-feature, .pricing-card"
  );
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach(el => {
    el.classList.add("fade-init");
    observer.observe(el);
  });
};

/* ==============================
   FORM ENHANCEMENTS
============================== */
const initFormEnhancements = () => {
  const forms = document.querySelectorAll("form");
  if (!forms.length) return;

  forms.forEach(form => {
    const inputs = form.querySelectorAll(".form-input, .form-textarea, .form-select");

    inputs.forEach(input => {
      input.addEventListener("focus", () => input.parentElement?.classList.add("focused"));
      input.addEventListener("blur", () => {
        if (!input.value.trim()) input.parentElement?.classList.remove("focused");
      });
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const text = btn?.textContent;
      btn.textContent = "Sending...";
      btn.disabled = true;

      try {
        await new Promise(r => setTimeout(r, 2000));
        showToast("Message sent successfully!", "success");
        form.reset();
        form.querySelectorAll(".focused").forEach(f => f.classList.remove("focused"));
      } catch {
        showToast("Failed to send message. Please try again.", "error");
      } finally {
        btn.textContent = text;
        btn.disabled = false;
      }
    });
  });
};

/* ==============================
   TOAST NOTIFICATIONS
============================== */
const initNotifications = () => {
  document.querySelectorAll("[data-toast]").forEach(btn =>
    btn.addEventListener("click", () =>
      showToast(btn.dataset.toast, btn.dataset.toastType || "info")
    )
  );
};

const showToast = (msg, type = "info") => {
  document.querySelectorAll(".toast").forEach(t => t.remove());
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("visible"), 10);
  setTimeout(() => toast.classList.remove("visible"), 4000);
  setTimeout(() => toast.remove(), 4300);
};

/* ==============================
   SCROLL TO TOP
============================== */
const initScrollToTop = () => {
  let btn = document.querySelector(".scroll-top");
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "scroll-top";
    btn.innerHTML = "↑";
    document.body.appendChild(btn);
  }

  window.addEventListener(
    "scroll",
    debounce(() => btn.classList.toggle("visible", window.scrollY > 600), 20)
  );
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
};

/* ==============================
   PORTFOLIO FILTER
============================== */
const initPortfolioFilter = () => {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".portfolio-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.category;
      cards.forEach(card => {
        const match = category === "all" || card.dataset.category === category;
        card.style.display = match ? "block" : "none";
        card.style.opacity = match ? "1" : "0";
      });
    });
  });
};

/* ==============================
   ACTIVE NAV HIGHLIGHT
============================== */
const initActiveNav = () => {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-link, .mobile-menu a");
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link =>
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
          );
        }
      });
    },
    { threshold: 0.4, rootMargin: "-20% 0px -20% 0px" }
  );

  sections.forEach(section => observer.observe(section));
};

/* ==============================
   FOOTER YEAR
============================== */
const updateFooterYear = () => {
  document
    .querySelectorAll(".current-year")
    .forEach(el => (el.textContent = new Date().getFullYear()));
};

/* ==============================
   UTILITIES
============================== */
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const throttle = (fn, limit) => {
  let waiting = false;
  return (...args) => {
    if (!waiting) {
      fn(...args);
      waiting = true;
      setTimeout(() => (waiting = false), limit);
    }
  };
};
// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
  
  // Handle FAQ anchor links
  const faqAnchorLinks = document.querySelectorAll('a[href="#faq"]');
  faqAnchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('faq').scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});

// Cookie Consent Banner Functionality
function initCookieConsent() {
  // Check if user has already made a choice
  if (!localStorage.getItem('cookiesAccepted')) {
    createCookieBanner();
  } else {
    // Apply saved preferences
    applyCookiePreferences();
  }
}

function createCookieBanner() {
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-label', 'Cookie consent banner');
  banner.innerHTML = `
    <div class="cookie-content">
      <div class="cookie-text">
        <h4><i class="fas fa-cookie-bite"></i> Cookie Preferences</h4>
        <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By continuing to use our site, you consent to our use of cookies. <a href="cookies.html" style="color: #7dd3fc; text-decoration: underline;">Learn more</a></p>
      </div>
      <div class="cookie-actions">
        <button class="btn btn-secondary" id="cookie-customize">
          <i class="fas fa-cog"></i> Customize
        </button>
        <button class="btn btn-secondary" id="cookie-reject">
          <i class="fas fa-times"></i> Reject All
        </button>
        <button class="btn btn-primary" id="cookie-accept">
          <i class="fas fa-check"></i> Accept All
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Add event listeners
  document.getElementById('cookie-accept').addEventListener('click', () => {
    acceptAllCookies();
    banner.remove();
  });
  
  document.getElementById('cookie-reject').addEventListener('click', () => {
    rejectAllCookies();
    banner.remove();
  });
  
  document.getElementById('cookie-customize').addEventListener('click', () => {
    window.location.href = 'cookies.html#manage';
  });
  
  // Add CSS for banner
  addCookieBannerCSS();
}

function acceptAllCookies() {
  const preferences = {
    preference: true,
    analytics: true,
    marketing: true,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
  localStorage.setItem('cookiesAccepted', 'true');
  applyCookiePreferences();
  
  // Show acceptance notification
  showCookieNotification('Cookie preferences accepted!', 'success');
}

function rejectAllCookies() {
  const preferences = {
    preference: false,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
  localStorage.setItem('cookiesAccepted', 'true');
  applyCookiePreferences();
  
  // Show rejection notification
  showCookieNotification('Non-essential cookies rejected.', 'info');
}

function applyCookiePreferences() {
  const preferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{}');
  
  // Apply analytics preferences
  if (!preferences.analytics) {
    disableAnalytics();
  }
  
  // Apply marketing preferences
  if (!preferences.marketing) {
    disableMarketing();
  }
  
  // Always enable essential functionality
  enableEssentialFeatures();
}

function disableAnalytics() {
  // Disable Google Analytics
  window['ga-disable-GA_MEASUREMENT_ID'] = true;
  console.log('Analytics cookies disabled');
}

function disableMarketing() {
  // Disable marketing trackers
  console.log('Marketing cookies disabled');
}

function enableEssentialFeatures() {
  // Enable essential website functionality
  console.log('Essential features enabled');
}

function showCookieNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `cookie-notification cookie-notification-${type}`;
  notification.innerHTML = `
    <div class="cookie-notification-content">
      <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('cookie-notification-show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('cookie-notification-show');
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function addCookieBannerCSS() {
  const css = `
    .cookie-banner {
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      right: 2rem;
      max-width: 500px;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border: 1px solid rgba(14, 165, 233, 0.3);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      backdrop-filter: blur(10px);
      animation: slideUpIn 0.5s ease-out;
    }
    
    @keyframes slideUpIn {
      from {
        opacity: 0;
        transform: translateY(100px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .cookie-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .cookie-text h4 {
      color: #0ea5e9;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
    }
    
    .cookie-text p {
      color: #cbd5e1;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }
    
    .cookie-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    
    .cookie-actions .btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      flex: 1;
      min-width: 120px;
    }
    
    .cookie-notification {
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      z-index: 10001;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      max-width: 300px;
    }
    
    .cookie-notification-error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }
    
    .cookie-notification-info {
      background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
    }
    
    .cookie-notification-show {
      transform: translateX(0);
    }
    
    .cookie-notification-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .cookie-notification-content i {
      font-size: 1.2rem;
    }
    
    @media (max-width: 768px) {
      .cookie-banner {
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
      }
      
      .cookie-actions {
        flex-direction: column;
      }
      
      .cookie-actions .btn {
        width: 100%;
      }
      
      .cookie-notification {
        right: 1rem;
        left: 1rem;
        max-width: none;
      }
    }
    
    @media (max-width: 480px) {
      .cookie-banner {
        padding: 1rem;
      }
      
      .cookie-text h4 {
        font-size: 1rem;
      }
      
      .cookie-text p {
        font-size: 0.85rem;
      }
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

// Initialize cookie consent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initCookieConsent();
});

// Export functions for global access
window.cookieConsent = {
  showBanner: createCookieBanner,
  acceptAll: acceptAllCookies,
  rejectAll: rejectAllCookies,
  showSettings: function() {
    window.location.href = 'cookies.html#manage';
  }
};