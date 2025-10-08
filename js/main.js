/* =========================================================
   SkyrioSolutions — Interactive Script (Clean & Modern Version)
   Streamlined for performance and style consistency
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
   MOBILE MENU
============================== */
const initMobileMenu = () => {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (!hamburger || !mobileMenu) return;

  // Create overlay dynamically
  let overlay = document.querySelector(".menu-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);
  }

  const openMenu = () => {
    mobileMenu.classList.add("active");
    hamburger.classList.add("active");
    overlay.classList.add("visible");
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("active");
    hamburger.classList.remove("active");
    overlay.classList.remove("visible");
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
  };

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.contains("active") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);
  document.querySelectorAll(".mobile-menu a").forEach(link =>
    link.addEventListener("click", closeMenu)
  );

  window.addEventListener(
    "resize",
    throttle(() => {
      if (window.innerWidth > 768 && mobileMenu.classList.contains("active")) {
        closeMenu();
      }
    }, 200)
  );

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });
};

/* ==============================
   SMOOTH SCROLL
============================== */
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

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

const closeMobileMenu = () => {
  document.querySelector(".mobile-menu")?.classList.remove("active");
  document.querySelector(".hamburger")?.classList.remove("active");
  document.querySelector(".menu-overlay")?.classList.remove("visible");
  document.body.classList.remove("menu-open");
  document.body.style.overflow = "";
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

  window.addEventListener("scroll", debounce(() => {
    btn.classList.toggle("visible", window.scrollY > 600);
  }, 20));

  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
};

/* ==============================
   PORTFOLIO FILTER
============================== */
const initPortfolioFilter = () => {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".portfolio-card");

  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn =>
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.category;
      cards.forEach(card => {
        const match = category === "all" || card.dataset.category === category;
        card.style.display = match ? "block" : "none";
        card.style.opacity = match ? "1" : "0";
      });
    })
  );
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
          links.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
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
  document.querySelectorAll(".current-year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
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
