(() => {
  const header = document.getElementById("site-header");
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  document.querySelector("[data-scroll-down]")?.addEventListener("click", () => {
    window.scrollTo({ top: Math.round(window.innerHeight * 0.94), behavior: "smooth" });
  });

  document.querySelectorAll("[data-faq]").forEach((item) => {
    item.addEventListener("click", () => {
      const panel = item.querySelector("[data-faq-panel]");
      const plus = item.querySelector("[data-faq-plus]");
      const open = panel.classList.contains("is-open");
      panel.classList.toggle("is-open", !open);
      plus.classList.toggle("is-open", !open);
    });
  });

  const fmt = (n) => n.toLocaleString("ru-RU").replace(/\u00a0/g, " ");
  let statsDone = false;
  const animateStats = () => {
    if (statsDone) return;
    statsDone = true;
    const els = [...document.querySelectorAll("[data-stat-target]")];
    const start = performance.now();
    const duration = 1500;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      els.forEach((el) => {
        el.textContent = fmt(Math.round(Number(el.dataset.statTarget) * eased)) + "+";
      });
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const stats = document.getElementById("stats");
  if (stats && "IntersectionObserver" in window) {
    new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animateStats();
        observer.disconnect();
      }
    }, { threshold: 0.35 }).observe(stats);
  } else {
    animateStats();
  }

  const subEmail = document.querySelector("[data-subscribe-email]");
  document.querySelector("[data-subscribe-submit]")?.addEventListener("click", () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(subEmail.value)) {
      subEmail.classList.add("is-invalid");
      return;
    }
    document.querySelector("[data-subscribe-form]").classList.add("is-hidden");
    document.querySelector("[data-subscribe-done]").classList.add("is-inline-flex");
  });
  subEmail?.addEventListener("input", () => subEmail.classList.remove("is-invalid"));

  const roleToggle = document.querySelector("[data-role-toggle]");
  const roleMenu = document.querySelector("[data-role-menu]");
  const roleLabel = document.querySelector("[data-role-label]");
  const roleChevron = document.querySelector("[data-role-chevron]");
  roleToggle?.addEventListener("click", () => {
    const open = roleMenu.classList.contains("is-open");
    roleMenu.classList.toggle("is-open", !open);
    roleChevron.classList.toggle("is-open", !open);
  });
  document.querySelectorAll("[data-role-option]").forEach((option) => {
    option.addEventListener("click", () => {
      roleLabel.textContent = option.dataset.roleOption;
      roleToggle.classList.add("is-selected");
      roleMenu.classList.remove("is-open");
      roleChevron.classList.remove("is-open");
    });
  });

  document.querySelector("[data-contact-submit]")?.addEventListener("click", () => {
    const name = document.querySelector("[data-contact-name]");
    const phone = document.querySelector("[data-contact-phone]");
    const note = document.querySelector("[data-contact-note]");
    if (!name.value.trim() || !phone.value.trim()) {
      note.textContent = "Заполните имя и телефон";
      note.classList.add("is-error");
      return;
    }
    document.querySelector("[data-contact-form]").classList.add("is-hidden");
    document.querySelector("[data-contact-done]").classList.add("is-flex");
  });
})();
