/* ==========================================================
   Habit Heatmap Tracker — Application Logic
   ========================================================== */

// ───────────────────────────────────────────────────────────
//  Constants
// ───────────────────────────────────────────────────────────

const STORAGE_KEY = 'habit-heatmap-data';

const DEFAULT_HABITS = [
  { id: 'h1', name: 'Code',     emoji: '💻' },
  { id: 'h2', name: 'Read',     emoji: '📚' },
  { id: 'h3', name: 'Exercise', emoji: '🏋️' },
];

const HABIT_EMOJIS = [
  '💻', '📚', '🏋️', '🧘', '🎨',
  '🎵', '🌱', '💧', '🍎', '😴',
  '📝', '🏃', '🚴', '🧹', '💰',
  '🎯', '🧠', '❤️', '🌍', '⏰',
];

/** Human-readable activity level names for tooltips. */
const LEVEL_NAMES = [
  'No activity',    // 0
  'Light',          // 1
  'Moderate',       // 2
  'Strong',         // 3
  'Intense 💪',     // 4
];

// ───────────────────────────────────────────────────────────
//  State Management
// ───────────────────────────────────────────────────────────

/** Load saved state from localStorage, or create defaults. */
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.habits && parsed.entries && parsed.activeHabitId) {
        return parsed;
      }
    } catch (e) {
      console.warn('Could not parse saved state, starting fresh.');
    }
  }

  const entries = {};
  DEFAULT_HABITS.forEach(h => (entries[h.id] = {}));

  return {
    habits: DEFAULT_HABITS.map(h => ({ ...h })),
    activeHabitId: DEFAULT_HABITS[0].id,
    entries,
  };
}

/** Persist the current state to localStorage. */
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

// ───────────────────────────────────────────────────────────
//  Date Utilities
// ───────────────────────────────────────────────────────────

/** Format a Date as 'YYYY-MM-DD' (timezone-safe, no UTC shift). */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a 'YYYY-MM-DD' string into a local midnight Date. */
function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Generate all Dates for the heatmap (last ~53 weeks).
 * Always starts on a Sunday to align with the 7-row grid.
 */
function getHeatmapDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Go back to Sunday of the current week, then 52 more weeks
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() - 52 * 7);

  const dates = [];
  const cursor = new Date(start);

  while (cursor <= today) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

// ───────────────────────────────────────────────────────────
//  Heatmap Rendering
// ───────────────────────────────────────────────────────────

/** Map an activity count to a color intensity level (0-4). */
function getActivityLevel(count) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

/**
 * Determine which grid columns need month labels.
 * Returns an array of { text, col } objects.
 */
function getMonthLabels(dates) {
  const labels = [];
  let lastMonth = -1;

  for (let i = 0; i < dates.length; i++) {
    const month = dates[i].getMonth();
    const col = Math.floor(i / 7);

    if (month !== lastMonth) {
      // Avoid duplicate labels on the same column
      if (labels.length === 0 || labels[labels.length - 1].col !== col) {
        labels.push({
          text: dates[i].toLocaleString('default', { month: 'short' }),
          col,
        });
      }
      lastMonth = month;
    }
  }

  return labels;
}

/** Render the complete heatmap grid and month labels. */
function renderHeatmap() {
  const dates = getHeatmapDates();
  const grid = document.getElementById('heatmap-grid');
  const monthsContainer = document.getElementById('heatmap-months');
  const entries = state.entries[state.activeHabitId] || {};

  // Clear
  grid.innerHTML = '';
  monthsContainer.innerHTML = '';

  // ─── Read cell dimensions from CSS ─────────────────
  const rootStyles = getComputedStyle(document.documentElement);
  const cellSize = parseInt(rootStyles.getPropertyValue('--cell-size')) || 16;
  const cellGap = parseInt(rootStyles.getPropertyValue('--cell-gap')) || 4;
  const step = cellSize + cellGap; // distance from one column start to the next

  // ─── Month Labels ──────────────────────────────────
  const labels = getMonthLabels(dates);

  labels.forEach(label => {
    const span = document.createElement('span');
    span.className = 'month-label';
    span.textContent = label.text;
    span.style.left = `${label.col * step}px`;
    monthsContainer.appendChild(span);
  });

  // Set months container min-width so labels can position correctly
  const totalCols = Math.ceil(dates.length / 7);
  monthsContainer.style.minWidth = `${totalCols * step}px`;

  // ─── Grid Cells ────────────────────────────────────
  const fragment = document.createDocumentFragment();

  dates.forEach((date, i) => {
    const key = formatDate(date);
    const count = entries[key] || 0;
    const level = getActivityLevel(count);
    const col = Math.floor(i / 7);

    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.dataset.date = key;
    cell.dataset.level = String(level);
    cell.dataset.count = String(count);

    // Staggered wave animation — each column delays slightly
    cell.style.animationDelay = `${col * 10}ms`;

    fragment.appendChild(cell);
  });

  grid.appendChild(fragment);

  // Auto-scroll to the right (most recent weeks)
  const scroll = document.querySelector('.heatmap-scroll');
  if (scroll) {
    requestAnimationFrame(() => {
      scroll.scrollLeft = scroll.scrollWidth;
    });
  }

  updateStats();
}

// ───────────────────────────────────────────────────────────
//  Statistics
// ───────────────────────────────────────────────────────────

/** Current streak: consecutive days ending today (or yesterday). */
function calculateCurrentStreak(entries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let d = new Date(today);
  let key = formatDate(d);

  // If no activity today, allow yesterday to continue the streak
  if (!(entries[key] > 0)) {
    d.setDate(d.getDate() - 1);
    key = formatDate(d);
    if (!(entries[key] > 0)) return 0;
  }

  let streak = 0;
  while (entries[formatDate(d)] > 0) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return streak;
}

/** Longest-ever streak of consecutive active days. */
function calculateLongestStreak(entries) {
  const activeDates = Object.keys(entries)
    .filter(k => entries[k] > 0)
    .sort();

  if (activeDates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < activeDates.length; i++) {
    const prev = parseDate(activeDates[i - 1]);
    const curr = parseDate(activeDates[i]);
    const diffDays = Math.round((curr - prev) / 86_400_000);

    if (diffDays === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  return longest;
}

/** Total unique days with at least one activity. */
function calculateTotalDays(entries) {
  return Object.values(entries).filter(v => v > 0).length;
}

/** Active days in the current calendar year. */
function calculateThisYear(entries) {
  const year = String(new Date().getFullYear());
  return Object.keys(entries).filter(
    k => entries[k] > 0 && k.startsWith(year)
  ).length;
}

/** Update all stat displays with animated counting. */
function updateStats() {
  const entries = state.entries[state.activeHabitId] || {};

  animateValue('current-streak', calculateCurrentStreak(entries));
  animateValue('longest-streak', calculateLongestStreak(entries));
  animateValue('total-days', calculateTotalDays(entries));
  animateValue('this-year', calculateThisYear(entries));
}

/** Animate a number from its current value to a target (ease-out cubic). */
function animateValue(elementId, target) {
  const el = document.getElementById(elementId);
  const from = parseInt(el.textContent) || 0;

  if (from === target) return;

  const duration = 400;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (target - from) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ───────────────────────────────────────────────────────────
//  Habit Management
// ───────────────────────────────────────────────────────────

/** Render the habit pills in the selector bar. */
function renderHabits() {
  const container = document.getElementById('habit-pills');
  container.innerHTML = '';

  state.habits.forEach(habit => {
    const pill = document.createElement('button');
    pill.className = 'habit-pill' + (habit.id === state.activeHabitId ? ' active' : '');
    pill.dataset.id = habit.id;

    const canDelete = state.habits.length > 1;
    pill.innerHTML = `
      <span class="habit-emoji">${habit.emoji}</span>
      <span class="habit-name">${habit.name}</span>
      ${canDelete ? '<span class="habit-delete" title="Delete habit">&times;</span>' : ''}
    `;

    container.appendChild(pill);
  });
}

/** Switch the active habit and re-render. */
function switchHabit(id) {
  if (state.activeHabitId === id) return;
  state.activeHabitId = id;
  saveState();
  renderHabits();
  renderHeatmap();
}

/** Delete a habit after confirmation. */
function deleteHabit(id) {
  if (state.habits.length <= 1) return;
  if (!confirm('Delete this habit and all its data? This can\'t be undone.')) return;

  state.habits = state.habits.filter(h => h.id !== id);
  delete state.entries[id];

  if (state.activeHabitId === id) {
    state.activeHabitId = state.habits[0].id;
  }

  saveState();
  renderHabits();
  renderHeatmap();
}

/** Add a new habit and switch to it. */
function addHabit(name, emoji) {
  const id = 'h' + Date.now();
  state.habits.push({ id, name, emoji });
  state.entries[id] = {};
  state.activeHabitId = id;
  saveState();
  renderHabits();
  renderHeatmap();
}

// ───────────────────────────────────────────────────────────
//  Add Habit Modal
// ───────────────────────────────────────────────────────────

let selectedEmoji = null;

function openModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('active');
  document.getElementById('habit-name').value = '';
  selectedEmoji = null;
  renderEmojiGrid();
  setTimeout(() => document.getElementById('habit-name').focus(), 120);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

function renderEmojiGrid() {
  const grid = document.getElementById('emoji-grid');
  grid.innerHTML = '';

  HABIT_EMOJIS.forEach(emoji => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emoji-option';
    btn.textContent = emoji;
    btn.setAttribute('aria-label', emoji);

    btn.addEventListener('click', () => {
      grid.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
      btn.classList.add('selected');
      selectedEmoji = emoji;
    });

    grid.appendChild(btn);
  });
}

// ───────────────────────────────────────────────────────────
//  Tooltip (enhanced with level descriptions)
// ───────────────────────────────────────────────────────────

function showTooltip(cell) {
  const tooltip = document.getElementById('tooltip');
  const tooltipText = document.getElementById('tooltip-text');

  const date = parseDate(cell.dataset.date);
  const count = parseInt(cell.dataset.count) || 0;
  const level = getActivityLevel(count);
  const levelName = LEVEL_NAMES[level];

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (count === 0) {
    tooltipText.innerHTML = `<strong>No activity</strong><br>${dateStr}`;
  } else {
    tooltipText.innerHTML = `<strong>${count} × ${levelName}</strong><br>${dateStr}`;
  }

  // Make visible to measure
  tooltip.classList.add('visible');

  const cellRect = cell.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();

  let left = cellRect.left + cellRect.width / 2 - tipRect.width / 2;
  let top = cellRect.top - tipRect.height - 10;

  const pad = 8;
  if (left < pad) left = pad;
  if (left + tipRect.width > window.innerWidth - pad) {
    left = window.innerWidth - tipRect.width - pad;
  }
  if (top < pad) {
    top = cellRect.bottom + 10;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideTooltip() {
  document.getElementById('tooltip').classList.remove('visible');
}

// ───────────────────────────────────────────────────────────
//  Floating Indicator (+1 / -1 visual feedback)
// ───────────────────────────────────────────────────────────

/**
 * Show a small floating label (e.g. "+1", "-1") that rises from a cell
 * and fades out. Gives satisfying feedback on each click.
 */
function showFloatingIndicator(cell, text, direction) {
  const indicator = document.createElement('div');
  indicator.className = `float-indicator ${direction}`;
  indicator.textContent = text;

  const rect = cell.getBoundingClientRect();
  indicator.style.left = `${rect.left + rect.width / 2}px`;
  indicator.style.top = `${rect.top - 4}px`;

  document.body.appendChild(indicator);

  // Trigger the rise-and-fade animation on the next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      indicator.classList.add('animate');
    });
  });

  // Remove from DOM after animation completes
  setTimeout(() => indicator.remove(), 550);
}

// ───────────────────────────────────────────────────────────
//  Event Wiring
// ───────────────────────────────────────────────────────────

function init() {
  renderHabits();
  renderHeatmap();

  // ─── Habit Pills (event delegation) ──────────────
  document.getElementById('habit-pills').addEventListener('click', e => {
    const del = e.target.closest('.habit-delete');
    if (del) {
      e.stopPropagation();
      const pill = del.closest('.habit-pill');
      if (pill) deleteHabit(pill.dataset.id);
      return;
    }

    const pill = e.target.closest('.habit-pill');
    if (pill) switchHabit(pill.dataset.id);
  });

  // ─── Add Habit Button ───────────────────────────
  document.getElementById('add-habit-btn').addEventListener('click', openModal);

  // ─── Modal Controls ─────────────────────────────
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);

  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById('modal-add').addEventListener('click', () => {
    const name = document.getElementById('habit-name').value.trim();

    if (!name) {
      const input = document.getElementById('habit-name');
      input.focus();
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
      return;
    }

    if (!selectedEmoji) {
      const emojiGrid = document.querySelector('.emoji-grid');
      emojiGrid.classList.add('shake');
      setTimeout(() => emojiGrid.classList.remove('shake'), 500);
      return;
    }

    addHabit(name, selectedEmoji);
    closeModal();
  });

  document.getElementById('habit-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('modal-add').click();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ─── Heatmap Grid Interactions ──────────────────

  const grid = document.getElementById('heatmap-grid');

  // Left-click: cycle activity level UP (0→1→2→3→4→0)
  grid.addEventListener('click', e => {
    const cell = e.target.closest('.heatmap-cell');
    if (!cell) return;

    const key = cell.dataset.date;
    const entries = state.entries[state.activeHabitId];
    const current = entries[key] || 0;
    const next = (current + 1) % 5;

    if (next === 0) {
      delete entries[key];
    } else {
      entries[key] = next;
    }

    cell.dataset.count = String(next);
    cell.dataset.level = String(getActivityLevel(next));

    // Pop animation
    cell.classList.remove('pop');
    void cell.offsetWidth; // Reflow to restart animation
    cell.classList.add('pop');

    // Floating "+1" feedback
    if (next > 0) {
      showFloatingIndicator(cell, `+${next}`, 'up');
    } else {
      showFloatingIndicator(cell, '✕', 'down');
    }

    saveState();
    updateStats();
    showTooltip(cell);
  });

  // Right-click: cycle activity level DOWN
  grid.addEventListener('contextmenu', e => {
    const cell = e.target.closest('.heatmap-cell');
    if (!cell) return;
    e.preventDefault();

    const key = cell.dataset.date;
    const entries = state.entries[state.activeHabitId];
    const current = entries[key] || 0;
    const next = current > 0 ? current - 1 : 4;

    if (next === 0) {
      delete entries[key];
    } else {
      entries[key] = next;
    }

    cell.dataset.count = String(next);
    cell.dataset.level = String(getActivityLevel(next));

    cell.classList.remove('pop');
    void cell.offsetWidth;
    cell.classList.add('pop');

    if (next === 0) {
      showFloatingIndicator(cell, '✕', 'down');
    } else {
      showFloatingIndicator(cell, `-${current}`, 'down');
    }

    saveState();
    updateStats();
    showTooltip(cell);
  });

  // Tooltip on hover
  grid.addEventListener('mouseover', e => {
    const cell = e.target.closest('.heatmap-cell');
    if (cell) showTooltip(cell);
  });

  grid.addEventListener('mouseout', e => {
    const cell = e.target.closest('.heatmap-cell');
    if (cell) hideTooltip();
  });
}

// ───────────────────────────────────────────────────────────
//  Boot
// ───────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
