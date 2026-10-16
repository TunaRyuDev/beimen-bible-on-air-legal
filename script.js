/**
 * Bible On Air - publicWeb script
 * Supports:
 * 1. Instant bilingual language toggle (zh / en)
 * 2. 3-state Theme toggle (System / Light / Dark) with localStorage persistence
 * 3. Active navigation link highlighting
 */

(function () {
  const LANG_STORAGE_KEY = 'boa_preferred_lang';
  const THEME_STORAGE_KEY = 'boa_preferred_theme';

  /* ==================== Language Management ==================== */
  function getInitialLang() {
    // 1. URL search params takes highest priority (e.g. ?lang=en for App Store reviewer)
    const urlParams = new URLSearchParams(window.location.search);
    const paramLang = urlParams.get('lang');
    if (paramLang && (paramLang === 'en' || paramLang === 'zh')) {
      return paramLang;
    }

    // 2. Local storage
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && (saved === 'en' || saved === 'zh')) {
      return saved;
    }

    // 3. Browser language fallback
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('en')) {
      return 'en';
    }

    // Default to Traditional Chinese
    return 'zh';
  }

  function setLanguage(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);

    // Update language button text
    const toggleBtns = document.querySelectorAll('.lang-switch-btn');
    toggleBtns.forEach((btn) => {
      const label = btn.querySelector('.lang-label');
      if (label) {
        label.textContent = lang === 'zh' ? 'EN / English' : '中文 (繁體)';
      }
    });

    // Update html lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
  }

  function toggleLanguage() {
    const current = document.documentElement.getAttribute('data-lang') || 'zh';
    const next = current === 'zh' ? 'en' : 'zh';
    setLanguage(next);
  }

  /* ==================== Theme Management ==================== */
  // 3 modes: 'system', 'light', 'dark'
  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && (saved === 'dark' || saved === 'light' || saved === 'system')) {
      return saved;
    }
    return 'system';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Update theme toggle buttons UI to reflect CURRENT active theme
    const themeBtns = document.querySelectorAll('.theme-switch-btn');
    themeBtns.forEach((btn) => {
      const icon = btn.querySelector('.theme-icon');
      const labelZh = btn.querySelector('.theme-label-zh');
      const labelEn = btn.querySelector('.theme-label-en');

      if (theme === 'system') {
        if (icon) icon.textContent = '💻';
        if (labelZh) labelZh.textContent = '系統';
        if (labelEn) labelEn.textContent = 'System';
        btn.setAttribute('title', '外觀：跟隨系統 (點擊展開選單)');
        btn.setAttribute('aria-label', 'Theme: System. Click to open theme menu');
      } else if (theme === 'light') {
        if (icon) icon.textContent = '☀️';
        if (labelZh) labelZh.textContent = '淺色';
        if (labelEn) labelEn.textContent = 'Light';
        btn.setAttribute('title', '外觀：淺色模式 (點擊展開選單)');
        btn.setAttribute('aria-label', 'Theme: Light. Click to open theme menu');
      } else if (theme === 'dark') {
        if (icon) icon.textContent = '🌙';
        if (labelZh) labelZh.textContent = '深色';
        if (labelEn) labelEn.textContent = 'Dark';
        btn.setAttribute('title', '外觀：深色模式 (點擊展開選單)');
        btn.setAttribute('aria-label', 'Theme: Dark. Click to open theme menu');
      }
    });

    // Update active state in dropdown menus
    const menuItems = document.querySelectorAll('.theme-menu-item');
    menuItems.forEach((item) => {
      const itemVal = item.getAttribute('data-theme-value');
      const isActive = itemVal === theme;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }

  function closeAllThemeDropdowns() {
    document.querySelectorAll('.theme-dropdown-container.open').forEach((container) => {
      container.classList.remove('open');
      const btn = container.querySelector('.theme-switch-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleThemeDropdown(container) {
    const isOpen = container.classList.contains('open');
    closeAllThemeDropdowns();
    if (!isOpen) {
      container.classList.add('open');
      const btn = container.querySelector('.theme-switch-btn');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  /* ==================== Navigation Active Link ==================== */
  function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ==================== Initialize ==================== */
  // Execute theme immediately to prevent flashing before DOMContentLoaded
  const initialTheme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Language init
    const initialLang = getInitialLang();
    setLanguage(initialLang);

    // 2. Theme UI update
    setTheme(initialTheme);

    // 3. Bind language toggle
    const langBtns = document.querySelectorAll('.lang-switch-btn');
    langBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleLanguage();
      });
    });

    // 4. Bind theme dropdown & options
    const dropdownContainers = document.querySelectorAll('.theme-dropdown-container');
    dropdownContainers.forEach((container) => {
      const triggerBtn = container.querySelector('.theme-switch-btn');
      if (triggerBtn) {
        triggerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleThemeDropdown(container);
        });
      }

      const items = container.querySelectorAll('.theme-menu-item');
      items.forEach((item) => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const selectedTheme = item.getAttribute('data-theme-value');
          if (selectedTheme) {
            setTheme(selectedTheme);
          }
          closeAllThemeDropdowns();
        });
      });
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.theme-dropdown-container')) {
        closeAllThemeDropdowns();
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllThemeDropdowns();
      }
    });

    // 5. Active nav link
    highlightActiveNav();

    // 6. Listen to system theme changes when in 'system' mode
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const currentPref = localStorage.getItem(THEME_STORAGE_KEY) || 'system';
        if (currentPref === 'system') {
          setTheme('system');
        }
      });
    }
  });
})();
