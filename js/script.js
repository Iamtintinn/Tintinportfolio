(function () {
  var motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  var links = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
  var sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  if (motionOk && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll("[data-reveal]").forEach(function (section) {
      revealObserver.observe(section);
    });
  }

  var themeBtn = document.querySelector("[data-theme-toggle]");

  function applyTheme(day, persist) {
    if (day) document.documentElement.setAttribute("data-theme", "day");
    else document.documentElement.removeAttribute("data-theme");
    if (persist) {
      try { localStorage.setItem("theme-choice", day ? "day" : "night"); } catch (error) {}
    }
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", day ? "true" : "false");
      themeBtn.setAttribute("aria-label", day ? "Switch to night mode" : "Switch to day mode");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", day ? "#ffffff" : "#111214");
  }

  if (themeBtn) {
    applyTheme(document.documentElement.getAttribute("data-theme") === "day", false);
    themeBtn.addEventListener("click", function () {
      applyTheme(document.documentElement.getAttribute("data-theme") !== "day", true);
    });
  }

  var terminal = document.querySelector("[data-terminal]");
  if (terminal && motionOk) {
    var line = terminal.querySelector(".terminal-text");
    var frame = terminal.closest(".portrait-frame");
    if (line && frame) {
      frame.addEventListener("mouseenter", function () {
        line.textContent = "status: ready";
      });
      frame.addEventListener("mouseleave", function () {
        line.textContent = "role: web developer";
      });
    }
  }
})();
