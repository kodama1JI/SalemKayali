(function () {
  var root = document.documentElement;
  var titles = {
    en: "Salem Kayali — Food Technology Engineer",
    ar: "سالم كيالي — مهندس تكنولوجيا أغذية"
  };
  var descriptions = {
    en: "Salem Kayali, Food Technology Engineer. QA at Rama Pharma Pharmaceutical Industries.",
    ar: "سالم كيالي، مهندس تكنولوجيا أغذية. ضمان الجودة في شركة راما فارما للصناعات الدوائية."
  };

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function formatYear() {
    var year = document.getElementById("year");
    if (!year) return;
    var current = String(new Date().getFullYear());
    year.textContent = root.lang === "ar"
      ? current.replace(/\d/g, function (digit) { return "٠١٢٣٤٥٦٧٨٩"[digit]; })
      : current;
  }

  function applyLang(lang) {
    var next = lang === "ar" ? "ar" : "en";
    root.lang = next;
    root.dir = next === "ar" ? "rtl" : "ltr";
    document.title = titles[next];
    formatYear();
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", descriptions[next]);
    var group = document.querySelector(".lang-switch");
    if (group) {
      group.setAttribute("aria-label", next === "ar" ? "اللغة" : "Language");
    }
    document.querySelectorAll("[data-set-lang]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-set-lang") === next ? "true" : "false");
    });
    var nav = document.getElementById("site-nav");
    if (nav) nav.setAttribute("aria-label", next === "ar" ? "التنقل" : "Primary");
    storageSet("sk-lang", next);
  }

  function applyTheme(theme) {
    var next = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      var toDark = next === "light";
      toggle.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      toggle.setAttribute("aria-label", root.lang === "ar"
        ? (toDark ? "الوضع الداكن" : "الوضع الفاتح")
        : (toDark ? "Dark theme" : "Light theme"));
    }
    storageSet("sk-theme", next);
  }

  var menu = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    if (!menu || !nav) return;
    nav.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", open ? "true" : "false");
    var openLabel = menu.querySelector(".menu-open-label");
    var closeLabel = menu.querySelector(".menu-close-label");
    if (openLabel) openLabel.hidden = open;
    if (closeLabel) closeLabel.hidden = !open;
  }

  document.querySelectorAll("[data-set-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      applyLang(button.getAttribute("data-set-lang"));
      applyTheme(root.getAttribute("data-theme"));
    });
  });

  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  if (menu) {
    menu.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
  }

  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 800) setMenu(false);
  });

  applyLang(root.lang);
  applyTheme(root.getAttribute("data-theme") || "light");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sections = document.querySelectorAll("main section[id]");
  var revealables = document.querySelectorAll(".reveal");
  var process = document.querySelector(".process");

  function markActive(id) {
    if (!nav) return;
    nav.querySelectorAll("a").forEach(function (link) {
      var on = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", on);
      if (on) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if (reduce) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
    if (process) process.classList.add("is-drawn");
  } else {
    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.18 });

      revealables.forEach(function (el) { revealObserver.observe(el); });

      if (process) {
        var processObserver = new IntersectionObserver(function (entries, observer) {
          if (!entries[0].isIntersecting) return;
          process.classList.add("is-drawn");
          observer.disconnect();
        }, { threshold: 0.15 });
        processObserver.observe(process);
      }

      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) markActive(entry.target.id);
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

      sections.forEach(function (section) { spy.observe(section); });
    } else {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
      if (process) process.classList.add("is-drawn");
    }
  }

  if (reduce && "IntersectionObserver" in window) {
    var reducedSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) markActive(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (section) { reducedSpy.observe(section); });
  }
})();
