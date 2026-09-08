(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navToggleLabel = navToggle?.querySelector(".sr-only");
  const quoteForm = document.querySelector("[data-quote-form]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-current-year]").forEach((year) => {
    year.textContent = new Date().getFullYear();
  });

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeMenu = () => {
    if (!nav || !navToggle) return;

    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    if (navToggleLabel) navToggleLabel.textContent = "Open menu";
  };

  const openMenu = () => {
    if (!nav || !navToggle) return;

    nav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
    if (navToggleLabel) navToggleLabel.textContent = "Close menu";
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  const revealElements = [...document.querySelectorAll("[data-reveal]")];
  const initiallyVisible = revealElements.filter((element) => {
    return element.getBoundingClientRect().top < window.innerHeight * 0.95;
  });

  initiallyVisible.forEach((element) => element.classList.add("is-visible"));
  document.documentElement.classList.add("reveal-ready");

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 }
    );

    revealElements
      .filter((element) => !element.classList.contains("is-visible"))
      .forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')]
    .filter((link) => link.getAttribute("href") !== "#quote");
  const linkedSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && linkedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          sectionLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: "-28% 0px -64%", threshold: 0 }
    );

    linkedSections.forEach((section) => sectionObserver.observe(section));
  }

  quoteForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) return;

    const formData = new FormData(quoteForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const requirement = String(formData.get("requirement") || "").trim();
    const details = String(formData.get("details") || "").trim();
    const message = [
      "Hello Lakshmi Pooja Packings, I'd like a quote.",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Requirement: ${requirement}`,
      details ? `Details: ${details}` : "Details: To be discussed"
    ].join("\n");
    const whatsappUrl = `https://wa.me/919791765445?text=${encodeURIComponent(message)}`;
    const enquiryWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    if (!enquiryWindow) window.location.href = whatsappUrl;
  });
})();
