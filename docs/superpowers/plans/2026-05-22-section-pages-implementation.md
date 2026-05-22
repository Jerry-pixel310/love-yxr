# Section Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** 将长卷轴情书改造成首页目录加独立章节页的复式浏览体验。

**Architecture:** 保持 React + Vite 单页应用，不新增路由依赖。继续使用 `App.jsx` 内部 `page` 状态切换页面，新增首页目录和统一章节外壳，把现有内容按章节拆到不同渲染分支。

**Tech Stack:** React 18, Vite, CSS animations, existing `letterConfig`, existing component split under `src/components`.

## File Map

- Modify `src/App.jsx`: 扩展 `page` 状态，新增首页目录、章节页外壳、章节内容渲染分支。
- Modify `src/components/letter/ChapterNav.jsx`: 从锚点链接改为内部章节导航按钮。
- Modify `src/styles.css`: 新增首页目录、章节页外壳、返回按钮、章节卡片样式。
- No new dependencies.

### Task 1: 改造章节导航为内部页面切换

**Files:** Modify: `src/components/letter/ChapterNav.jsx`, `src/App.jsx`

- [ ] **Step 1: Update `ChapterNav` props**
  Change signature to `function ChapterNav({ activeChapter, onNavigate })`.

- [ ] **Step 2: Replace anchor links with chapter keys**
  Use this chapter list:
  ```js
  const chapters = [
    { key: 'letter', icon: '💌', label: '信' },
    { key: 'memory', icon: '🌸', label: '回忆' },
    { key: 'gaokao', icon: '⭐', label: '加油' },
    { key: 'play', icon: '🎁', label: '机关' },
    { key: 'effects', icon: '✨', label: '特效' },
    { key: 'final', icon: '💗', label: '最后' },
  ]
  ```

- [ ] **Step 3: Render buttons**
  Each item renders a `<button type="button" className="chapter-nav-item ...">` and calls `onNavigate(chapter.key)`.

- [ ] **Step 4: Update `App.jsx` usage**
  Replace existing `ChapterNav onEffectsClick` usage with `ChapterNav activeChapter={page} onNavigate={goToPage}`.

- [ ] **Step 5: Add navigation helper**
  Add `goToPage(nextPage)` in `App` that records activity and calls `setPage(nextPage)`.

- [ ] **Step 6: Build verify**
  Run: `npm run build`
  Expected: build succeeds.

### Task 2: 新增首页目录页面

**Files:** Modify: `src/App.jsx`, `src/styles.css`

- [ ] **Step 1: Change successful gate target**
  In `handleSubmit`, after transition set page to `home` instead of `letter`.

- [ ] **Step 2: Add `HomeChapterCard` component**
  Create an inline component in `App.jsx` with props `icon`, `title`, `text`, `onClick`.

- [ ] **Step 3: Add `HomePage` render branch**
  In `App`, when `page === 'home'`, render music, atmosphere, welcome copy, `ChapterNav`, and six chapter cards.

- [ ] **Step 4: Keep all cards wired**
  Cards call `goToPage('letter')`, `goToPage('memory')`, `goToPage('gaokao')`, `goToPage('play')`, `goToPage('effects')`, `goToPage('final')`.

- [ ] **Step 5: Add CSS for home directory**
  Add styles for `.home-page`, `.home-hero`, `.home-chapter-grid`, `.home-chapter-card`.

- [ ] **Step 6: Build verify**
  Run: `npm run build`
  Expected: build succeeds.

### Task 3: 新增章节页外壳和返回首页

**Files:** Modify: `src/App.jsx`, `src/styles.css`

- [ ] **Step 1: Add `ChapterPageShell` component**
  Props: `kicker`, `title`, `subtitle`, `activeChapter`, `onBack`, `onNavigate`, `children`.

- [ ] **Step 2: Shell renders common layout**
  Include `Particles`, `MusicButton`, `ChapterNav`, top back button, title block, and children.

- [ ] **Step 3: Add back behavior**
  Back button calls `onBack`, and `onBack` sets page to `home` and records activity.

- [ ] **Step 4: Add shell CSS**
  Add `.chapter-page`, `.chapter-page-header`, `.chapter-back-btn`, `.chapter-page-body`.

- [ ] **Step 5: Build verify**
  Run: `npm run build`
  Expected: build succeeds.

### Task 4: 拆分现有长页面内容到章节分支

**Files:** Modify: `src/App.jsx`

- [ ] **Step 1: Letter chapter branch**
  `page === 'letter'` renders opening text and `letterConfig.sections` text content inside `ChapterPageShell`.

- [ ] **Step 2: Memory chapter branch**
  `page === 'memory'` renders photos and memory/video sections inside `ChapterPageShell`.

- [ ] **Step 3: Gaokao chapter branch**
  `page === 'gaokao'` renders gaokao encouragement and star collection content inside `ChapterPageShell`.

- [ ] **Step 4: Play chapter branch**
  `page === 'play'` renders secret envelopes, quiz, time capsule, and playful interaction content inside `ChapterPageShell`.

- [ ] **Step 5: Final chapter branch**
  `page === 'final'` renders final text, heart burst, confession prelude, reply form, and easter egg content inside `ChapterPageShell`.

- [ ] **Step 6: Effects branch return target**
  Existing `EffectsShowcase` returns to `home` instead of `letter`.

- [ ] **Step 7: Remove old all-in-one letter branch**
  Remove or stop rendering the old long `letter-page` branch after each chapter branch is present.

- [ ] **Step 8: Build verify**
  Run: `npm run build`
  Expected: build succeeds.

### Task 5: Final verification and deployment

**Files:** Modify: none unless verification finds a bug.

- [ ] **Step 1: Check git diff**
  Run: `git diff --stat`
  Expected: changes are limited to `App.jsx`, `ChapterNav.jsx`, `styles.css`, and plan/spec docs.

- [ ] **Step 2: Production build**
  Run: `npm run build`
  Expected: build succeeds.

- [ ] **Step 3: Commit implementation**
  Run: `git add -A`, then `git commit -m "feat: 改造为复式章节页面体验"`.

- [ ] **Step 4: Push**
  Run: `git push origin main`.

- [ ] **Step 5: Manual smoke test**
  Verify these flows after deployment or local preview:
  - 暗号进入后到首页目录。
  - 点击六个导航项能进入对应章节。
  - 每个章节能返回首页。
  - 特效页返回首页。
  - 告白弹窗仍需通过入口打开。
