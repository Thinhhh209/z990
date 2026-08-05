/**
 * main.js — Toàn bộ hành vi của trang cá nhân.
 * Dữ liệu hiển thị luôn lấy qua data.js (loadProfile()) — không có thông tin
 * cá nhân nào được viết cứng ở đây.
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     LOADING SCREEN
     --------------------------------------------------------------------- */
  const loadingScreen = document.getElementById("loading-screen");
  let loadingHidden = false;
  const forceHideTimer = setTimeout(hideLoadingScreen, 4000); // an toàn: không bao giờ kẹt màn hình loading

  function hideLoadingScreen() {
    if (loadingHidden) return;
    loadingHidden = true;
    clearTimeout(forceHideTimer);
    loadingScreen.classList.add("is-hidden");
  }

  function initLoaderInteractivity() {
    const logo = document.getElementById("loader-logo");
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isDesktop || prefersReducedMotion) return;

    function handleMove(e) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const rx = ((e.clientY / h) - 0.5) * -22;
      const ry = ((e.clientX / w) - 0.5) * 22;
      logo.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    }

    window.addEventListener("mousemove", handleMove);
    // Ngưng lắng nghe khi màn hình loading đã ẩn để đỡ tốn tài nguyên
    const stopWatcher = setInterval(() => {
      if (loadingHidden) {
        window.removeEventListener("mousemove", handleMove);
        clearInterval(stopWatcher);
      }
    }, 500);
  }

  /* ---------------------------------------------------------------------
     DARK / LIGHT MODE
     --------------------------------------------------------------------- */
  const THEME_KEY = "portfolio_theme";

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (systemDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);

    document.getElementById("theme-toggle").addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------------------------------------------------------------------
     NỀN PARTICLE NHẸ NHÀNG
     --------------------------------------------------------------------- */
  function initParticles() {
    const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 22000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22
      });
    }

    function currentColor() {
      return document.documentElement.getAttribute("data-theme") === "dark"
        ? "237, 239, 245"
        : "27, 30, 41";
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const rgb = currentColor();
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, 0.32)`;
        ctx.fill();
      });
      if (!prefersReducedMotion) requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------------------------------------------------------------------
     NAV: sticky border, mobile menu, active-link, smooth close-on-click
     --------------------------------------------------------------------- */
  function setupNav() {
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 8);
    });

    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
      });
    });
  }

  function setupActiveNavObserver() {
    const links = Array.from(document.querySelectorAll(".nav-links a"));
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------------------------------------------------------------------
     FADE-IN KHI CUỘN TỚI
     --------------------------------------------------------------------- */
  function setupRevealObserver() {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------------------
     THANH KỸ NĂNG: chạy khi cuộn tới
     --------------------------------------------------------------------- */
  function setupSkillBarObserver() {
    const bars = document.querySelectorAll(".skill-bar-fill");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.level + "%";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------------------
     HIỆU ỨNG GÕ CHỮ TYPING
     --------------------------------------------------------------------- */
  function typeText(el, text, speed) {
    return new Promise((resolve) => {
      if (prefersReducedMotion) {
        el.textContent = text;
        resolve();
        return;
      }
      let i = 0;
      el.textContent = "";
      (function step() {
        el.textContent = text.slice(0, i);
        i++;
        if (i <= text.length) {
          setTimeout(step, speed);
        } else {
          resolve();
        }
      })();
    });
  }

  /* ---------------------------------------------------------------------
     HIỆU ỨNG "BUNG HOA" KHI BẤM VÀO THẺ THÔNG TIN
     --------------------------------------------------------------------- */
  const PETAL_COLORS = ["var(--color-primary)", "var(--color-secondary)", "var(--color-gold)"];

  function burstPetals(x, y) {
    if (prefersReducedMotion) return;
    const petalCount = 10;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      const angle = (Math.PI * 2 * i) / petalCount + Math.random() * 0.4;
      const distance = 60 + Math.random() * 50;
      petal.style.left = x + "px";
      petal.style.top = y + "px";
      petal.style.setProperty("--petal-x", Math.cos(angle) * distance + "px");
      petal.style.setProperty("--petal-y", Math.sin(angle) * distance + "px");
      petal.style.setProperty("--petal-rot", Math.random() * 360 + "deg");
      petal.style.background = PETAL_COLORS[i % PETAL_COLORS.length];
      document.body.appendChild(petal);
      petal.addEventListener("animationend", () => petal.remove());
    }
  }

  function attachCardBurst(card) {
    card.addEventListener("click", (e) => burstPetals(e.clientX, e.clientY));
  }

  /* ---------------------------------------------------------------------
     NHẠC NỀN
     --------------------------------------------------------------------- */
  function setupMusic() {
    const btn = document.getElementById("music-toggle");
    const audio = document.getElementById("bg-music");
    let playing = false;

    btn.addEventListener("click", () => {
      if (!playing) {
        audio.play()
          .then(() => {
            playing = true;
            btn.classList.add("is-playing");
          })
          .catch(() => {
            console.warn("Không phát được nhạc — kiểm tra file assets/music/theme.mp3 (xem README).");
          });
      } else {
        audio.pause();
        playing = false;
        btn.classList.remove("is-playing");
      }
    });
  }

  /* ---------------------------------------------------------------------
     ICON DÙNG CHUNG
     --------------------------------------------------------------------- */
  const INFO_ICONS = {
    birthday: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8V4m0 0c-1 0-2-.6-2-1.5S11 1 12 1s2 .6 2 1.5S13 4 12 4z"/></svg>',
    job: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    hobbies: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>'
  };

  const SOCIAL_META = {
    facebook: { label: "Facebook", short: "Fb" },
    zalo: { label: "Zalo", short: "Za" },
    tiktok: { label: "TikTok", short: "Tt" },
    instagram: { label: "Instagram", short: "Ig" },
    youtube: { label: "YouTube", short: "Yt" },
    github: { label: "GitHub", short: "Gh" },
    email: { label: "Email", short: "@" }
  };

  function socialHref(key, value) {
    if (key === "email" && value.includes("@") && !/^https?:\/\//.test(value)) {
      return "mailto:" + value;
    }
    return value;
  }

  function buildSocialLink(key, value) {
    if (!value) return null;
    const meta = SOCIAL_META[key];
    if (!meta) return null;
    const a = document.createElement("a");
    a.href = socialHref(key, value);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "icon-btn";
    a.title = meta.label;
    a.setAttribute("aria-label", meta.label);
    a.innerHTML = `<span style="font-family:var(--font-mono);font-size:0.72rem;font-weight:700;">${meta.short}</span>`;
    return a;
  }

  function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }

  /* ---------------------------------------------------------------------
     RENDER TOÀN BỘ DỮ LIỆU LÊN TRANG
     --------------------------------------------------------------------- */
  async function renderProfile(profile) {
    document.title = profile.name ? `${profile.name} — Trang cá nhân` : "Trang cá nhân";

    // Nav
    document.getElementById("nav-name").textContent = profile.name || "Trang cá nhân";

    // Hero
    document.getElementById("hero-bio").textContent = profile.bio || "";
    const avatarFrame = document.getElementById("avatar-frame");
    if (profile.avatar) {
      avatarFrame.innerHTML = `<img src="${escapeHtml(profile.avatar)}" alt="${escapeHtml(profile.name)}" />`;
    } else {
      document.getElementById("avatar-initials").textContent = getInitials(profile.name);
    }

    const heroSocialsEl = document.getElementById("hero-socials");
    Object.entries(profile.socials || {}).forEach(([key, value]) => {
      const link = buildSocialLink(key, value);
      if (link) heroSocialsEl.appendChild(link);
    });

    // Info cards
    const infoGrid = document.getElementById("info-grid");
    const infoItems = [
      { key: "birthday", label: "Ngày sinh", value: profile.birthday },
      { key: "job", label: "Nghề nghiệp", value: profile.job },
      { key: "location", label: "Địa điểm", value: profile.location }
    ].filter((item) => item.value);

    infoItems.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "info-card reveal";
      card.style.transitionDelay = `${i * 80}ms`;
      card.innerHTML = `
        <div class="info-card-icon">${INFO_ICONS[item.key]}</div>
        <div class="info-card-label">${item.label}</div>
        <div class="info-card-value">${escapeHtml(item.value)}</div>
      `;
      attachCardBurst(card);
      infoGrid.appendChild(card);
    });

    if (profile.hobbies && profile.hobbies.length) {
      const card = document.createElement("div");
      card.className = "info-card reveal";
      card.style.transitionDelay = `${infoItems.length * 80}ms`;
      card.innerHTML = `
        <div class="info-card-icon">${INFO_ICONS.hobbies}</div>
        <div class="info-card-label">Sở thích</div>
        <div class="info-card-tags">
          ${profile.hobbies.map((h) => `<span class="tag-chip">${escapeHtml(h)}</span>`).join("")}
        </div>
      `;
      attachCardBurst(card);
      infoGrid.appendChild(card);
    }

    // Skills
    const skillsGrid = document.getElementById("skills-grid");
    (profile.skills || []).forEach((skill, i) => {
      const row = document.createElement("div");
      row.className = "skill-row reveal";
      row.style.transitionDelay = `${i * 70}ms`;
      row.innerHTML = `
        <div class="skill-row-top">
          <span>${escapeHtml(skill.name)}</span>
          <span>${skill.level}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" data-level="${skill.level}"></div>
        </div>
      `;
      skillsGrid.appendChild(row);
    });

    // Projects
    const projectsGrid = document.getElementById("projects-grid");
    (profile.projects || []).forEach((project, i) => {
      const card = document.createElement("div");
      card.className = "project-card reveal";
      card.style.transitionDelay = `${i * 90}ms`;
      const thumb = project.image
        ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.name)}" />`
        : escapeHtml(getInitials(project.name || "?"));
      card.innerHTML = `
        <div class="project-thumb">${thumb}</div>
        <div class="project-body">
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(project.description)}</p>
          ${project.link ? `<a class="project-link" href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer">Xem dự án →</a>` : ""}
        </div>
      `;
      projectsGrid.appendChild(card);
    });

    // Achievements
    const achievementList = document.getElementById("achievement-list");
    (profile.achievements || []).forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "achievement-item reveal";
      row.style.transitionDelay = `${i * 80}ms`;
      row.innerHTML = `
        <div class="achievement-year">${escapeHtml(item.year)}</div>
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </div>
      `;
      achievementList.appendChild(row);
    });

    // Contact / social row lớn
    const socialRow = document.getElementById("social-row");
    Object.entries(profile.socials || {}).forEach(([key, value]) => {
      const link = buildSocialLink(key, value);
      if (link) socialRow.appendChild(link);
    });

    // Footer
    const year = new Date().getFullYear();
    document.getElementById("footer-text").textContent = `© ${year} ${profile.name || ""} — Phiên bản 1.0`;

    // Typing effect + subtitle fade-in
    const typingEl = document.getElementById("typing-line");
    await typeText(typingEl, `Tôi là ${profile.name || "..."}`, 65);
    const subtitle = document.getElementById("hero-subtitle");
    subtitle.textContent = profile.title || "";
    requestAnimationFrame(() => subtitle.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------------------
     KHỞI CHẠY
     --------------------------------------------------------------------- */
  async function init() {
    initTheme();
    initParticles();
    initLoaderInteractivity();
    setupNav();
    setupMusic();

    let profile = null;
    try {
      profile = await loadProfile();
    } catch (err) {
      console.error("Không tải được dữ liệu cá nhân:", err);
    }

    if (profile) {
      await renderProfile(profile);
    }

    setupRevealObserver();
    setupActiveNavObserver();
    setupSkillBarObserver();
    hideLoadingScreen();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
