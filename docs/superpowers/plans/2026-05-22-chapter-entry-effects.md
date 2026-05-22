# Chapter Entry Effects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add a distinctive full-screen entry animation before each chapter opens.

**Architecture:** Keep the existing internal page switching model. Add a single React overlay component driven by a `chapterTransition` state, and update `goToPage` so chapter navigation triggers the overlay before calling `setPage`.

**Tech Stack:** React, Vite, CSS animations, Vitest/Testing Library.

### Task 1: Add transition state and navigation delay

**Files:** Modify: `src/App.jsx`

- [ ] Add `chapterTransition` state with `{ page, title }` shape or `null`.
- [ ] Add a `CHAPTER_ENTRY_EFFECTS` map for `letter`, `memory`, `gaokao`, `play`, `effects`, and `final`.
- [ ] Update `goToPage(nextPage)` so home navigation switches immediately, while chapter navigation sets `chapterTransition`, delays `setPage(nextPage)` briefly, then clears the transition.
- [ ] Keep activity logging and `window.scrollTo` behavior.

### Task 2: Add reusable full-screen effect component

**Files:** Modify: `src/App.jsx`

- [ ] Create `ChapterEntryEffect({ effect })` above `App`.
- [ ] Render themed particles based on `effect.type`.
- [ ] Render the overlay in `home`, chapter pages, and the standalone `effects` page if needed.

### Task 3: Add styles and keyframes

**Files:** Modify: `src/styles.css`

- [ ] Add fixed full-screen overlay styles.
- [ ] Add variants for letter, memory, gaokao, play, effects, and final.
- [ ] Add responsive-safe animation timing and `pointer-events` handling.

### Task 4: Update tests and verify

**Files:** Modify: `src/App.test.jsx` if needed

- [ ] Ensure tests still navigate to chapters successfully.
- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Commit and push.
