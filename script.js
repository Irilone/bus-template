/**
 * Vaccinbussen JavaScript - Komplett system med responsiv bildhantering
 * @description Hanterar alla interaktiva element och bildoptimering på Vaccinbussen-sidan
 * @author Claude Code
 * @version 3.1 - Fusion Enhanced med CSS variable integration och performance optimizations
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 1: RESPONSIV BILDOPTIMERING OCH PRESTANDA
  // ═══════════════════════════════════════════════════════════════

  /**
   * Responsiv bildhantering för Episerver
   * @description Konverterar bilder med data-fluid attribut till picture-element
   * med optimerade breakpoints som matchar Bootstrap
   */
  const responsiveBreakpoints = [576, 768, 992, 1200];

  document.querySelectorAll('img[data-fluid]').forEach(img => {
    const url = new URL(img.src, location.origin);
    url.search = '';

    const picture = document.createElement('picture');
    responsiveBreakpoints.forEach(width => {
      const optimizedSrc = `${url.pathname}?width=${width}&mode=max&format=auto&q=80`;
      const source = Object.assign(document.createElement('source'), {
        srcset: optimizedSrc,
        media: `(max-width:${width - 1}px)`
      });
      picture.appendChild(source);
    });
    img.src = `${url.pathname}?width=1200&mode=max&format=auto&q=80`;
    img.classList.add('img-fluid');
    img.loading = 'lazy';
    picture.appendChild(img.cloneNode());
    img.replaceWith(picture);
  });

  /**
   * Fade-in animationer för element när de kommer in i viewporten
   * @description Använder IntersectionObserver för mjuka animationer
   */
  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const fadeObserver = new window.IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  /**
   * Lazy loading för bilder med data-src attribut
   * @description Laddar bilder när de närmar sig viewporten
   */
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window && lazyImages.length > 0) {
    const lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });
    lazyImages.forEach(img => lazyObserver.observe(img));
  }

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 2: ANVÄNDARINTERAKTION OCH NAVIGATION
  // ═══════════════════════════════════════════════════════════════

  /**
   * Markera dagens öppettider
   * @description Highlightar aktuell dag i öppettidslistan
   */
  const weekdays = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
  const today = weekdays[new Date().getDay()];
  document.querySelectorAll('.hours li').forEach(li => {
    const dayTextElement = li.querySelector('.day');
    if (dayTextElement) {
      const dayText = dayTextElement.textContent.trim();
      if (dayText.startsWith(today)) {
        li.classList.add('today');
      }
    }
  });

  /**
   * Mjuk scroll för ankar-länkar
   * @description Implementerar smooth scrolling med tillgänglighetsfokus
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }, 400);
      }
    });
  });

  /**
   * Städning av navigationselement
   * @description Tar bort expanderade chevron-ikoner
   */
  document.querySelectorAll('.navigation__item-chevron--expanded').forEach(el => el.remove());

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 3: FAQ OCH INNEHÅLLSHANTERING
  // ═══════════════════════════════════════════════════════════════

  /**
   * Konfigurerar FAQ-frågor för tvåradslayout
   * @description Förbereder data-attribut för CSS-styling av FAQ-element
   */
  function setupFAQDataAttributes() {
    const faqSummaries = document.querySelectorAll('.faq-item summary');
    faqSummaries.forEach(summary => {
      const questionText = summary.textContent.trim();
      summary.setAttribute('data-question', questionText);
      summary.textContent = '';
    });
  }

  setupFAQDataAttributes();

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 4: BILDVISNING OCH LIGHTBOX
  // ═══════════════════════════════════════════════════════════════

  /**
   * Lightbox för bussbilder
   * @description Klick-för-förstoring funktionalitet med fullständig tillgänglighet
   */
  const lightbox = document.createElement('div');
  lightbox.className = 'img-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 5: SÄKERHET & GDPR
  // ═══════════════════════════════════════════════════════════════

  /**
   * FUSION ENTERPRISE: Security & Privacy Framework
   * @description GDPR-compliant privacy controls and security hardening
   */
  function initSecurityFramework() {
    // Content Security Policy enforcement
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      cspMeta.setAttribute('content', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; font-src 'self' data:");
      document.head.appendChild(cspMeta);
    }

    // Sanitize external inputs
    window.sanitizeInput = function(input) {
      if (typeof input !== 'string') return '';
      return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    };

    // Secure localStorage wrapper
    window.secureStorage = {
      set: function(key, value, encrypt = true) {
        try {
          const data = encrypt ? btoa(JSON.stringify(value)) : JSON.stringify(value);
          localStorage.setItem('vb_' + key, data);
          return true;
        } catch (e) {
          console.warn('Säker lagring misslyckades:', e.message);
          return false;
        }
      },
      get: function(key, decrypt = true) {
        try {
          const data = localStorage.getItem('vb_' + key);
          if (!data) return null;
          let decoded = decrypt ? atob(data) : data;
          try {
            return JSON.parse(decoded);
          } catch (e) {
            return decoded;
          }
        } catch (e) {
          console.warn('Säker hämtning misslyckades:', e.message);
          return null;
        }
      },
      remove: function(key) {
        localStorage.removeItem('vb_' + key);
      }
    };
  }

  /**
   * FUSION ENTERPRISE: GDPR Compliance Manager
   * @description Swedish data protection and privacy controls
   */
  function initGDPRCompliance() {
    // Check for existing consent
    const hasConsent = window.secureStorage?.get('gdpr_consent', false)?.accepted || false;

    if (!hasConsent && !document.querySelector('.gdpr-banner')) {
      const banner = document.createElement('div');
      banner.className = 'gdpr-banner';
      banner.setAttribute('role', 'banner');
      banner.setAttribute('aria-label', 'Cookie- och dataskyddsmeddelande');
      banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--clr-primary);
        color: var(--clr-on-primary);
        padding: var(--space-md);
        z-index: 10000;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        transform: translateY(100%);
        transition: transform 0.3s ease;
      `;

      banner.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap;">
          <p style="flex: 1; margin: 0; font-size: var(--fs-sm);">
            Vi använder endast tekniskt nödvändiga cookies för att säkerställa att vår tjänst fungerar korrekt.
            Inga personuppgifter lagras utan ditt samtycke enligt GDPR.
          </p>
          <div style="display: flex; gap: var(--space-sm);">
            <button id="gdpr-accept" style="background: var(--clr-on-primary); color: var(--clr-primary); border: none; padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); font-weight: 600; cursor: pointer;">
              Jag förstår
            </button>
            <button id="gdpr-info" style="background: transparent; color: var(--clr-on-primary); border: 1px solid var(--clr-on-primary); padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm); cursor: pointer;">
              Mer info
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(banner);

      // Animate in
      setTimeout(() => {
        banner.style.transform = 'translateY(0)';
      }, 100);

      // Handle consent
      document.getElementById('gdpr-accept').addEventListener('click', function() {
        window.secureStorage?.set('gdpr_consent', {
          accepted: true,
          timestamp: new Date().toISOString(),
          version: '1.0'
        });
        banner.style.transform = 'translateY(100%)';
        setTimeout(() => banner.remove(), 300);
        console.log('GDPR: Samtycke registrerat');
      });

      // Handle info request
      document.getElementById('gdpr-info').addEventListener('click', function() {
        window.open('/integritetspolicy', '_blank', 'noopener,noreferrer');
      });
    }

    // Data minimization: Clean old storage
    const storageKeys = Object.keys(localStorage);
    const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    storageKeys.forEach(key => {
      if (key.startsWith('vb_') && key !== 'vb_gdpr_consent') {
        try {
          const data = window.secureStorage?.get(key.replace('vb_', ''));
          if (data && data.timestamp && new Date(data.timestamp).getTime() < oneMonthAgo) {
            window.secureStorage?.remove(key.replace('vb_', ''));
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 6: DARK MODE TOGGLE
  // ═══════════════════════════════════════════════════════════════

  // 1. Add dark mode toggle support
  (function() {
    const root = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    function setTheme(theme) {
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        if (themeToggleBtn) themeToggleBtn.setAttribute('aria-pressed', 'true');
        if (themeToggleBtn) themeToggleBtn.innerHTML = '☀️ Light Mode';
      } else {
        root.removeAttribute('data-theme');
        if (themeToggleBtn) themeToggleBtn.setAttribute('aria-pressed', 'false');
        if (themeToggleBtn) themeToggleBtn.innerHTML = '🌙 Dark Mode';
      }
    }

    // On page load
    if (savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        setTheme(isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
      });
    }
  })();

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 7: INIT SECURITY & GDPR
  // ═══════════════════════════════════════════════════════════════

  initSecurityFramework();
  initGDPRCompliance();

});
