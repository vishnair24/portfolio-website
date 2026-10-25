/**
 * Personal Portfolio Engine
 * Author: Sarrvish Nair
 * Architecture: Modular Vanilla ES6+
 * Contains 10 discrete, error-handled features.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Application Data Registry
  const PROJECT_DETAILS = [
    {
      title: "CIDR & IPv4 Subnet Analyzer",
      description: "A client-side subnet calculator engineered to process dotted-decimal IPv4 blocks. Performs direct bitwise bit-shifting to calculate network boundaries, host masks, and optimal Classless Inter-Domain Routing partitions without external API lookups."
    },
    {
      title: "Distributed Database Fragmentation Visualizer",
      description: "An educational simulator modeling relational schemas partitioned horizontally and vertically across multi-tier database engines. Visualizes query routing, join penalties, and network transfer latency."
    },
    {
      title: "Headless Linux Server Health Monitor",
      description: "Automated shell script suite paired with a client telemetry receiver. Parses real-time socket statistics, disk I/O, process queues, and CPU load averages with automated threshold alerts."
    },
    {
      title: "Enterprise Inventory & Billing Terminal",
      description: "Operational management terminal built for wholesale electrical supplies. Houses an in-memory transactional cart, unit conversion algorithms, dynamic tax calculations, and printable itemized invoices."
    },
    {
      title: "Vanilla Core Engineering Portfolio",
      description: "The current web application. Engineered to demonstrate pure HTML5, CSS Grid, and modular JavaScript without runtime frameworks or bundling dependencies. Focuses on zero-defect keyboard navigation and fast load performance."
    }
  ];

  /* FEATURE 1: Dark / Light Theme Toggle with LocalStorage & OS Sync */
  const initThemeSwitcher = () => {
    const themeBtn = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    if (!themeBtn || !themeIcon) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const savedTheme = localStorage.getItem("preferred-theme") || (mediaQuery.matches ? "light" : "dark");

    document.documentElement.setAttribute("data-theme", savedTheme);
    themeIcon.textContent = savedTheme === "light" ? "🌙" : "☀️";

    themeBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("preferred-theme", nextTheme);
      themeIcon.textContent = nextTheme === "light" ? "🌙" : "☀️";
      showToast(`Switched to ${nextTheme} theme`);
    });

    mediaQuery.addEventListener("change", (e) => {
      if (!localStorage.getItem("preferred-theme")) {
        const sysTheme = e.matches ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", sysTheme);
        themeIcon.textContent = sysTheme === "light" ? "🌙" : "☀️";
      }
    });
  };

  /* FEATURE 2: Accessible Toast Notification System */
  let toastTimeout;
  const showToast = (message) => {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");

    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add("show");

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  };

  /* FEATURE 3: Accessible Mobile Navigation Drawer with Focus Management */
  const initMobileNavigation = () => {
    const menuToggle = document.getElementById("menuToggle");
    const primaryNav = document.getElementById("primaryNav");
    if (!menuToggle || !primaryNav) return;

    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("is-active");
      primaryNav.classList.remove("open");
    };

    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.classList.toggle("is-active");
      primaryNav.classList.toggle("open");
    });

    primaryNav.querySelectorAll(".nav-item").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        !primaryNav.contains(event.target) &&
        !menuToggle.contains(event.target) &&
        primaryNav.classList.contains("open")
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && primaryNav.classList.contains("open")) {
        closeMenu();
        menuToggle.focus();
      }
    });
  };

  /* FEATURE 4: Active Navigation Scroll-Spy (IntersectionObserver) */
  const initScrollSpy = () => {
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-item");
    if (!sections.length || !navItems.length) return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute("id");
          navItems.forEach((link) => {
            if (link.getAttribute("href") === `#${activeId}`) {
              link.classList.add("active");
              link.setAttribute("aria-current", "page");
            } else {
              link.classList.remove("active");
              link.removeAttribute("aria-current");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => spyObserver.observe(sec));
  };

  /* FEATURE 5: Dynamic Animated Stat Counters (Reduced-Motion Aware) */
  const initStatCounters = () => {
    const statCards = document.querySelectorAll(".stat-number");
    if (!statCards.length) return;

    const runCounters = () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      statCards.forEach((counter) => {
        const rawTarget = counter.getAttribute("data-target") || "0";
        const target = parseInt(rawTarget.replace(/\D/g, ""), 10) || 0;

        if (prefersReduced) {
          counter.textContent = target;
          return;
        }

        const duration = 1200;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          counter.textContent = Math.floor(progress * target);

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target;
          }
        };

        requestAnimationFrame(updateCount);
      });
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounters();
          obs.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector(".hero-stats");
    if (statsContainer) counterObserver.observe(statsContainer);
  };

  /* FEATURE 6 & 7: Project Filtering and Debounced Search */
  const applyFilters = () => {
    const activeFilterBtn = document.querySelector(".filter-btn.active");
    const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute("data-filter") : "all";
    const searchInput = document.getElementById("projectSearch");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const projectCards = document.querySelectorAll(".project-card");
    const noResultsMsg = document.getElementById("noResultsMsg");

    let matchCount = 0;

    projectCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const cardKeywords = (card.getAttribute("data-keywords") || "").toLowerCase();
      const cardTitle = (card.querySelector(".project-title")?.textContent || "").toLowerCase();

      const matchesCategory = activeCategory === "all" || cardCategory === activeCategory;
      const matchesSearch = query === "" || cardKeywords.includes(query) || cardTitle.includes(query);

      if (matchesCategory && matchesSearch) {
        card.classList.remove("hidden");
        matchCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    if (noResultsMsg) {
      noResultsMsg.classList.toggle("hidden", matchCount > 0);
    }
  };

  const initProjectFilters = () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("projectSearch");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        if (searchInput) searchInput.value = "";
        applyFilters();
      });
    });
  };

  const initProjectSearch = () => {
    const searchInput = document.getElementById("projectSearch");
    if (!searchInput) return;

    let debounceTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilters, 120);
    });
  };

  /* FEATURE 8: Interactive Modal Dialog (<dialog>) with Focus Management */
  const initProjectModal = () => {
    const modal = document.getElementById("projectModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const closeBtn = document.getElementById("closeModalBtn");
    const triggers = document.querySelectorAll(".modal-trigger");

    if (!modal || !modalTitle || !modalBody || !closeBtn) return;

    let lastActiveTrigger = null;

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        lastActiveTrigger = trigger;
        const projectIndex = trigger.getAttribute("data-project");
        const details = PROJECT_DETAILS[projectIndex];
        if (!details) return;

        modalTitle.textContent = details.title;
        modalBody.textContent = details.description;
        modal.showModal();
      });
    });

    closeBtn.addEventListener("click", () => modal.close());

    // Click outside detection using geometry to prevent false positive closures
    modal.addEventListener("click", (event) => {
      const rect = modal.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInside) modal.close();
    });

    modal.addEventListener("close", () => {
      if (lastActiveTrigger) lastActiveTrigger.focus();
    });
  };

  /* FEATURE 9: Direct Copy-To-Clipboard Engine with Fallback */
  const initClipboardCopy = () => {
    const copyBtn = document.getElementById("copyEmailBtn");
    const emailElem = document.getElementById("emailAddress");
    if (!copyBtn || !emailElem) return;

    copyBtn.addEventListener("click", async () => {
      const email = emailElem.textContent.trim();
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = email;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }
        showToast("Email address copied to clipboard!");
      } catch (err) {
        showToast("Copying failed. Please copy manually.");
      }
    });
  };

  /* FEATURE 10: Client-Side Contact Form Validation & State Clearing */
  const initFormValidation = () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const nameInput = document.getElementById("userName");
    const emailInput = document.getElementById("userEmail");
    const msgInput = document.getElementById("userMessage");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const msgError = document.getElementById("messageError");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    const validateField = (input, errorElem, message, isValid) => {
      if (!input || !errorElem) return false;
      if (!isValid) {
        input.classList.add("invalid");
        errorElem.textContent = message;
        return false;
      }
      input.classList.remove("invalid");
      errorElem.textContent = "";
      return true;
    };

    nameInput?.addEventListener("input", () => {
      validateField(nameInput, nameError, "Name must be at least 2 characters.", nameInput.value.trim().length >= 2);
    });

    emailInput?.addEventListener("input", () => {
      validateField(emailInput, emailError, "Please enter a valid email address.", emailRegex.test(emailInput.value.trim()));
    });

    msgInput?.addEventListener("input", () => {
      validateField(msgInput, msgError, "Message must be at least 10 characters.", msgInput.value.trim().length >= 10);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameError, "Name must be at least 2 characters.", nameInput.value.trim().length >= 2);
      const isEmailValid = validateField(emailInput, emailError, "Please enter a valid email address.", emailRegex.test(emailInput.value.trim()));
      const isMsgValid = validateField(msgInput, msgError, "Message must be at least 10 characters.", msgInput.value.trim().length >= 10);

      if (isNameValid && isEmailValid && isMsgValid) {
        showToast("Message sent successfully! (Front-end simulated)");
        form.reset();
        [nameInput, emailInput, msgInput].forEach((inp) => inp?.classList.remove("invalid"));
        [nameError, emailError, msgError].forEach((err) => { if (err) err.textContent = ""; });
      } else {
        showToast("Please correct the errors in the form.");
      }
    });
  };

  /* ADDITIONAL: Scroll-to-Top Floating Action Button */
  const initScrollToTop = () => {
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (!scrollBtn) return;

    window.addEventListener("scroll", () => {
      scrollBtn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  // Safe Initialization Execution
  initThemeSwitcher();
  initMobileNavigation();
  initScrollSpy();
  initStatCounters();
  initProjectFilters();
  initProjectSearch();
  initProjectModal();
  initClipboardCopy();
  initFormValidation();
  initScrollToTop();
});