/* NadetMC site interactions */
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Year in footer
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = $("#nav-toggle");
  const siteNav = $("#site-nav");
  const navLinks = $$("#nav-list .nav-link");

  function closeNav() {
    if (!siteNav) return;
    siteNav.classList.remove("open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = !siteNav.classList.contains("open");
      siteNav.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
  }

  navLinks.forEach((link) =>
    link.addEventListener("click", () => closeNav())
  );

  // Smooth scrolling for anchor links
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Reveal on scroll
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // Reset menu state on resize
  let lastW = window.innerWidth;
  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const crossedToDesktop = lastW <= 780 && w > 780;
    lastW = w;
    if (crossedToDesktop) closeNav();
  });

  // TikTok embed helper
  function refreshTikTokEmbeds() {
    if (window.tiktokEmbedsProcessed) return;
    if (window.tiktok || window.tiktokEmbeds) {
      try {
        if (window.tiktokEmbeds) window.tiktokEmbeds.load();
        window.tiktokEmbedsProcessed = true;
      } catch (e) {}
      return;
    }
    if (window.tiktok && typeof window.tiktok.load === "function") {
      try {
        window.tiktok.load();
        window.tiktokEmbedsProcessed = true;
      } catch (e) {}
    }
  }
  window.addEventListener("load", () => setTimeout(refreshTikTokEmbeds, 300));

  /* Pixel pop burst on "MC" title */
  const popLayer = document.querySelector("#pop-layer");
  const mcTitle = document.querySelector(".hero .title-hot");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function spawnPixel(x, y) {
    if (!popLayer) return;
    const el = document.createElement("div");
    el.className = "pixel-pop";
    el.style.left = x + "px";
    el.style.top = y + "px";

    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 70;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 30;
    el.style.setProperty("--dx", dx + "px");
    el.style.setProperty("--dy", dy + "px");

    popLayer.appendChild(el);
    const ttl = prefersReducedMotion ? 0 : 800;
    setTimeout(() => el.remove(), ttl);
  }

  function burstAtRect(rect, count = 28) {
    if (!rect) return;
    for (let i = 0; i < count; i++) {
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;
      spawnPixel(x, y);
    }
  }

  if (mcTitle) {
    mcTitle.style.cursor = "pointer";
    mcTitle.setAttribute("title", "Tap for particles");
    mcTitle.addEventListener("click", (e) => {
      e.preventDefault();
      const rect = mcTitle.getBoundingClientRect();
      burstAtRect(rect, 30);
    });
    mcTitle.addEventListener("pointerenter", () => {
      const rect = mcTitle.getBoundingClientRect();
      burstAtRect(rect, 12);
    }, { passive: true });

    window.addEventListener("load", () => {
      setTimeout(() => {
        const rect = mcTitle.getBoundingClientRect();
        burstAtRect(rect, 22);
      }, 500);
    });

    let autoBurstTimer = null;

    function isInViewport(el) {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
    }

    function startAutoBurst() {
      if (prefersReducedMotion || autoBurstTimer || !mcTitle) return;
      autoBurstTimer = setInterval(() => {
        if (!isInViewport(mcTitle)) return;
        const rect = mcTitle.getBoundingClientRect();
        burstAtRect(rect, 16);
        try { console.debug("[pop] auto burst"); } catch (e) {}
      }, 2000);
    }

    function stopAutoBurst() {
      if (autoBurstTimer) {
        clearInterval(autoBurstTimer);
        autoBurstTimer = null;
      }
    }

    if ("IntersectionObserver" in window) {
      const ob = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startAutoBurst();
          else stopAutoBurst();
        });
      }, { threshold: 0.2 });
      ob.observe(mcTitle);
    } else {
      startAutoBurst();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoBurst();
      else startAutoBurst();
    });
  }

  /* Background music autoplay */
  const audio = document.getElementById("bg-audio");
  const audioToggle = document.getElementById("audio-toggle");
  const audioBanner = document.getElementById("audio-banner");
  const enableAudioBtn = document.getElementById("enable-audio");
  const dismissAudioBtn = document.getElementById("dismiss-audio");
  const AUDIO_KEY = "nadetmc.audioConsent";

  function showAudioBanner(show = true) {
    if (audioBanner) audioBanner.hidden = !show;
  }

  function updateAudioToggle() {
    if (!audio || !audioToggle) return;
    const on = !audio.paused;
    audioToggle.textContent = on ? "🔊" : "🔇";
    audioToggle.setAttribute("aria-pressed", on.toString());
  }

  function playAudio() {
    if (!audio) return Promise.resolve();
    return audio.play().catch(() => {});
  }

  function pauseAudio() {
    if (!audio) return;
    audio.pause();
  }

  if (audioToggle) {
    audioToggle.addEventListener("click", () => {
      if (!audio) return;
      if (audio.paused) {
        playAudio();
        localStorage.setItem(AUDIO_KEY, "true");
        updateAudioToggle();
      } else {
        pauseAudio();
        localStorage.setItem(AUDIO_KEY, "false");
        updateAudioToggle();
      }
    });
  }

  if (enableAudioBtn) {
    enableAudioBtn.addEventListener("click", () => {
      playAudio();
      localStorage.setItem(AUDIO_KEY, "true");
      updateAudioToggle();
      showAudioBanner(false);
    });
  }

  if (dismissAudioBtn) {
    dismissAudioBtn.addEventListener("click", () => {
      localStorage.setItem(AUDIO_KEY, "false");
      showAudioBanner(false);
    });
  }

  window.addEventListener("load", () => {
    const consent = localStorage.getItem(AUDIO_KEY);
    if (consent === null) {
      // First visit: show prompt explicitly
      showAudioBanner(true);
      updateAudioToggle();
    } else if (consent === "true") {
      // Try to autoplay; if blocked by the browser (especially on mobile), re-prompt
      playAudio().finally(() => {
        setTimeout(() => {
          if (audio && audio.paused) {
            showAudioBanner(true);
          }
          updateAudioToggle();
        }, 250);
      });
    } else {
      // consent "false": do not autoplay
      pauseAudio();
      updateAudioToggle();
    }
  });

  // If returning to the tab and autoplay is blocked, re-prompt
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && localStorage.getItem(AUDIO_KEY) === "true") {
      if (audio && audio.paused) {
        showAudioBanner(true);
        updateAudioToggle();
      }
    }
  });
})();
