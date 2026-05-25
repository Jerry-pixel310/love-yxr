# Mobile Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Improve mobile layout, spacing, and touch comfort across the romantic letter site.

**Architecture:** Make CSS-only responsive refinements in `src/styles.css` without changing routing, state, or component behavior. Focus on small-screen ergonomics for navigation, home cards, sheep easter egg, memory film strip, sheep pasture, daily gift, final ritual, keepsake card, and form/buttons.

**Tech Stack:** CSS media queries, React app unchanged, Vite build, Vitest smoke tests.

## File Structure

- `src/styles.css`: Add mobile-first refinements and reduced-motion safeguards.
- `docs/superpowers/plans/2026-05-25-mobile-polish.md`: This implementation plan.

### Task 1: Mobile navigation and page spacing

**Files:** Modify: `src/styles.css`

- [ ] **Step 1: Refine page padding under 760px**
  Add mobile overrides for `.letter-page`, `.chapter-page-header`, `.letter-body`, and `.home-directory` to reduce horizontal overflow and keep readable spacing.

- [ ] **Step 2: Improve chapter nav touch targets**
  Add mobile overrides for `.chapter-nav` and `.chapter-nav-item` so buttons remain large enough and horizontally scrollable if needed.

- [ ] **Step 3: Improve home cards**
  Add mobile overrides for `.home-chapter-card`, `.home-chapter-icon`, `.home-guide` to reduce cramped layout.

### Task 2: Mobile module polish

**Files:** Modify: `src/styles.css`

- [ ] **Step 1: Refine sheep easter egg**
  Move `.sheep-home-egg` slightly inward and shrink bubble on small screens so it does not cover navigation/content.

- [ ] **Step 2: Refine memory film strip**
  Under 760px, make `.memory-film-strip` single-column and reduce image height.

- [ ] **Step 3: Refine sheep pasture and daily gift**
  Ensure `.sheep-pasture-stage`, `.daily-sheep-gift-box`, and action buttons fit narrow screens.

- [ ] **Step 4: Refine final ritual and keepsake card**
  Ensure `.sheep-ritual-steps`, `.sheep-keepsake-card`, and `.keepsake-actions` stack cleanly.

### Task 3: Accessibility and motion comfort

**Files:** Modify: `src/styles.css`

- [ ] **Step 1: Add reduced motion overrides**
  Add `@media (prefers-reduced-motion: reduce)` for the heaviest new animations: sheep float, film projector sweep, entry effect, keepsake twinkle.

- [ ] **Step 2: Improve touch action**
  Add `touch-action: manipulation` to frequently tapped buttons/cards in mobile context.

### Task 4: Verify and ship

**Files:** All modified files

- [ ] **Step 1: Run tests**
  Run `npm test -- --run`. Expected: all tests pass.

- [ ] **Step 2: Run build**
  Run `npm run build`. Expected: build succeeds.

- [ ] **Step 3: Commit and push**
  Commit with `style: 优化移动端体验` and push to `origin main`.

## Self-Review

- Plan is CSS-focused and avoids behavior changes.
- Scope directly addresses mobile ergonomics.
- Verification remains tests and production build.
