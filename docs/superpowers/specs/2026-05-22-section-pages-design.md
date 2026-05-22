# Section Pages Design

## Goal

将当前很长的情书卷轴页面改造成“首页目录 + 独立章节页”的复式页面体验。用户从首页点击导航里的“信 / 回忆 / 加油 / 机关 / 特效 / 最后”后，直接进入对应内容页；每个内容页提供返回首页入口。

## Recommended Approach

采用单页应用内部状态切换，不新增 React Router，不改变 URL。

原因：

- 当前项目已经使用 `page` 状态在 `gate / transition / letter / effects` 间切换。
- 内部状态切换改动更小，部署更稳。
- 情书体验主要面向一次性沉浸浏览，不强依赖章节 URL 分享。
- 后续仍可升级为 hash 路由。

## Page Model

扩展现有页面状态：

- `gate`: 暗号入口页。
- `transition`: 进入情书过渡页。
- `home`: 情书首页/目录页。
- `letter`: 信章节页。
- `memory`: 回忆章节页。
- `gaokao`: 加油章节页。
- `play`: 机关章节页。
- `effects`: 特效合集页。
- `final`: 最后一章页。

## Home Page

首页保留浪漫氛围、音乐、粒子背景和导航入口，但不再承载所有完整章节内容。

首页内容建议：

- 欢迎开场文案。
- 音乐按钮。
- 章节导航卡片或现有胶囊导航。
- 每个章节的简短预览。
- 引导文案：“选一个地方开始吧，每一页都藏着我想认真给你的温柔。”

## Chapter Navigation

修改 `ChapterNav`：

- 从锚点跳转改为按钮触发。
- 接收 `activeChapter` 和 `onNavigate`。
- 点击 `信 / 回忆 / 加油 / 机关 / 特效 / 最后` 时调用 `onNavigate(chapterKey)`。

章节 key：

- `letter`
- `memory`
- `gaokao`
- `play`
- `effects`
- `final`

## Chapter Pages

每个章节页使用统一外壳：

- 顶部返回按钮：`← 回到首页`
- 小标题/kicker。
- 当前章节内容。
- 可选底部按钮：返回首页或前往下一章。

建议新增轻量组件：

- `ChapterPageShell`
- `HomeChapterCard`

## Content Mapping

### 信章节页

包含：

- Opening text。
- `letterConfig.sections` 的正文内容。

### 回忆章节页

包含：

- 照片区。
- 记忆影院。
- 冰玫瑰视频/相关回忆。

### 加油章节页

包含：

- 高考鼓励相关内容。
- 星星收集。
- 鼓励/祝福组件。

### 机关章节页

包含：

- 小信封。
- 时间胶囊。
- 问答互动。
- 彩蛋按钮。

### 特效章节页

复用现有 `EffectsShowcase`，但返回按钮改为回到首页。

### 最后章节页

包含：

- 最终文字。
- 心动爆发按钮。
- 温柔告白入口。
- 回信表单。

## State and Data Flow

`App` 维护：

- 当前页面状态。
- 互动状态，例如星星、问答、时间胶囊、告白确认等。
- `recordActivity` 继续记录导航和互动行为。

导航行为：

- 首页点击章节卡片或导航按钮：`setPage(chapterKey)`。
- 章节页返回首页：`setPage('home')`。
- 特效页返回：首页。

## Visual Direction

整体方向：温柔、清晰、像打开不同“小房间”。

首页更像目录，章节页更像单独的情绪空间：

- 首页：柔和、轻盈、入口明确。
- 回忆：相册感。
- 加油：明亮星光感。
- 机关：礼物盒和小互动感。
- 特效：继续保留星空宇宙感。
- 最后：更安静、更郑重。

## Risk Control

分阶段改造：

1. 先把导航改成内部章节切换。
2. 创建首页和章节外壳。
3. 将现有内容按块移动到对应章节页。
4. 构建验证。
5. 推送部署。

不删除现有核心内容，不改变文案数据结构。

## Verification

每次完成后运行：

```bash
npm run build
```

预期：构建成功，所有章节可进入并返回首页。
