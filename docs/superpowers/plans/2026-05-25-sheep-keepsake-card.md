# Sheep Keepsake Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add a screenshot-friendly sheep keepsake card to the final chapter.

**Architecture:** Add a self-contained `SheepKeepsakeCard` React component in `src/App.jsx` with local state for active blessing and lit state. Style the card in `src/styles.css`, include it in final chapter visibility selectors, and extend the final chapter test in `src/App.test.jsx`.

**Tech Stack:** React, Vite, CSS animations, Testing Library, Vitest.

## File Structure

- `src/App.jsx`: Add `SheepKeepsakeCard` component and render after `SheepConfessionRitual`.
- `src/styles.css`: Add keepsake card visual styles and final chapter visibility selector.
- `src/App.test.jsx`: Add assertions for keepsake card text.
- `docs/superpowers/specs/2026-05-25-sheep-keepsake-card-design.md`: Design reference.

### Task 1: Add keepsake card component

**Files:** Modify: `src/App.jsx`

- [ ] **Step 1: Add `SheepKeepsakeCard` component**
  The component should render title `小羊专属纪念卡`, name `杨星冉宝宝`, current date, blessing text, CSS sheep, and two buttons: `换一句今日祝福` and `点亮纪念卡`.

- [ ] **Step 2: Add stable date blessing**
  Use `new Date().toISOString().slice(0, 10).replaceAll('-', '')` to select an initial blessing from a fixed array.

- [ ] **Step 3: Mount component**
  Render `<SheepKeepsakeCard />` immediately after `<SheepConfessionRitual />` in the final chapter.

### Task 2: Add visual styles

**Files:** Modify: `src/styles.css`

- [ ] **Step 1: Add `.sheep-keepsake-section` layout**
  Use centered layout, soft pink/cream background, rounded card, and screenshot-friendly width.

- [ ] **Step 2: Add lit state styles**
  Add `.sheep-keepsake-section.is-lit` glow, star particles, and card highlight.

- [ ] **Step 3: Add final chapter visibility selector**
  Add `.chapter-page-final .sheep-keepsake-section` to the existing final chapter display selector.

### Task 3: Update tests and verify

**Files:** Modify: `src/App.test.jsx`

- [ ] **Step 1: Add assertions**
  Extend final chapter test with:
  ```js
  expect(screen.getByText('小羊专属纪念卡')).toBeTruthy()
  expect(screen.getByText('可以截图保存这一张小小的偏爱证明')).toBeTruthy()
  ```

- [ ] **Step 2: Run tests**
  Run `npm test -- --run`. Expected: all tests pass.

- [ ] **Step 3: Run build**
  Run `npm run build`. Expected: production build succeeds.

### Task 4: Commit and push

**Files:** All modified files

- [ ] **Step 1: Check status**
  Run `git status --short`.

- [ ] **Step 2: Commit**
  Commit with message `feat: 添加小羊专属纪念卡`.

- [ ] **Step 3: Push**
  Push to `origin main`.

## Self-Review

- Keepsake card scope is limited and clear.
- No external dependencies are introduced.
- Test checks the final chapter user-visible content.
- Existing routing and chapter entry effects remain unchanged.
