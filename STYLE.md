# Beacon Docs — Style Guide

## Design system

All design tokens live in `src/styles/theme.css` as CSS custom properties on `:root`. **Edit only that file to repaint the site.** Never hardcode color hex values in component styles.

### Color tokens

```css
/* Surfaces (dark navy hierarchy) */
--bg:        #0c0e16   /* page background */
--surface:   #141720   /* topbar, sidebar, cards */
--surface-2: #1c1f2e   /* hover state backgrounds */
--border:    #232638   /* default dividers */
--border-2:  #2d3148   /* stronger dividers, 404 heading */

/* Text */
--text:      #d8daf0   /* primary */
--muted:     #616480   /* secondary, article meta */
--muted-2:   #8486a8   /* tertiary, sidebar labels, topbar links */

/* Accent / status */
--accent:        #4e7ef7   /* links, active states, buttons */
--accent-hover:  #6b93f8
--accent-subtle: rgba(78,126,247,0.10)  /* active nav item background */
--accent-purple: #863bff   /* logo color */
--teal:          #2dcfa0   /* success / online status */
--amber:         #f0a840   /* warning */
--red:           #e8566a   /* error / offline status */
```

### Layout tokens

```css
--sidebar-w:  260px   /* left nav width */
--topbar-h:   52px    /* topbar height (used in sticky positioning) */
--content-w:  760px   /* article prose max-width */
--toc-w:      200px   /* table of contents width */
```

### Shape & elevation

```css
--r-card:  8px    /* card border-radius */
--r-btn:   5px    /* button border-radius */
--r-sm:    4px    /* small elements (code badges, etc.) */

--shadow:    0 2px 8px rgba(0,0,0,.4), 0 1px 2px rgba(0,0,0,.3)
--shadow-sm: 0 1px 3px rgba(0,0,0,.3)
```

### Typography

```css
--font:  -apple-system, 'Segoe UI', system-ui, sans-serif
--mono:  'SF Mono', 'Cascadia Code', 'Consolas', monospace
```

---

## Layout patterns

### Page layouts (3 levels)

```
BaseLayout    → <html> + <head> + global CSS import
  KBLayout    → sidebar (260px) + main column (flex row)
    ArticleLayout → prose (max 760px) + optional TOC (200px)
```

- `KBLayout` is a flex row: sidebar is `position: sticky; top: 0; height: 100vh`
- Article content area is `flex: 1; min-width: 0; overflow-y: auto`

### Landing page grid

```css
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
/* 2-col at 960px, 1-col at 600px */
```

### Topbar

- Height: `var(--topbar-h)` = 52px
- Background: `var(--surface)` with `border-bottom: 1px solid var(--border)`
- `position: sticky; top: 0; z-index: 10`
- Inner max-width: 1200px, padding: 0 32px

---

## Component patterns

### CategoryCard

- Flex column, `gap: 8px`, `background: var(--surface)`, `border-radius: var(--r-card)`
- Hover: `border-color: var(--accent)`, `translateY(-2px)`, `box-shadow: var(--shadow)`
- Icon: 32×32px, `color: var(--accent)`
- Title: 15px, weight 600, `color: var(--text)`
- Description: 13px, `color: var(--muted)`
- Article count meta: 11px, `color: var(--muted)`
- **href must point to the first article in the category** — not `/kb/{slug}/`

### Sidebar nav

- Category headers: 11px, weight 700, letter-spacing 0.06em, uppercase, `color: var(--muted-2)`
- Uses `<details>`/`<summary>` for collapse — auto-opened when category is active
- Chevron rotates 90° when `[open]` via CSS `transform`
- Article links: 13px, `color: var(--muted-2)`, `padding: 5px 14px 5px 26px`
- Active article: `color: var(--accent)`, `background: var(--accent-subtle)`, `border-left: 2px solid var(--accent)`

### Buttons / CTAs

- Primary: `background: var(--accent)`, `color: #fff`, `border-radius: var(--r-btn)`
- Hover: `opacity: 0.85`
- Font size: 14px, weight 500

### Brand / logo mark

- Format: "Beacon" (bold, `--text`) + `<em>` "Docs" (normal weight, `--muted-2`)
- `em` tag is styled `font-style: normal` — it's purely a semantic slot for the secondary word

---

## CSS conventions

- All component styles are **scoped Astro styles** — no global class leakage
- Never hardcode colors — always use `var(--token)`
- No Tailwind, no utility classes
- Transition duration: `0.15s` for layout/card effects, `0.1s` for color-only transitions, `0.18s` for chevron rotate
- Scrollbar styling: `scrollbar-width: thin; scrollbar-color: var(--border) transparent`
- `data-pagefind-ignore` on all non-article elements (topbar, sidebar, hero, footer) to keep search results clean
- `data-pagefind-body` on the article prose container to tell Pagefind which pages to index

---

## Article markdown conventions

- Frontmatter requires: `title`, `category`, `order`, `updated`
- Stub articles include: `> **This article is a stub.**` callout at the top of body
- Cross-links use root-relative paths: `/kb/category/article-slug/`
- Code blocks use fenced triple-backtick with language hint
- H2 headings generate TOC entries (H3+ are not included in TOC by default)
