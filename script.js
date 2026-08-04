'use strict';

const root = document.documentElement;
const STORE_KEY = 'mochipote-theme';
const media = window.matchMedia('(prefers-color-scheme: dark)');
const themeSwitch = document.getElementById('theme-switch');
const hitsBadge = document.getElementById('hits-badge');
const yearSpan = document.getElementById('year');

function currentTheme() {
  return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme, persist) {
  root.setAttribute('data-theme', theme);
  if (themeSwitch) themeSwitch.checked = theme === 'dark';
  if (persist) {
    localStorage.setItem(STORE_KEY, theme);
  } else {
    localStorage.removeItem(STORE_KEY);
  }
  updateMetaThemeColor();
  updateBadgeColors(theme);
}

function updateMetaThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.content = getComputedStyle(root).getPropertyValue('--background').trim();
  }
}

function updateBadgeColors(theme) {
  if (!hitsBadge) return;
  const dark = theme === 'dark';
  const label = dark ? '4A3C8F' : '5B4CB6';
  const count = dark ? '6756B5' : '38308A';
  hitsBadge.src =
    'https://hits.sh/mochipote.github.io.svg?label=Access' +
    '&labelColor=' + label +
    '&color=' + count;
}

if (themeSwitch) {
  themeSwitch.addEventListener('change', () => {
    applyTheme(themeSwitch.checked ? 'dark' : 'light', true);
  });
}

const onSystemThemeChange = (event) => {
  if (!localStorage.getItem(STORE_KEY)) {
    applyTheme(event.matches ? 'dark' : 'light', false);
  }
};
if (media.addEventListener) {
  media.addEventListener('change', onSystemThemeChange);
} else if (media.addListener) {
  media.addListener(onSystemThemeChange);
}

if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

applyTheme(currentTheme(), false);

document.addEventListener('pointerdown', (event) => {
  const target = event.target.closest('.link-card, .chip');
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = event.clientX - rect.left - size / 2 + 'px';
  ripple.style.top = event.clientY - rect.top - size / 2 + 'px';
  target.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});