# Sheep Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add a three-layer sheep-themed experience: home easter egg, gaokao comfort pasture, and final confession ritual.

**Architecture:** Implement three self-contained React components inside `src/App.jsx`, each owning local interaction state. Style the visual language in `src/styles.css` with CSS-only sheep, pasture, moon, cloud, stars, and glow animations. Extend existing tests in `src/App.test.jsx` to assert the new modules render without changing navigation behavior.

**Tech Stack:** React, Vite, CSS animations, Testing Library, Vitest.

## File Structure

- `src/App.jsx`: Add `SheepHomeEasterEgg`, `SheepComfortPasture`, and `SheepConfessionRitual`; mount them in home, gaokao, and final sections.
- `src/styles.css`: Add all sheep visual styles and animations.
- `src/App.test.jsx`: Add assertions for the sheep home easter egg and gaokao pasture rendering.
- `docs/superpowers/specs/2026-05-22-sheep-theme-design.md`: Design reference for this feature.

### Task 1: Add React components

**Files:** Modify: `src/App.jsx`

- [ ] **Step 1: Add `SheepHomeEasterEgg`**
  Create a component with local `tapCount` state, a floating sheep button, tooltip text, and decorative burst spans shown after multiple taps.

- [ ] **Step 2: Add `SheepComfortPasture`**
  Create a section component with local `messageIndex` and `activeMoment` state. It should render title `小羊宝宝的安心牧场`, sheep, moon, stars, comfort copy, and three interactive controls.

- [ ] **Step 3: Add `SheepConfessionRitual`**
  Create a section component with local `isActivated` state. It should render title `把小羊宝宝抱进心里`, a glowing sheep, activation button, and final copy after activation.

- [ ] **Step 4: Mount components**
  Render `SheepHomeEasterEgg` on the home page, `SheepComfortPasture` after `<GaokaoCheer />`, and `SheepConfessionRitual` after the final text section.

### Task 2: Add visual styling

**Files:** Modify: `src/styles.css`

- [ ] **Step 1: Style shared sheep shape**
  Add CSS classes for `.sheep-figure`, body, head, ears, wool dots, legs, and face.

- [ ] **Step 2: Style home easter egg**
  Add fixed bottom-right floating cloud/sheep styles, tooltip, burst particles, and hover/tap motion.

- [ ] **Step 3: Style comfort pasture**
  Add starry pasture section, moon, clickable stars, grass, flowers, message card, and hug glow.

- [ ] **Step 4: Style final ritual**
  Add heart orbit, luminous sheep stage, activated glow state, final message reveal, and responsive rules.

### Task 3: Update tests and verify

**Files:** Modify: `src/App.test.jsx`

- [ ] **Step 1: Add home easter egg assertion**
  In the cover/home flow test, assert text `小羊宝宝的安心牧场已经亮灯啦` appears after entering home.

- [ ] **Step 2: Add gaokao pasture assertion**
  Add or extend a test that opens `给你加油` via home card `给你加油` and asserts `小羊宝宝的安心牧场`.

- [ ] **Step 3: Run tests**
  Run `npm test -- --run`. Expected: all tests pass.

- [ ] **Step 4: Run production build**
  Run `npm run build`. Expected: build succeeds.

### Task 4: Commit and push

**Files:** All modified files

- [ ] **Step 1: Check git status**
  Run `git status --short` and confirm only intended files are modified.

- [ ] **Step 2: Commit**
  Commit with message `feat: 添加小羊主题互动设计`.

- [ ] **Step 3: Push**
  Push to `origin main`.

## Self-Review

- Every requested layer maps to a concrete task.
- No new dependencies are required.
- Existing routing and chapter entry effects remain unchanged.
- Tests cover at least home and gaokao visibility while existing tests continue to cover play modules.
