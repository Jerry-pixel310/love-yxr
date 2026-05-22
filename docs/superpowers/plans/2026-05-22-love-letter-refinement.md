# Love Letter Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** 打磨 love-letter-ranran 为更高级、更顺滑、更有故事节奏的互动情书网站。

**Architecture:** 现有项目是 React + Vite 单页应用，主要 UI 和交互集中在 `src/App.jsx`，全局样式集中在 `src/styles.css`，文案配置在 `src/data/letter.js`。优化将优先保持现有架构稳定，先做低风险视觉和体验优化，再逐步处理性能资源和组件拆分。

**Tech Stack:** React 18, Vite, CSS animations, Netlify static deployment.

### Task 1: 第一阶段视觉与结构清理

**Files:** Modify: `src/App.jsx`, `src/styles.css`

- [ ] **Step 1: 增加章节导航组件**
  在 `src/App.jsx` 中添加 `ChapterNav`，提供信封、回忆、高考、机关、特效、最终章的快速跳转。

- [ ] **Step 2: 为主要章节增加 anchor id**
  在章节附近增加稳定 `id`，让导航可以滚动到对应章节。

- [ ] **Step 3: 收敛 Chapter 05 正文特效展示**
  从正文移除 5 个完整特效组件，只保留一个高级入口卡片；独立特效页保留全部特效。

- [ ] **Step 4: 降低全局背景粒子干扰**
  减少 `Particles` 生成数量，优化粒子符号为星光和爱心。

- [ ] **Step 5: 优化章节分隔视觉**
  调整 `.chapter-divider` 的留白、边框、背景、水印和装饰层级。

- [ ] **Step 6: 构建验证**
  Run: `npm run build`
  Expected: build succeeds.

- [ ] **Step 7: 提交并推送**
  Run: `git add -A`, `git commit -m "design: 优化页面结构和视觉节奏"`, `git push origin main`.

### Task 2: 第二阶段特效页重构

**Files:** Modify: `src/App.jsx`, `src/styles.css`

- [ ] **Step 1: 优化 EffectsShowcase 页面布局**
  将特效页改为更明确的深色星空体验页，增强返回情书和特效分区。

- [ ] **Step 2: 统一特效开启/关闭交互**
  每个特效提供一致的开始、关闭、提示文案和移动端安全高度。

- [ ] **Step 3: 构建验证并推送**
  Run: `npm run build`; commit and push.

### Task 3: 第三阶段性能深度优化

**Files:** Modify: `src/data/letter.js`, `public`, maybe `src/App.jsx`

- [ ] **Step 1: 清理未引用视频文件**
  保留当前配置引用的视频，移除未使用的 original/compatible 重复版本。

- [ ] **Step 2: 图片转 WebP 并更新引用**
  将大 JPG 转为 WebP，更新 `letter.js` 和 JSX 中的引用。

- [ ] **Step 3: 字体转 WOFF2 或移除未用字体**
  保留必要展示字体，避免部署 18MB TTF。

- [ ] **Step 4: 构建验证并推送**
  Run: `npm run build`; commit and push.

### Task 4: 第四阶段组件拆分与维护性优化

**Files:** Create: `src/components/**`, Modify: `src/App.jsx`

- [ ] **Step 1: 拆分 effects 组件**
  将 5 个特效组件移动到 `src/components/effects`。

- [ ] **Step 2: 拆分通用 UI 组件**
  将音乐、照片卡片、章节分隔、导航等移动到 `src/components/letter`。

- [ ] **Step 3: 构建验证并推送**
  Run: `npm run build`; commit and push.
