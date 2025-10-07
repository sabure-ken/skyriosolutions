/* =========================================================
   SkyRioski — Full Interactive Script (Final Version)
   Includes right-side mobile menu, overlay click-to-close,
   and animated hamburger transformation
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
  updateFooterYear();
});

/* ==============================
   HEADER SCROLL EFFECT
============================== */
function initializeHeader() {
  const header = document.querySelector(".header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

/* ==============================
   MOBILE MENU — RIGHT SIDE SLIDER + OVERLAY + HAMBURGER ANIMATION
============================== */
function initializeMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (!hamburger || !mobileMenu) return;

  // Create overlay dynamically
  const overlay = document.createElement("div");
  overlay.classList.add("menu-overlay");
  document.body.appendChild(overlay);

  const toggleMenu = (isOpen) => {
    mobileMenu.classList.toggle("active", isOpen);
    hamburger.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    overlay.classList.toggle("visible", isOpen);
  };

  hamburger.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("active");
    toggleMenu(isOpen);
  });

  overlay.addEventListener("click", () => toggleMenu(false));

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  // Close menu on window resize (desktop)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) toggleMenu(false);
  });
}

/* ==============================
   SMOOTH SCROLL
============================== */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
}

/* ==============================
   FADE-IN ANIMATIONS
============================== */
function initializeFadeInAnimations() {
  const fadeItems = document.querySelectorAll(
    ".section, .card, .testimonial-card, .portfolio-card, .hero-feature"
  );
  if (!fadeItems.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeItems.forEach((el) => observer.observe(el));
}

/* ==============================
   FORM ENHANCEMENTS
============================== */
function initializeFormEnhancements() {
  const inputs = document.querySelectorAll(".form-input");
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused");
    });
    input.addEventListener("blur", () => {
      if (!input.value.trim()) {
        input.parentElement.classList.remove("focused");
      }
    });
  });
}

/* ==============================
   TOAST NOTIFICATIONS
============================== */
function initializeNotifications() {
  const triggers = document.querySelectorAll("[data-toast]");
  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const message = btn.getAttribute("data-toast");
      showToast(message);
    });
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("visible"), 10);
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ==============================
   SCROLL TO TOP BUTTON
============================== */
function initializeScrollToTop() {
  const scrollBtn = document.querySelector(".scroll-top");
  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("visible", window.scrollY > 500);
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ==============================
   PORTFOLIO FILTER
============================== */
function initializePortfolioFilter() {
  const filters = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".portfolio-card");
  if (!filters.length) return;

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");
      cards.forEach((card) => {
        card.style.display =
          category === "all" || card.classList.contains(category)
            ? "block"
            : "none";
      });
    });
  });
}

/* ==============================
   FOOTER YEAR UPDATE
============================== */
function updateFooterYear() {
  const yearEl = document.querySelector(".current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
