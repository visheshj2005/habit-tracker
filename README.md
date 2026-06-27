# Build a Habit Heatmap Tracker with HTML, CSS, and JavaScript 🟩

![Habit Heatmap Tracker Preview](header.png)

Ever looked at your GitHub contribution graph and thought, _"I wish I could track ALL my habits like this"_? Same.

In this tutorial, we're going to build a **Habit Heatmap Tracker** — a beautiful, interactive web app that lets you track your daily habits with a GitHub-style contribution grid. We'll use a **neo-brutalism** design style (thick borders, hard shadows, bold colors) with an English color palette that feels fresh, playful, and premium.

The best part? **Zero dependencies.** Just HTML, CSS, and JavaScript. No React, no frameworks, no `npm install` — just you and the browser. Let's go! 🚀

---

## What You'll Learn 📚

By the end of this tutorial, you'll know how to:

- Structure a semantic HTML page with accessibility in mind
- Build a **neo-brutalism** design system with CSS custom properties
- Create a **heatmap grid** using CSS Grid's `grid-auto-flow: column`
- Generate 365 days of dates with JavaScript's `Date` API
- Use **event delegation** to handle clicks on hundreds of elements efficiently
- Calculate **streaks** by walking through dates
- Persist data with the **Web Storage API** (`localStorage`)
- Add **micro-animations** that make the UI feel alive

---

## Prerequisites ✅

You should know:
- Basic HTML (tags, attributes, forms)
- Basic CSS (selectors, flexbox, basic properties)
- Basic JavaScript (variables, functions, DOM manipulation)

You'll need:
- A code editor (VS Code, Sublime Text, whatever you like)
- A modern web browser (Chrome, Firefox, Edge)
- That's it! No installs, no terminal magic. 🎉

---

## Step 1: Setting Up the Project 📁

Create a new folder called `habit-heatmap` and add three files:

```
habit-heatmap/
├── index.html
├── style.css
└── app.js
```

That's our entire project structure. Three files, zero config. Beautiful.

---

## Step 2: The HTML Blueprint 🏗️

Let's build the skeleton of our page. Open `index.html` and start with the boilerplate:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Track your daily habits with a beautiful contribution heatmap.">
  <title>Habit Heatmap Tracker</title>

  <!-- Favicon — an inline SVG so we don't need an extra file! -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🟩</text></svg>">

  <!-- Google Fonts: Space Grotesk (chunky body) + Space Mono (stats) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- We'll fill this in next! -->
  <script src="app.js"></script>
</body>
</html>
```

**What's happening here?**

- The `<meta name="viewport">` tag makes the page responsive on mobile.
- We're loading **Space Grotesk** and **Space Mono** from Google Fonts — these chunky, geometric fonts are perfect for neo-brutalism.
- The favicon is a clever trick: we embed an SVG directly in the `href` so we don't need an extra `.ico` file. The green square emoji becomes our tab icon! 🟩

### Adding the Page Structure

Now let's add the actual content inside `<body>`, above the `<script>` tag:

```html
<!-- Decorative Neo-Brutalism Accent Bar -->
<div class="accent-bar" aria-hidden="true"></div>

<!-- Header -->
<header class="header">
  <div class="header-content">
    <div class="logo">
      <span class="logo-badge" aria-hidden="true">🟩</span>
      <div>
        <h1>Habit Heatmap</h1>
        <p class="tagline">Track your daily habits, one square at a time</p>
      </div>
    </div>
  </div>
</header>
```

The `.accent-bar` is a thin colorful stripe at the very top of the page — a classic neo-brutalism decoration. The `aria-hidden="true"` tells screen readers to skip it since it's purely decorative.

### Habit Selector Bar

Next up, the habit pills — buttons that let users switch between different habits:

```html
<main class="container">
  <!-- Habit Selector Bar -->
  <section class="habit-bar" aria-label="Habit selector">
    <div class="habit-pills" id="habit-pills">
      <!-- Rendered by JavaScript -->
    </div>
    <button class="add-habit-btn" id="add-habit-btn" aria-label="Add new habit">
      <span aria-hidden="true">+</span> New Habit
    </button>
  </section>
```

Notice the `id="habit-pills"` — we'll use this to inject habit buttons dynamically with JavaScript. The `<!-- Rendered by JavaScript -->` comment is a signal to future-you (or anyone reading the code) that this content is dynamic.

### The Heatmap Card

This is the star of the show! The heatmap card contains the grid, month labels, day labels, and a legend:

```html
  <!-- Heatmap -->
  <section class="heatmap-card" id="heatmap-card" aria-label="Activity heatmap">
    <div class="heatmap-card-header">
      <h2 class="heatmap-title">📊 Activity Grid</h2>
      <p class="heatmap-hint">Click to log · Right-click to undo</p>
    </div>
    <div class="heatmap-scroll">
      <div class="heatmap-months" id="heatmap-months" aria-hidden="true">
        <!-- Month labels rendered by JavaScript -->
      </div>
      <div class="heatmap-body">
        <div class="heatmap-days" aria-hidden="true">
          <span></span>
          <span>Mon</span>
          <span></span>
          <span>Wed</span>
          <span></span>
          <span>Fri</span>
          <span></span>
        </div>
        <div class="heatmap-grid" id="heatmap-grid" role="grid" aria-label="Habit activity grid">
          <!-- Grid cells rendered by JavaScript -->
        </div>
      </div>
    </div>
    <div class="heatmap-footer">
      <div class="heatmap-level-guide">
        <span class="level-tag" data-level="1">1 = Light</span>
        <span class="level-tag" data-level="2">2 = Moderate</span>
        <span class="level-tag" data-level="3">3 = Strong</span>
        <span class="level-tag" data-level="4">4 = Intense</span>
      </div>
      <div class="heatmap-legend-wrapper">
        <span class="heatmap-legend-label">Less</span>
        <div class="heatmap-legend">
          <span class="legend-cell" data-level="0"></span>
          <span class="legend-cell" data-level="1"></span>
          <span class="legend-cell" data-level="2"></span>
          <span class="legend-cell" data-level="3"></span>
          <span class="legend-cell" data-level="4"></span>
        </div>
        <span class="heatmap-legend-label">More</span>
      </div>
    </div>
  </section>
```

**Key design decisions:**

- The `.heatmap-scroll` wrapper gives us horizontal scrolling on mobile — the grid is wide!
- Day labels only show **Mon, Wed, Fri** (matching GitHub's style) — less visual noise.
- The `.heatmap-level-guide` shows what each intensity level means: Light, Moderate, Strong, Intense.
- The `data-level` attributes on legend cells let us style them with CSS attribute selectors.

### Stats Cards

Four cards showing streak and activity statistics:

```html
  <!-- Stats -->
  <section class="stats-grid" id="stats-grid" aria-label="Habit statistics">
    <div class="stat-card stat-card--fire">
      <div class="stat-icon" aria-hidden="true">🔥</div>
      <div class="stat-value" id="current-streak">0</div>
      <div class="stat-label">Current Streak</div>
    </div>
    <div class="stat-card stat-card--gold">
      <div class="stat-icon" aria-hidden="true">📈</div>
      <div class="stat-value" id="longest-streak">0</div>
      <div class="stat-label">Longest Streak</div>
    </div>
    <div class="stat-card stat-card--mint">
      <div class="stat-icon" aria-hidden="true">📊</div>
      <div class="stat-value" id="total-days">0</div>
      <div class="stat-label">Total Active</div>
    </div>
    <div class="stat-card stat-card--lavender">
      <div class="stat-icon" aria-hidden="true">📅</div>
      <div class="stat-value" id="this-year">0</div>
      <div class="stat-label">This Year</div>
    </div>
  </section>
</main>
```

Each stat card has a modifier class like `stat-card--fire` that gives it a unique tint color. Neo-brutalism loves bold, distinct color blocks!

### Modal, Tooltip, and Footer

Finally, add the "Add Habit" modal, a tooltip element, and the footer:

```html
<!-- Add Habit Modal -->
<div class="modal-overlay" id="modal-overlay" role="dialog" aria-modal="true" aria-label="Add new habit">
  <div class="modal" id="modal">
    <div class="modal-header">
      <h2>✨ Add New Habit</h2>
      <button class="modal-close" id="modal-close" aria-label="Close dialog">&times;</button>
    </div>
    <div class="modal-body">
      <label class="input-label" for="habit-name">Habit Name</label>
      <input type="text" id="habit-name" class="text-input" placeholder="e.g., Morning Run" maxlength="24" autocomplete="off">
      <label class="input-label">Choose an Emoji</label>
      <div class="emoji-grid" id="emoji-grid">
        <!-- Emoji options rendered by JavaScript -->
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary" id="modal-add">Add Habit</button>
    </div>
  </div>
</div>

<!-- Tooltip (positioned by JS) -->
<div class="tooltip" id="tooltip" role="tooltip">
  <span id="tooltip-text"></span>
</div>

<!-- Footer -->
<footer class="footer">
  <p>Built with 💚 using HTML, CSS &amp; JavaScript</p>
</footer>
```

The modal starts **hidden** (we'll control visibility via CSS + JS). The tooltip is a floating element we'll position with JavaScript on hover.

If you open `index.html` now, you'll see raw unstyled HTML. Time to make it gorgeous! ✨

---

## Step 3: Neo-Brutalism CSS — The Design System 🎨

Neo-brutalism is a design trend characterized by:
- **Thick, visible borders** on everything
- **Hard shadows** (no blur, just solid offset)
- **Bold typography** and chunky elements
- **Bright, flat colors** — no gradients
- **Playful energy** — buttons that feel like you're physically pushing them

Open `style.css` and let's build our design system.

### Reset & Design Tokens

```css
/* --- Reset --- */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* --- Design Tokens --- */
:root {
  /* Canvas (warm cream background) */
  --bg-canvas: #FBF7F0;
  --bg-card: #FFFFFF;

  /* Neo-Brutalism: thick borders + hard shadows */
  --border-color: #2B2B2B;
  --border-width: 2.5px;
  --shadow-color: #2B2B2B;
  --shadow-sm: 3px 3px 0 #2B2B2B;
  --shadow-md: 5px 5px 0 #2B2B2B;
  --shadow-lg: 7px 7px 0 #2B2B2B;

  /* Text */
  --text-primary: #2B2B2B;
  --text-secondary: #5C5C5C;
  --text-muted: #8A8A8A;

  /* English Garden — Heatmap Palette */
  --heat-0: #EDE8E0;
  --heat-1: #B8D4B8;
  --heat-2: #7BAE7F;
  --heat-3: #3A9E4A;
  --heat-4: #1B6E2E;

  /* English Accent Colors */
  --accent-green: #2D6A4F;
  --accent-red: #C0504D;
  --accent-gold: #D4A843;
  --accent-blue: #3D5A80;
  --accent-cream: #FFF8E7;

  /* Stat Card Tints */
  --tint-fire: #FFF0E6;
  --tint-gold: #FFF8E1;
  --tint-mint: #E8F5E9;
  --tint-lavender: #EDE7F6;

  /* Grid Dimensions */
  --cell-size: 16px;
  --cell-gap: 4px;
  --cell-radius: 4px;

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Transitions — snappy for neo-brutalism */
  --transition-fast: 120ms ease;
  --transition-normal: 200ms ease;

  /* Fonts */
  --font-sans: 'Space Grotesk', -apple-system, BlinkMacSystemFont,
               'Segoe UI', Helvetica, Arial, sans-serif;
  --font-mono: 'Space Mono', 'SF Mono', 'Cascadia Code', monospace;
}
```

**Why CSS custom properties?** They let us define our entire color palette and spacing in one place. If you want to tweak the green accent or increase border thickness, you change **one line** and the whole app updates. This is called a **design token** system.

**Why these colors?** The palette is inspired by the English countryside — warm cream (`#FBF7F0`), forest green (`#2D6A4F`), burgundy (`#C0504D`), mustard gold (`#D4A843`), and navy (`#3D5A80`). Rich but not flashy.

### Base Styles

```css
html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-canvas);
  color: var(--text-primary);
  min-height: 100vh;
  line-height: 1.5;
}
```

### The Accent Bar

That colorful stripe at the top of the page:

```css
.accent-bar {
  height: 8px;
  background: linear-gradient(
    90deg,
    var(--accent-green) 0%,   var(--accent-green) 25%,
    var(--accent-gold) 25%,   var(--accent-gold) 50%,
    var(--accent-red) 50%,    var(--accent-red) 75%,
    var(--accent-blue) 75%,   var(--accent-blue) 100%
  );
}
```

This is a hard-stop gradient — no blending between colors. Each color gets exactly 25% of the bar. Super clean, very neo-brutalism. 🎯

### Header

```css
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 60px;
}

.header {
  padding: 40px 24px 28px;
}

.header-content {
  max-width: 960px;
  margin: 0 auto;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 16px;
}

/* The emoji badge — thick border + hard shadow */
.logo-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  font-size: 28px;
  background: var(--accent-cream);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.logo h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
  display: inline-block;
}

/* Yellow highlight under the title — a classic neo-brutalism technique */
.logo h1::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: -2px;
  right: -2px;
  height: 10px;
  background: var(--accent-gold);
  opacity: 0.35;
  z-index: -1;
  border-radius: 2px;
}

.tagline {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}
```

The `h1::after` pseudo-element creates a translucent yellow highlight bar behind the title text. It looks like someone took a highlighter pen to the heading — very fun, very neo-brutalist!

### Habit Pills

```css
.habit-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.habit-pills {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.habit-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border: 2px solid var(--border-color);
  border-radius: 100px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--shadow-color);
  transition: transform var(--transition-fast),
              box-shadow var(--transition-fast),
              background var(--transition-fast),
              color var(--transition-fast);
  user-select: none;
}

/* Hover: lift up and grow shadow */
.habit-pill:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--shadow-color);
  color: var(--text-primary);
}

/* Active habit: filled green */
.habit-pill.active {
  background: var(--accent-green);
  color: #FFFFFF;
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--shadow-color);
}

/* Click: push down */
.habit-pill:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 var(--shadow-color);
}
```

**The neo-brutalism button trick:** On hover, the element moves up-left (`translate(-1px, -1px)`) while the shadow grows. On click (`:active`), it moves down-right and the shadow shrinks. This creates a physical **"push" feeling** — like pressing a real button! 🎮

The "Add Habit" button uses a **dashed border** that becomes solid on hover:

```css
.add-habit-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border: 2px dashed var(--border-color);
  border-radius: 100px;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-habit-btn:hover {
  border-style: solid;
  color: var(--accent-green);
  background: var(--tint-mint);
  box-shadow: 2px 2px 0 var(--shadow-color);
  transform: translate(-1px, -1px);
}
```

---

## Step 4: Styling the Heatmap Grid 📊

This is where CSS Grid really shines. The heatmap is a 7-row × 53-column grid:

```css
.heatmap-card {
  background: var(--bg-card);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-md);
}

/* Dashed separator between title and grid */
.heatmap-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 2px dashed var(--border-color);
}

/* Horizontal scroll for mobile */
.heatmap-scroll {
  overflow-x: auto;
  overflow-y: hidden;
}

/* Month labels positioned absolutely */
.heatmap-months {
  position: relative;
  height: 22px;
  margin-bottom: 6px;
  padding-left: 44px; /* aligns with the grid (past the day labels) */
  min-width: max-content;
}

.month-label {
  position: absolute;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
}

/* Day labels + grid sit side by side */
.heatmap-body {
  display: flex;
  min-width: max-content;
}

.heatmap-days {
  display: grid;
  grid-template-rows: repeat(7, var(--cell-size));
  gap: var(--cell-gap);
  width: 44px;
  flex-shrink: 0;
}

.heatmap-days span {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  height: var(--cell-size);
  text-transform: uppercase;
}
```

**The actual grid** — this is the magic:

```css
.heatmap-grid {
  display: grid;
  grid-template-rows: repeat(7, var(--cell-size));
  grid-auto-flow: column;
  grid-auto-columns: var(--cell-size);
  gap: var(--cell-gap);
}
```

Let's break this down:

1. `grid-template-rows: repeat(7, 16px)` — 7 rows (one per day of the week: Sun–Sat)
2. `grid-auto-flow: column` — **this is the key!** Instead of filling left-to-right row by row, the grid fills **top-to-bottom column by column**. Each column = one week.
3. `grid-auto-columns: 16px` — each auto-generated column is 16px wide (one cell)
4. `gap: 4px` — spacing between cells

So when we append 365+ `<div>` elements to this grid, they automatically flow into a 7×53 grid — 7 days high, ~53 weeks wide. No manual positioning needed! 🎯

### Cell Styles

```css
.heatmap-cell {
  width: var(--cell-size);
  height: var(--cell-size);
  border-radius: var(--cell-radius);
  border: 1.5px solid rgba(43, 43, 43, 0.12);
  background-color: var(--heat-0);
  cursor: pointer;
  transition: transform var(--transition-fast),
              background-color var(--transition-fast),
              box-shadow var(--transition-fast);
  animation: cell-appear 0.35s ease both;
}

/* Color intensity levels — styled via data attributes */
.heatmap-cell[data-level="0"] { background-color: var(--heat-0); }
.heatmap-cell[data-level="1"] { background-color: var(--heat-1); }
.heatmap-cell[data-level="2"] { background-color: var(--heat-2); }
.heatmap-cell[data-level="3"] { background-color: var(--heat-3); }
.heatmap-cell[data-level="4"] { background-color: var(--heat-4); }

/* Neo-brutalism hover: lift + shadow */
.heatmap-cell:hover {
  transform: translate(-1px, -1px) scale(1.35);
  box-shadow: 2px 2px 0 var(--shadow-color);
  border-color: var(--border-color);
  z-index: 2;
}
```

We're using **CSS attribute selectors** (`[data-level="3"]`) to color cells based on their `data-level` attribute. When JavaScript updates the attribute, the color changes automatically. No class toggling needed!

### Stats Cards

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--bg-card);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px 16px;
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.stat-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: var(--shadow-lg);
}

/* Each card gets a unique pastel tint */
.stat-card--fire     { background: var(--tint-fire); }     /* Warm peach */
.stat-card--gold     { background: var(--tint-gold); }     /* Soft gold */
.stat-card--mint     { background: var(--tint-mint); }     /* Light mint */
.stat-card--lavender { background: var(--tint-lavender); } /* Soft purple */

.stat-value {
  font-family: var(--font-mono);
  font-size: 36px;
  font-weight: 700;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
  color: var(--text-secondary);
}
```

### Modal, Tooltip, and Animations

I'll spare you the full CSS for the modal (you can find it in the complete source code), but here are the key patterns:

**Modal with neo-brutalism shadow:**
```css
.modal {
  background: var(--bg-card);
  border: 3px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: 8px 8px 0 var(--shadow-color);
  transform: translateY(20px) scale(0.95);
  transition: transform var(--transition-normal);
}

/* Animate in when overlay is active */
.modal-overlay.active .modal {
  transform: translateY(0) scale(1);
}
```

**Staggered cell entrance animation:**
```css
@keyframes cell-appear {
  from { opacity: 0; transform: scale(0); }
  to   { opacity: 1; transform: scale(1); }
}

/* Each cell gets animation-delay set by JS for a wave effect */
.heatmap-cell {
  animation: cell-appear 0.35s ease both;
}
```

**Click pop feedback:**
```css
@keyframes cell-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.6); }
  100% { transform: scale(1); }
}

.heatmap-cell.pop {
  animation: cell-pop 0.25s ease;
}
```

**Responsive breakpoints:**
```css
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .habit-pills {
    overflow-x: auto;
    flex-wrap: nowrap;
  }
}
```

On mobile, stats cards go from 4 columns to 2, and habit pills become horizontally scrollable.

> 💡 **Tip:** Copy the complete `style.css` from the [source code](style.css) for all styles including the modal, tooltip, floating indicator, and responsive breakpoints. The patterns above teach you the _why_ — the full file gives you every detail.

---

## Step 5: JavaScript — State & Dates 🧠

Now we bring it to life! Open `app.js`.

### Constants

```javascript
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

/** Human-readable activity level names */
const LEVEL_NAMES = [
  'No activity',    // 0
  'Light',          // 1
  'Moderate',       // 2
  'Strong',         // 3
  'Intense 💪',     // 4
];
```

We start with three default habits and a curated set of 20 emojis for the emoji picker.

### State Management

Our app's state is a single JavaScript object. We load it from `localStorage` on startup:

```javascript
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

  // Fresh state with default habits
  const entries = {};
  DEFAULT_HABITS.forEach(h => (entries[h.id] = {}));
  return {
    habits: DEFAULT_HABITS.map(h => ({ ...h })),
    activeHabitId: DEFAULT_HABITS[0].id,
    entries,
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
```

**What's in the state?**
- `habits` — An array of habit objects (`{ id, name, emoji }`)
- `activeHabitId` — Which habit we're currently viewing
- `entries` — A nested object mapping `habitId → { 'YYYY-MM-DD': count }`

The `loadState()` function tries to load from `localStorage` first. If the data is missing or corrupted, it falls back to defaults. Defense in depth! 🛡️

### Date Utilities

Working with dates in JavaScript can be tricky, but we only need three functions:

```javascript
/** Format a Date as 'YYYY-MM-DD' (timezone-safe) */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a 'YYYY-MM-DD' string back into a Date */
function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Generate all dates for the heatmap (last ~53 weeks) */
function getHeatmapDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from 52 weeks before the current week's Sunday
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
```

> ⚠️ **Why not use `.toISOString()`?** Because it converts to UTC, which can shift the date by one day depending on your timezone. Our manual `formatDate()` always uses local time.

The `getHeatmapDates()` function calculates the start date by going back 52 weeks from the current week's Sunday. This ensures the grid always starts on a Sunday (row 0) and ends on today.

---

## Step 6: Rendering the Heatmap Grid 🎨

This is where the visual magic happens — turning 365 dates into a beautiful grid:

```javascript
function getActivityLevel(count) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

function getMonthLabels(dates) {
  const labels = [];
  let lastMonth = -1;
  for (let i = 0; i < dates.length; i++) {
    const month = dates[i].getMonth();
    const col = Math.floor(i / 7);
    if (month !== lastMonth) {
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
```

`getMonthLabels()` walks through all dates and records where each month begins. The `col` value tells us which grid column to place each label above.

### The Main Render Function

```javascript
function renderHeatmap() {
  const dates = getHeatmapDates();
  const grid = document.getElementById('heatmap-grid');
  const monthsContainer = document.getElementById('heatmap-months');
  const entries = state.entries[state.activeHabitId] || {};

  grid.innerHTML = '';
  monthsContainer.innerHTML = '';

  // Read cell dimensions from our CSS custom properties
  const rootStyles = getComputedStyle(document.documentElement);
  const cellSize = parseInt(rootStyles.getPropertyValue('--cell-size')) || 16;
  const cellGap = parseInt(rootStyles.getPropertyValue('--cell-gap')) || 4;
  const step = cellSize + cellGap;

  // Position month labels
  const labels = getMonthLabels(dates);
  labels.forEach(label => {
    const span = document.createElement('span');
    span.className = 'month-label';
    span.textContent = label.text;
    span.style.left = `${label.col * step}px`;
    monthsContainer.appendChild(span);
  });

  // Set container width for proper label positioning
  const totalCols = Math.ceil(dates.length / 7);
  monthsContainer.style.minWidth = `${totalCols * step}px`;

  // Create grid cells
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
    cell.style.animationDelay = `${col * 10}ms`; // wave animation

    fragment.appendChild(cell);
  });
  grid.appendChild(fragment);

  // Auto-scroll to show the most recent weeks
  const scroll = document.querySelector('.heatmap-scroll');
  if (scroll) {
    requestAnimationFrame(() => {
      scroll.scrollLeft = scroll.scrollWidth;
    });
  }

  updateStats();
}
```

**Key techniques here:**

1. **`DocumentFragment`** — We build all 365+ cells in memory first, then append them all at once. This is WAY faster than appending each cell individually (one DOM update vs. 365).

2. **`getComputedStyle`** — We read the `--cell-size` and `--cell-gap` values from CSS so month labels are perfectly aligned. The CSS is the single source of truth.

3. **`requestAnimationFrame`** — We scroll to the right after the grid renders, so the user sees the most recent weeks first.

4. **Staggered animation delay** — Each column gets a slightly longer delay (`col * 10ms`), creating a satisfying left-to-right wave effect on load.

---

## Step 7: Making It Interactive 🖱️

### Click to Log Activity

We use **event delegation** — one listener on the grid, not 365 individual listeners:

```javascript
const grid = document.getElementById('heatmap-grid');

grid.addEventListener('click', e => {
  const cell = e.target.closest('.heatmap-cell');
  if (!cell) return;

  const key = cell.dataset.date;
  const entries = state.entries[state.activeHabitId];
  const current = entries[key] || 0;
  const next = (current + 1) % 5; // Cycle: 0→1→2→3→4→0

  if (next === 0) {
    delete entries[key];
  } else {
    entries[key] = next;
  }

  // Update the cell visually
  cell.dataset.count = String(next);
  cell.dataset.level = String(getActivityLevel(next));

  // Pop animation
  cell.classList.remove('pop');
  void cell.offsetWidth; // Force reflow to restart animation
  cell.classList.add('pop');

  // Floating "+1" feedback
  if (next > 0) {
    showFloatingIndicator(cell, `+${next}`, 'up');
  } else {
    showFloatingIndicator(cell, '✕', 'down');
  }

  saveState();
  updateStats();
});
```

**Event delegation explained:** Instead of attaching a click listener to each of the 365 cells, we attach ONE listener to the parent grid. When any cell is clicked, the event **bubbles up** to the grid, and `e.target.closest('.heatmap-cell')` finds which cell was clicked. This is faster and works even when cells are dynamically created.

The `void cell.offsetWidth` trick is a classic: it forces the browser to reflow, which resets the animation so it can play again.

### Right-Click to Undo

Same pattern, but cycles the count **down**:

```javascript
grid.addEventListener('contextmenu', e => {
  const cell = e.target.closest('.heatmap-cell');
  if (!cell) return;
  e.preventDefault(); // Prevent the right-click menu

  const key = cell.dataset.date;
  const entries = state.entries[state.activeHabitId];
  const current = entries[key] || 0;
  const next = current > 0 ? current - 1 : 4;

  // ... same update logic as click handler
});
```

### Floating Indicator

That satisfying "+1" that floats up and fades away:

```javascript
function showFloatingIndicator(cell, text, direction) {
  const indicator = document.createElement('div');
  indicator.className = `float-indicator ${direction}`;
  indicator.textContent = text;

  const rect = cell.getBoundingClientRect();
  indicator.style.left = `${rect.left + rect.width / 2}px`;
  indicator.style.top = `${rect.top - 4}px`;

  document.body.appendChild(indicator);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      indicator.classList.add('animate');
    });
  });

  setTimeout(() => indicator.remove(), 550);
}
```

The double `requestAnimationFrame` is needed because we need the browser to render the element in its initial position before we add the `.animate` class that triggers the CSS transition.

### Tooltip

```javascript
function showTooltip(cell) {
  const tooltip = document.getElementById('tooltip');
  const tooltipText = document.getElementById('tooltip-text');
  const date = parseDate(cell.dataset.date);
  const count = parseInt(cell.dataset.count) || 0;
  const level = getActivityLevel(count);
  const levelName = LEVEL_NAMES[level];

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  });

  if (count === 0) {
    tooltipText.innerHTML = `<strong>No activity</strong><br>${dateStr}`;
  } else {
    tooltipText.innerHTML = `<strong>${count} × ${levelName}</strong><br>${dateStr}`;
  }

  tooltip.classList.add('visible');

  // Smart positioning: center above cell, flip below if clipped at top
  const cellRect = cell.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();
  let left = cellRect.left + cellRect.width / 2 - tipRect.width / 2;
  let top = cellRect.top - tipRect.height - 10;

  if (top < 8) top = cellRect.bottom + 10; // Flip below
  tooltip.style.left = `${Math.max(8, left)}px`;
  tooltip.style.top = `${top}px`;
}
```

The tooltip shows the **activity count**, **level name** (Light/Moderate/Strong/Intense), and the **full date**. Smart positioning ensures it never gets clipped off-screen.

---

## Step 8: Streaks, Stats & Saving Data 📈

### Calculating Streaks

The current streak counts consecutive active days backwards from today:

```javascript
function calculateCurrentStreak(entries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let d = new Date(today);
  let key = formatDate(d);

  // If no activity today, check yesterday (maybe they haven't logged yet)
  if (!(entries[key] > 0)) {
    d.setDate(d.getDate() - 1);
    if (!(entries[formatDate(d)] > 0)) return 0;
  }

  let streak = 0;
  while (entries[formatDate(d)] > 0) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
```

The longest streak uses a similar approach but checks **all** recorded dates:

```javascript
function calculateLongestStreak(entries) {
  const activeDates = Object.keys(entries)
    .filter(k => entries[k] > 0)
    .sort();

  if (activeDates.length === 0) return 0;

  let longest = 1, current = 1;
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
```

### Animated Number Counters

When stats update, the numbers don't just jump — they count up smoothly:

```javascript
function animateValue(elementId, target) {
  const el = document.getElementById(elementId);
  const from = parseInt(el.textContent) || 0;
  if (from === target) return;

  const duration = 400;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic: fast at start, decelerates toward end
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (target - from) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
```

The `1 - Math.pow(1 - progress, 3)` is an **ease-out cubic** curve — the number ticks fast at first, then slows down as it approaches the target. It feels way more satisfying than a linear count!

---

## Step 9: Habits & The Modal 🎯

### Rendering Habit Pills

```javascript
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
```

The delete button only appears when there's more than one habit (we don't want users to delete their last habit!).

### Modal Logic

```javascript
let selectedEmoji = null;

function openModal() {
  document.getElementById('modal-overlay').classList.add('active');
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
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
      btn.classList.add('selected');
      selectedEmoji = emoji;
    });
    grid.appendChild(btn);
  });
}
```

### Wiring It All Together

The `init()` function connects everything:

```javascript
function init() {
  renderHabits();
  renderHeatmap();

  // Habit pill clicks (event delegation)
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

  // Modal controls
  document.getElementById('add-habit-btn').addEventListener('click', openModal);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ... grid click/contextmenu/hover handlers (from Step 7)
}

document.addEventListener('DOMContentLoaded', init);
```

---

## You Built It! 🎉

Open `index.html` in your browser (or use a local server like `npx serve`). You should see:

✅ A colorful neo-brutalism accent bar at the top  
✅ The "Habit Heatmap" title with a gold highlight  
✅ Three habit pills (Code, Read, Exercise)  
✅ A 53-week heatmap grid with a wave entrance animation  
✅ Month labels above and day labels to the left  
✅ Click cells to cycle through 4 intensity levels with floating "+1" feedback  
✅ Live streak and stat calculations  
✅ Data that survives page refreshes (localStorage!)  
✅ A beautiful emoji picker modal for adding new habits  

---

## What We Learned 🧠

| Concept | Where We Used It |
|---------|-----------------|
| CSS Custom Properties | Design token system (colors, sizes, shadows) |
| CSS Grid (`grid-auto-flow: column`) | The heatmap grid layout |
| CSS Attribute Selectors | Coloring cells by `data-level` |
| Event Delegation | Grid clicks, habit pill clicks |
| `DocumentFragment` | Batch DOM insertion for performance |
| `requestAnimationFrame` | Smooth number animations, scroll positioning |
| `localStorage` | Persisting habit data across sessions |
| `Date` arithmetic | Streak calculations, heatmap date generation |

---

## Bonus Challenges 🏆

Want to take this further? Try these:

1. **🌙 Dark Mode Toggle** — Add a button that swaps CSS variables to a dark palette
2. **📤 Export to JSON** — Let users download their habit data as a file
3. **🎵 Sound Effects** — Play a small "pop" sound when logging activity
4. **📱 PWA** — Add a manifest and service worker to make it installable
5. **📊 Weekly Summary** — Show a bar chart of this week's activity
6. **🔗 Share Card** — Generate an image of your heatmap to share on social media

---

## Full Source Code 💻

All source code is available in this repository:
- [`index.html`](index.html) — The page structure
- [`style.css`](style.css) — Neo-brutalism styles (1000+ lines of 🎨)
- [`app.js`](app.js) — All the application logic

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Semantic page structure |
| CSS3 | Neo-brutalism design, CSS Grid, animations |
| Vanilla JavaScript | State management, DOM manipulation, localStorage |
| Google Fonts | Space Grotesk + Space Mono typography |

**Zero dependencies. Zero build tools. Just open `index.html` and go.**

---

Built with 💚 for the [Codédex](https://www.codedex.io/) Monthly Challenge.
