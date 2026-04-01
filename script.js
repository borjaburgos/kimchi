/* ── Servings Scaler ── */

const FRACTIONS = [
  [1, '1'], [0.875, '⅞'], [0.833, '⅚'], [0.75, '¾'], [0.667, '⅔'],
  [0.625, '⅝'], [0.5, '½'], [0.375, '⅜'], [0.333, '⅓'], [0.25, '¼'],
  [0.2, '⅕'], [0.167, '⅙'], [0.125, '⅛']
];

function formatAmount(value) {
  if (value === 0) return '0';
  if (Number.isInteger(value)) return String(value);

  const whole = Math.floor(value);
  const frac = value - whole;

  if (frac < 0.06) return String(whole || '< ⅛');

  let bestDiff = Infinity, bestSymbol = null;
  for (const [threshold, symbol] of FRACTIONS) {
    const diff = Math.abs(frac - threshold);
    if (diff < bestDiff) { bestDiff = diff; bestSymbol = symbol; }
  }

  if (bestDiff < 0.05 && bestSymbol) {
    if (bestSymbol === '1') return String(whole + 1);
    return whole ? `${whole} ${bestSymbol}` : bestSymbol;
  }

  // Fallback: round to 1 decimal
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function initScaler(section) {
  const display = section.querySelector('.servings-count');
  const base = parseInt(display.dataset.base, 10);
  let current = base;

  function update() {
    display.textContent = current;
    const ratio = current / base;
    section.querySelectorAll('[data-base-amount]').forEach(el => {
      const baseAmt = parseFloat(el.dataset.baseAmount);
      el.textContent = formatAmount(baseAmt * ratio);
    });
  }

  section.querySelector('.btn-minus').addEventListener('click', () => {
    if (current > 1) { current--; update(); }
  });
  section.querySelector('.btn-plus').addEventListener('click', () => {
    current++; update();
  });
}

/* ── Accordion ── */

function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open', !isOpen);
      header.setAttribute('aria-expanded', !isOpen);
    });
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
}

/* ── Smooth Scroll ── */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Mobile Nav ── */

function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.nav-cards');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('show');
    toggle.setAttribute('aria-expanded', nav.classList.contains('show'));
  });
}

/* ── Init ── */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.recipe-section').forEach(initScaler);
  initAccordions();
  initSmoothScroll();
  initMobileNav();
});
