/* ============================================================
   JS — Theme Toggle (Light / Dark Mode)
   ============================================================ */

const THEME_KEY = 'ph-theme';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  // Update all toggles on the page
  document.querySelectorAll('.theme-checkbox').forEach(cb => {
    cb.checked = (theme === 'dark');
  });
  document.querySelectorAll('.theme-toggle-thumb').forEach(thumb => {
    thumb.textContent = theme === 'dark' ? '🌙' : '☀️';
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || getSystemTheme());
}

// Toast notification system
function showToast(title, message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', danger: '🚨', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:var(--color-text-subtle);font-size:16px;padding:0;margin-left:auto;align-self:flex-start;">✕</button>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// Tab system
function initTabs(containerSelector) {
  document.querySelectorAll(containerSelector || '.tabs').forEach(tabs => {
    tabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const parent = tabs.closest('[data-tabs-wrapper]') || document;
        tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = parent.querySelector(`[data-tab-panel="${target}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

// Modal system
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
}
function initModals() {
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
  });
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modalClose));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
    });
  });
}

// SPA Navigation
function navigate(sectionId, navItems, navAttr = 'data-nav') {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute(navAttr) === sectionId) item.classList.add('active');
  });
}

// Sidebar Toggle
function initSidebarToggle() {
  const hamburger = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const shell = document.querySelector('.app-shell');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
      } else {
        if (shell) shell.classList.toggle('sidebar-collapsed');
      }
    });
  }

  if (overlay && sidebar) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTabs();
  initModals();
  initSidebarToggle();
  document.querySelectorAll('.theme-checkbox').forEach(cb => {
    cb.addEventListener('change', toggleTheme);
  });
});
