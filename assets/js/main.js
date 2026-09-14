/* Times Bridge US, shared site behavior */
(function () {
  const body = document.body;
  const toggle = document.querySelector("[data-menu-toggle]");
  const header = document.querySelector(".site-header");
  const headerInner = document.querySelector(".header-inner");
  const brand = document.querySelector(".brand");
  const nav = document.querySelector(".nav-desktop");
  const overlayLinks = document.querySelectorAll(".overlay-nav a");

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    const overlay = document.querySelector(".overlay-nav");
    if (overlay) overlay.setAttribute("aria-hidden", open ? "false" : "true");
  }

  /** Inline nav when it fits; hamburger only when space is tight */
  function updateNavMode() {
    if (!headerInner || !brand || !nav) return;

    // Measure with inline nav visible
    body.classList.remove("nav-compact");
    setMenu(false);

    // Force layout with nav shown
    void nav.offsetWidth;

    const styles = getComputedStyle(headerInner);
    const gap =
      parseFloat(styles.columnGap || styles.gap) || 24;
    const brandW = brand.getBoundingClientRect().width;
    const navW = nav.scrollWidth;
    const available = headerInner.clientWidth;
    const needsHamburger = brandW + navW + gap > available + 1;

    if (needsHamburger) {
      body.classList.add("nav-compact");
    }
  }

  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateNavMode, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateNavMode);
  } else {
    updateNavMode();
  }
  window.addEventListener("resize", onResize);
  window.addEventListener("load", updateNavMode);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateNavMode).catch(() => {});
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      setMenu(!body.classList.contains("menu-open"));
    });
  }

  overlayLinks.forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // Team bios
  const teamCards = document.querySelectorAll("[data-team]");
  const teamPanel = document.querySelector("[data-team-panel]");
  if (teamCards.length && teamPanel) {
    teamCards.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-team");
        const bio = document.getElementById("bio-" + id);
        teamCards.forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        if (bio) {
          teamPanel.innerHTML = bio.innerHTML;
          teamPanel.classList.add("open");
          teamPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    });
    // open first
    teamCards[0].click();
  }

  // Newsletter / contact forms
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const success = form.querySelector(".form-success");
      if (success) success.classList.add("show");
      form.reset();
    });
  });

  // Careers filter
  const search = document.querySelector("[data-job-search]");
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll("[data-job-item]").forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = !q || text.includes(q) ? "" : "none";
      });
    });
  }

  // Active nav
  const path = location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    try {
      const u = new URL(href, location.origin);
      let p = u.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
      if (p === path) a.classList.add("active");
    } catch (_) {}
  });

  // Typewriter cycle (culture / communication / capital)
  function TxtType(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = "";
    this.isDeleting = false;
    this.tick();
  }

  TxtType.prototype.tick = function () {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

    const that = this;
    let delta = 200 - Math.random() * 100;
    if (this.isDeleting) delta /= 2;

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(function () {
      that.tick();
    }, delta);
  };

  document.querySelectorAll(".typewrite").forEach((el) => {
    const toRotate = el.getAttribute("data-type");
    const period = el.getAttribute("data-period");
    if (!toRotate) return;
    try {
      new TxtType(el, JSON.parse(toRotate), period);
    } catch (_) {}
  });

  // Portfolio partner story modals
  let activePartnerModal = null;

  function closePartnerModal() {
    if (!activePartnerModal) return;
    activePartnerModal.hidden = true;
    activePartnerModal = null;
    body.classList.remove("partner-modal-open");
  }

  function openPartnerModal(id) {
    const modal = document.getElementById("partner-" + id);
    if (!modal) return;
    closePartnerModal();
    modal.hidden = false;
    activePartnerModal = modal;
    body.classList.add("partner-modal-open");
    const closeBtn = modal.querySelector(".partner-modal-close");
    if (closeBtn) closeBtn.focus();
  }

  document.querySelectorAll("[data-partner-open]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openPartnerModal(btn.getAttribute("data-partner-open"));
    });
  });

  document.querySelectorAll("[data-partner-close]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      closePartnerModal();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePartnerModal();
  });
})();
