// ════════════════════════════════
// STUDYVERSE – PROGRESS TRACKER
// ════════════════════════════════

// localStorage keys
const KEYS = {
  video1: 'sv_video1_watched',
  game1:  'sv_game1_complete',
  video2: 'sv_video2_watched',
  game2:  'sv_game2_complete',
};

/** Persist a progress milestone */
function markProgress(key) {
  localStorage.setItem(key, '1');
}

/** Return true if the given page id is accessible */
function isUnlocked(pageId) {
  switch (pageId) {
    case 'home':   return true;
    case 'video1': return true;
    case 'game1':  return !!localStorage.getItem(KEYS.video1);
    case 'video2': return !!localStorage.getItem(KEYS.game1);
    case 'game2':  return !!localStorage.getItem(KEYS.video2);
    case 'final':  return !!localStorage.getItem(KEYS.game2);
    default:       return false;
  }
}

// ── Auto-mark video pages as watched on load ──
function autoMark() {
  const page = window.location.pathname.split('/').pop();
  if (page === 'video1.html') markProgress(KEYS.video1);
  if (page === 'video2.html') markProgress(KEYS.video2);
}

// ════════════════════════════════
// SIDEBAR BUILDER
// ════════════════════════════════
const NAV_ITEMS = [
  { id: 'home',   label: 'Home',    href: 'index.html'   },
  { id: 'video1', label: 'Level 1', href: 'video1.html' },
  { id: 'game1',  label: 'Game 1',  href: 'game1.html'  },
  { id: 'video2', label: 'Level 2', href: 'video2.html' },
  { id: 'game2',  label: 'Game 2',  href: 'game2.html'  },
  { id: 'final',  label: 'Final',   href: 'final.html'  },
];

function buildSidebar() {
  // ── Overlay ──
  const overlay = document.createElement('div');
  overlay.id = 'sidebarOverlay';
  overlay.addEventListener('click', closeSidebar);

  // ── Sidebar panel ──
  const sidebar = document.createElement('nav');
  sidebar.id = 'sidebar';

  // Close button (✕)
  const closeBtn = document.createElement('button');
  closeBtn.id          = 'sidebarCloseBtn';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close menu');
  closeBtn.addEventListener('click', closeSidebar);
  sidebar.appendChild(closeBtn);

  // Sidebar title
  const title = document.createElement('p');
  title.className   = 'sidebar-title';
  title.textContent = 'StudyVerse';
  sidebar.appendChild(title);

  // Nav list
  const ul = document.createElement('ul');
  NAV_ITEMS.forEach(item => {
    const li = document.createElement('li');
    if (isUnlocked(item.id)) {
      const a       = document.createElement('a');
      a.href        = item.href;
      a.textContent = item.label;
      li.appendChild(a);
    } else {
      li.classList.add('locked');
      li.innerHTML = `<span>${item.label}</span><span class="lock-icon">🔒</span>`;
    }
    ul.appendChild(li);
  });
  sidebar.appendChild(ul);

  // ── Hamburger button ──
  const btn = document.createElement('button');
  btn.id = 'hamburgerBtn';
  btn.setAttribute('aria-label', 'Toggle navigation menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  btn.addEventListener('click', toggleSidebar);

  // Inject into page
  document.body.prepend(overlay);
  document.body.prepend(sidebar);
  document.body.prepend(btn);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ── Init on DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  autoMark();
  buildSidebar();
});
