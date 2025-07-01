/**
 * Vaccinbussen JavaScript - Komplett system med responsiv bildhantering + Dark/Light mode FA ikoner
 * @author Claude Code, updated by Grimoire
 * @version 3.2 - Font Awesome Dark Mode Icon Integration
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 1: RESPONSIV BILDOPTIMERING OCH PRESTANDA
  // ═══════════════════════════════════════════════════════════════

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

  // Fade-in animationer för element när de kommer in i viewporten
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

  // Lazy loading för bilder med data-src attribut
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

  // Responsive date formatting for location schedule
  function setupResponsiveDates() {
    const dateCells = document.querySelectorAll('.location-schedule td:first-child');

    dateCells.forEach(cell => {
      const originalText = cell.textContent.trim();
      // Parse the date (assuming format like "24 feb 2025")
      const parts = originalText.split(' ');
      if (parts.length >= 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        // Create responsive date spans
        cell.innerHTML = `
          <span class="date-full">${originalText}</span>
          <span class="date-medium">${day} ${month.substring(0, 3)}</span>
          <span class="date-short">${day}/${getMonthNumber(month)}</span>
        `;
      }
    });
  }

  function getMonthNumber(monthName) {
    const months = {
      'jan': '1', 'januari': '1',
      'feb': '2', 'februari': '2',
      'mar': '3', 'mars': '3',
      'apr': '4', 'april': '4',
      'maj': '5',
      'jun': '6', 'juni': '6',
      'jul': '7', 'juli': '7',
      'aug': '8', 'augusti': '8',
      'sep': '9', 'september': '9',
      'okt': '10', 'oktober': '10',
      'nov': '11', 'november': '11',
      'dec': '12', 'december': '12'
    };
    return months[monthName.toLowerCase()] || monthName;
  }

  // Call the function after DOM is ready
  setupResponsiveDates();

  // Markera dagens öppettider
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

  // Mjuk scroll för ankar-länkar
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

  // Städning av navigationselement
  document.querySelectorAll('.navigation__item-chevron--expanded').forEach(el => el.remove());

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 3: FAQ OCH INNEHÅLLSHANTERING
  // ═══════════════════════════════════════════════════════════════

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

  const lightbox = document.createElement('div');
  lightbox.className = 'img-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  // (Implementation av lightbox här om du vill!)

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 5: SÄKERHET & GDPR
  // ═══════════════════════════════════════════════════════════════

  function initSecurityFramework() {
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      cspMeta.setAttribute('content', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; font-src 'self' data:");
      document.head.appendChild(cspMeta);
    }
    window.sanitizeInput = function(input) {
      if (typeof input !== 'string') return '';
      return input.replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    };
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

  function initGDPRCompliance() {
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
        background: var(--clr-gdpr-light-bg,#FFB74D);
        color: var(--clr-on-primary,#fff);
        padding: 1em;
        z-index: 10000;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        transform: translateY(100%);
        transition: transform 0.3s ease;
      `;

      banner.classList.add('gdpr-banner');
      banner.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 1em; flex-wrap: wrap;">
          <p style="flex: 1; margin: 0; font-size: 1em;">
            Vi använder endast tekniskt nödvändiga cookies för att säkerställa att vår tjänst fungerar korrekt.
            Inga personuppgifter lagras utan ditt samtycke enligt GDPR.
          </p>
          <div style="display: flex; gap: 0.5em;">
            <button id="gdpr-accept" style="background: var(--vb-primary-main, #012363); color: var(--vb-text-inverse, #fff); border: none; padding: 0.4em 1.2em; border-radius: 0.4em; font-weight: 600; cursor: pointer;">
              Jag förstår
            </button>
            <button id="gdpr-info" style="background: transparent; color: var(--vb-text-primary, #012363); border: 1px solid var(--vb-border-primary, #e0e0e0); padding: 0.4em 1.2em; border-radius: 0.4em; cursor: pointer;">
              Mer info
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(banner);
      setTimeout(() => {
        banner.style.transform = 'translateY(0)';
      }, 100);

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
      document.getElementById('gdpr-info').addEventListener('click', function() {
        window.open('/integritetspolicy', '_blank', 'noopener,noreferrer');
      });
    }

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
  // SEKTION 6: DARK MODE TOGGLE (Font Awesome Ikon)
  // ═══════════════════════════════════════════════════════════════

  (function() {
    const root = document.querySelector('#vaccine-bjarred-app') || document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Insert icon span if not present
    if (!themeToggleBtn.querySelector('i')) {
      const icon = document.createElement('i');
      icon.className = 'fas fa-sun';
      icon.setAttribute('aria-hidden', 'true');
      themeToggleBtn.prepend(icon);
    }
    const icon = themeToggleBtn.querySelector('i');
    // Helper for icon color
    function setIcon(theme) {
      if (!icon) return;
      if (theme === 'dark') {
        icon.className = 'fas fa-moon';
        icon.style.color = '#fff';
        themeToggleBtn.setAttribute('aria-label', 'Byt till ljust läge');
        themeToggleBtn.title = 'Byt till ljust läge';
      } else {
        icon.className = 'fas fa-sun';
        icon.style.color = '#000';
        themeToggleBtn.setAttribute('aria-label', 'Byt till mörkt läge');
        themeToggleBtn.title = 'Byt till mörkt läge';
      }
    }
    // Get user/system preference
    const savedTheme = localStorage.getItem('theme');
    function setTheme(theme) {
      if (theme === 'dark') {
        root.classList.add('dark');
        themeToggleBtn.setAttribute('aria-pressed', 'true');
      } else {
        root.classList.remove('dark');
        themeToggleBtn.setAttribute('aria-pressed', 'false');
      }
      setIcon(theme);
    }
    if (savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    themeToggleBtn.addEventListener('click', () => {
      const isDark = root.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
  })();

  // ═══════════════════════════════════════════════════════════════
  // SEKTION 7: INIT SECURITY & GDPR
  // ═══════════════════════════════════════════════════════════════

  initSecurityFramework();
  initGDPRCompliance();
});
