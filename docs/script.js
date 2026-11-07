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

    // Update language button text to reflect CURRENT active language
    const toggleBtns = document.querySelectorAll('.lang-switch-btn');
    toggleBtns.forEach((btn) => {
      const label = btn.querySelector('.lang-btn-label');
      if (label) {
        label.textContent = lang === 'zh' ? '繁體中文' : 'English';
      }
      btn.setAttribute(
        'title',
        lang === 'zh' ? '語言：繁體中文 (點擊展開選單)' : 'Language: English (Click to open menu)'
      );
      btn.setAttribute(
        'aria-label',
        lang === 'zh' ? '語言：繁體中文。點擊展開語言選單' : 'Language: English. Click to open language menu'
      );
    });

    // Update active checkmarks in language dropdown menu
    const menuItems = document.querySelectorAll('.lang-menu-item');
    menuItems.forEach((item) => {
      const itemVal = item.getAttribute('data-lang-value');
      const isActive = itemVal === lang;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    // Update html lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';

    // Synchronize ?lang= URL param if it was present
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }
  }

  function closeAllLangDropdowns() {
    document.querySelectorAll('.lang-dropdown-container.open').forEach((container) => {
      container.classList.remove('open');
      const btn = container.querySelector('.lang-switch-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleLangDropdown(container) {
    const isOpen = container.classList.contains('open');
    closeAllThemeDropdowns();
    closeAllLangDropdowns();
    if (!isOpen) {
      container.classList.add('open');
      const btn = container.querySelector('.lang-switch-btn');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
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
    closeAllLangDropdowns();
    if (!isOpen) {
      container.classList.add('open');
      const btn = container.querySelector('.theme-switch-btn');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  /* ==================== Navigation Active Link ==================== */
  /* ==================== Navigation Active Link ==================== */
  function highlightActiveNav() {
    const rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentPath = rawPath.endsWith('.html') ? rawPath : 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === 'index.html' && (href === '' || href === './' || href === 'index.html')))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ==================== Site Header Web Component ==================== */
  function getHeaderTemplate() {
    return `
    <header class="site-header">
      <div class="header-container">
        <a href="index.html" class="brand-wrapper">
          <div class="brand-logo-icon">📖</div>
          <div class="brand-meta">
            <span class="brand-name">Bible On Air</span>
            <span class="brand-sub">
              <span class="lang-zh">新竹北門聖教會</span>
              <span class="lang-en">Northgate Holiness Christian Church</span>
            </span>
          </div>
        </a>

        <nav>
          <ul class="nav-links">
            <li>
              <a href="index.html" class="nav-link">
                <span class="lang-zh">首頁</span>
                <span class="lang-en">Home</span>
              </a>
            </li>
            <li>
              <a href="privacy.html" class="nav-link">
                <span class="lang-zh">隱私權政策</span>
                <span class="lang-en">Privacy Policy</span>
              </a>
            </li>
            <li>
              <a href="terms.html" class="nav-link">
                <span class="lang-zh">服務條款</span>
                <span class="lang-en">Terms of Use</span>
              </a>
            </li>
            <li>
              <a href="faq.html" class="nav-link">
                <span class="lang-zh">常見問題</span>
                <span class="lang-en">FAQ</span>
              </a>
            </li>
            <li class="theme-dropdown-container">
              <button type="button" class="theme-switch-btn" aria-haspopup="true" aria-expanded="false" title="外觀：跟隨系統 (點擊展開選單)">
                <span class="theme-icon">💻</span>
                <span class="theme-label-zh lang-zh">系統</span>
                <span class="theme-label-en lang-en">System</span>
                <span class="dropdown-arrow">▾</span>
              </button>
              <div class="theme-dropdown-menu" role="menu">
                <button type="button" class="theme-menu-item active" data-theme-value="system" role="menuitem">
                  <span class="theme-menu-item-left">
                    <span class="menu-icon">💻</span>
                    <span class="menu-label">
                      <span class="lang-zh">跟隨系統</span>
                      <span class="lang-en">System Default</span>
                    </span>
                  </span>
                  <span class="menu-check">✓</span>
                </button>
                <button type="button" class="theme-menu-item" data-theme-value="light" role="menuitem">
                  <span class="theme-menu-item-left">
                    <span class="menu-icon">☀️</span>
                    <span class="menu-label">
                      <span class="lang-zh">淺色模式</span>
                      <span class="lang-en">Light Mode</span>
                    </span>
                  </span>
                  <span class="menu-check">✓</span>
                </button>
                <button type="button" class="theme-menu-item" data-theme-value="dark" role="menuitem">
                  <span class="theme-menu-item-left">
                    <span class="menu-icon">🌙</span>
                    <span class="menu-label">
                      <span class="lang-zh">深色模式</span>
                      <span class="lang-en">Dark Mode</span>
                    </span>
                  </span>
                  <span class="menu-check">✓</span>
                </button>
              </div>
            </li>
            <li class="lang-dropdown-container">
              <button
                type="button"
                class="lang-switch-btn"
                aria-haspopup="true"
                aria-expanded="false"
                title="語言：繁體中文 (點擊展開選單)"
              >
                <span class="lang-icon">🌐</span>
                <span class="lang-btn-label">繁體中文</span>
                <span class="dropdown-arrow">▾</span>
              </button>
              <div class="lang-dropdown-menu" role="menu">
                <button type="button" class="lang-menu-item active" data-lang-value="zh" role="menuitem">
                  <span class="lang-menu-item-left">
                    <span class="menu-label">繁體中文</span>
                  </span>
                  <span class="menu-check">✓</span>
                </button>
                <button type="button" class="lang-menu-item" data-lang-value="en" role="menuitem">
                  <span class="lang-menu-item-left">
                    <span class="menu-label">English</span>
                  </span>
                  <span class="menu-check">✓</span>
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    `;
  }

  function initHeaderControls(scope = document) {
    const currentLang = document.documentElement.getAttribute('data-lang') || getInitialLang();
    const currentTheme = document.documentElement.getAttribute('data-theme') || getInitialTheme();

    setLanguage(currentLang);
    setTheme(currentTheme);
    highlightActiveNav();

    // Bind language dropdown
    const langContainers = scope.querySelectorAll('.lang-dropdown-container');
    langContainers.forEach((container) => {
      if (container.dataset.bound === 'true') return;
      container.dataset.bound = 'true';

      const triggerBtn = container.querySelector('.lang-switch-btn');
      if (triggerBtn) {
        triggerBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleLangDropdown(container);
        });
      }

      const items = container.querySelectorAll('.lang-menu-item');
      items.forEach((item) => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const selectedLang = item.getAttribute('data-lang-value');
          if (selectedLang) {
            setLanguage(selectedLang);
          }
          closeAllLangDropdowns();
        });
      });
    });

    // Bind theme dropdown
    const themeContainers = scope.querySelectorAll('.theme-dropdown-container');
    themeContainers.forEach((container) => {
      if (container.dataset.bound === 'true') return;
      container.dataset.bound = 'true';

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
  }

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = getHeaderTemplate();
      initHeaderControls(this);
    }
  }

  if (typeof customElements !== 'undefined' && !customElements.get('site-header')) {
    customElements.define('site-header', SiteHeader);
  }

  /* ==================== Initialize ==================== */
  // Execute theme & language immediately to prevent flashing before DOMContentLoaded
  const initialTheme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);
  const initialLang = getInitialLang();
  document.documentElement.setAttribute('data-lang', initialLang);
  document.documentElement.lang = initialLang === 'zh' ? 'zh-TW' : 'en';

  document.addEventListener('DOMContentLoaded', () => {
    initHeaderControls(document);

    // Close dropdowns on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.theme-dropdown-container')) {
        closeAllThemeDropdowns();
      }
      if (!e.target.closest('.lang-dropdown-container')) {
        closeAllLangDropdowns();
      }
    });

    // Close dropdowns on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllThemeDropdowns();
        closeAllLangDropdowns();
      }
    });

    // Listen to system theme changes when in 'system' mode
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
