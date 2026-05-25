# Story Return Ritual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add first-stage experience upgrades: memory film strip, daily sheep gift, and stepped final confession ritual.

**Architecture:** Implement three self-contained React UI pieces in `src/App.jsx`, using local component state and existing chapter rendering. Add CSS-only visuals and animations to `src/styles.css`, update chapter visibility selectors, and extend tests in `src/App.test.jsx`.

**Tech Stack:** React, Vite, CSS animations, Testing Library, Vitest.

## File Structure

- `src/App.jsx`: Add `MemoryFilmStrip`, add `DailySheepGift`, replace `SheepConfessionRitual` internals with three-step ritual, and mount new components.
- `src/styles.css`: Add film strip, daily gift, and stepped ritual styles; update chapter visibility selectors.
- `src/App.test.jsx`: Add assertions for the new modules.
- `docs/superpowers/specs/2026-05-25-story-return-ritual-design.md`: Design reference.

### Task 1: Memory Film Strip

**Files:** Modify: `src/App.jsx`, `src/styles.css`, `src/App.test.jsx`

- [ ] **Step 1: Add failing test assertion**
  Add to the memory chapter test:
  ```js
  expect(screen.getByText('我们的回忆电影胶片')).toBeTruthy()
  ```

- [ ] **Step 2: Add `MemoryFilmStrip` component**
  Implement local `activeIndex` state and render three film cards with title, image, caption, and revealed note.

- [ ] **Step 3: Mount component**
  Render `<MemoryFilmStrip />` after the existing `memory-cinema-section`.

- [ ] **Step 4: Add CSS and visibility**
  Style `.memory-film-section` and include it in `.chapter-page-memory` visibility selectors.

### Task 2: Daily Sheep Gift

**Files:** Modify: `src/App.jsx`, `src/styles.css`, `src/App.test.jsx`

- [ ] **Step 1: Add failing test assertion**
  Extend sheep/gaokao test with:
  ```js
  expect(screen.getByText('今日小羊礼物')).toBeTruthy()
  expect(screen.getByText('打开今日小羊礼物')).toBeTruthy()
  ```

- [ ] **Step 2: Add `DailySheepGift` component**
  Implement local `isOpen` state and date-derived gift selection with six fixed gifts.

- [ ] **Step 3: Mount component**
  Render `<DailySheepGift />` after `<SheepComfortPasture />`.

- [ ] **Step 4: Add CSS and visibility**
  Style `.daily-sheep-gift-section` and include it in `.chapter-page-gaokao` visibility selectors.

### Task 3: Stepped Final Ritual

**Files:** Modify: `src/App.jsx`, `src/styles.css`, `src/App.test.jsx`

- [ ] **Step 1: Add failing test assertion**
  Extend final chapter test with:
  ```js
  expect(screen.getByText('点亮第一圈光')).toBeTruthy()
  ```

- [ ] **Step 2: Replace ritual behavior**
  Use `activeStep` state in `SheepConfessionRitual`, render three step buttons, and show final text after step three.

- [ ] **Step 3: Update CSS**
  Add step buttons, active rings, and final reveal styles using the existing `.sheep-ritual-section` base.

### Task 4: Verify, Commit, Push

**Files:** All modified files

- [ ] **Step 1: Run tests**
  Run `npm test -- --run`. Expected: all tests pass.

- [ ] **Step 2: Run build**
  Run `npm run build`. Expected: production build succeeds.

- [ ] **Step 3: Check status**
  Run `git status --short` and confirm intended files.

- [ ] **Step 4: Commit and push**
  Commit with `feat: 增强故事复访和告白仪式` and push to `origin main`.

## Self-Review

- Every first-stage requirement maps to a task.
- No placeholders remain.
- No new dependencies are introduced.
- Tests cover visibility for all three modules.
