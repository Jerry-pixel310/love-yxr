# Romantic UX Upgrades Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Implement six comprehensive romantic upgrades: Audio Auto-play Unlock, Future Milestones Tracker, Glowing Vector Photo Cards, Live Feedback Sticky Notes, Tamagotchi Pasture Sheep, and Midnight Aurora Gentle Mode.

**Architecture:** Modulate enhancements across `src/App.jsx`, `src/components/letter/PhotoCard.jsx`, `src/data/letter.js`, and `src/styles.css`. Ensure backward compatibility with existing tests by maintaining critical selectors and text matches, while injecting rich state-driven interactions.

**Tech Stack:** React 18, HTML5 Web Audio, LocalStorage, CSS3 Custom Properties & Keyframes.

---

## Task 1: Audio Auto-play Unlock (Cover Page Hook)

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Check existing cover button click handler**
  Read App.jsx around "打开这封信" click handler. Currently, it sets page to `gate`. We should trigger the audio start here. Since modern browsers unlock audio on user gesture, starting the audio context/source on this button click is the absolute best industry pattern.
  In `App.jsx`, look for:
  ```jsx
  <button className="btn btn-primary" onClick={() => goToPage('gate')}>
  ```
  We will modify this to also trigger music play (or invoke a shared global play function that MusicButton can also synchronize with).

- [ ] **Step 2: Add global audio state trigger**
  Expose a `triggerPlay` function or ref, and invoke it directly upon "打开这封信" click, and also when entering the gate.
  Let's see if the audio is managed by `MusicButton` or inside `App.jsx`. Let's search for `<MusicButton` in `App.jsx` to locate where the `<audio>` tag or audio object lives.
  Expected: In App.jsx, MusicButton takes some props, or handles its own state. Let's find out!

- [ ] **Step 3: Test and verify**
  Run: `npm test -- --run`
  Verify that clicking the button doesn't crash the tests and successfully unlocks/plays audio.

---

## Task 2: Future Milestones Tracker (Upgrading Gaokao Module)

**Files:**
- Modify: `src/data/letter.js` — replace gaokao strings with custom milestones data structure
- Modify: `src/App.jsx` — adapt countdown calculator to support any milestone and countdown/count-up logic

- [ ] **Step 1: Redesign milestone data in `letter.js`**
  ```js
  // Replace old gaokaoTitle section with:
  milestonesTitle: '小羊与我的专属时光轴',
  milestonesSubtitle: '时间的每一次跳动，都帮我记着关于你的重要时刻。',
  milestones: [
    {
      title: '我们初次相识',
      date: '2026-05-18', // Count-up
      type: 'countup',
      emoji: '✨',
      prefix: '我们已经认识了',
      suffix: '天',
    },
    {
      title: '下一个 520',
      date: '2027-05-20', // Countdown
      type: 'countdown',
      emoji: '💖',
      prefix: '距离下一个 520 还有',
      suffix: '天',
    },
    {
      title: '高考胜利纪念',
      date: '2025-06-09',
      type: 'countup',
      emoji: '🎓',
      prefix: '小羊高考胜利已经过去',
      suffix: '天',
    }
  ],
  ```

- [ ] **Step 2: Adapt `Countdown520` and Gaokao section in `App.jsx`**
  Instead of hardcoded Gaokao logic, render a list of cards, each calculating either days elapsed (countup) or days remaining (countdown) dynamically based on the current date, using the existing pure day calculation logic.

- [ ] **Step 3: Update `App.test.jsx` for milestone text assertions**
  Ensure the new milestone section doesn't break assertions for old gaokao titles (or update them safely to match the new strings).

- [ ] **Step 4: Run tests**
  Run: `npm test -- --run`
  Expected: PASS.

---

## Task 3: Glowing Vector Photo Cards (Visual Placeholder Overhaul)

**Files:**
- Modify: `src/components/letter/PhotoCard.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Check existing `PhotoCard.jsx` implementation**
  If `src` starts with `/photos/photo-` (which are empty placeholders), or is missing, instead of a gray box with text, render a beautiful glowing SVG vector illustration card representing:
  - Card 1: A cute glowing constellation / starry sky heart
  - Card 2: A pair of pixel-art/stylized glowing cute sheep grazing
  - Card 3: A starry twilight night rose glowing in neon glass lines

- [ ] **Step 2: Implement SVG placeholders**
  Write pure SVG components inside `PhotoCard.jsx` that render responsive vectors with custom CSS variables for pulse and glow effects.

- [ ] **Step 3: Style placeholders in `styles.css`**
  Add delicate custom CSS keyframes for floating, breathing glow, and starry sparkle background patterns for empty photo cards.

- [ ] **Step 4: Verify visually and run build**
  Run: `npm run build`
  Verify that SVG/CSS code does not generate build warnings and renders beautifully.

---

## Task 4: Live Feedback Sticky Notes (Reply Sticky Bubble)

**Files:**
- Modify: `src/App.jsx` — handle reply form submission, save latest message to LocalStorage, and display a floating sticky note above the Comfort Pasture

- [ ] **Step 1: Handle reply form submission cache**
  In the `ConfessionModal` or the final reply submission handler, when the user successfully clicks "提交回复", save the text:
  ```js
  localStorage.setItem('ranran_latest_reply', submittedText);
  ```

- [ ] **Step 2: Read cached message in Comfort Pasture**
  Inside the `ComfortPasture` component, read `ranran_latest_reply` from state (initially loaded from `localStorage`):
  ```js
  const [latestReply, setLatestReply] = useState(() => localStorage.getItem('ranran_latest_reply'));
  ```

- [ ] **Step 3: Render floating reply bubble**
  Render a beautifully styled absolute-positioned pink sticky note or cloud bubble next to the grazing lamb:
  - If no reply is submitted yet, show a default sweet note: `"小羊宝宝：今天也要开心鸭 🐏✨"`
  - If a reply is submitted, display the actual user message inside the bubble with a hand-written font and subtle floating keyframe animation.

- [ ] **Step 4: Run tests**
  Run: `npm test -- --run`
  Expected: PASS.

---

## Task 5: Tamagotchi Pasture Sheep (Interactivity & Feed Mode)

**Files:**
- Modify: `src/App.jsx` — enhance `ComfortPasture` with feeding state, interactive dialogue popups, and click animations
- Modify: `src/styles.css` — add styles for feeding button, falling heart grass particles, and sheep bounce/spin actions

- [ ] **Step 1: Add state to `ComfortPasture`**
  Add states:
  - `feedCount` (int): Number of times sheep is fed.
  - `dialogue` (string): The current speech bubble text.
  - `isAnimating` (string | null): The current animation class to apply (`'bounce' | 'spin' | 'wiggle'`).

- [ ] **Step 2: Create sweet random sheep dialogues**
  Define a set of 8 cute sheep responses (e.g. `"咩~ (贴贴主人的手指!)"`, `"草草甜甜的，像杜昊翔一样甜~"`, `"（小羊打了个滚，并向你发射了一颗爱心）"`, `"咩~ 今天也有好好想你哦！"`, etc.).

- [ ] **Step 3: Create feeding action & falling grass particles**
  Add a `🌱 喂小羊吃草` button next to the lamb. Clicking it triggers:
  1. Increment `feedCount`
  2. Choose a new random sweet response.
  3. Spawn temporary falling heart/grass SVG particles inside the pasture container.
  4. Trigger a cute sheep animation (bounce/wiggle).

- [ ] **Step 4: Style the tamagotchi pasture in `styles.css`**
  Add cute speech bubbles, button hovering layouts, and falling particle CSS animations.

---

## Task 6: Midnight Aurora Gentle Mode (Time-based Starry Aurora)

**Files:**
- Modify: `src/App.jsx` — detect midnight hours and set global `isNightMode` state
- Modify: `src/styles.css` — add starry midnight aurora styles

- [ ] **Step 1: Detect night time (22:00 to 05:00)**
  In `App.jsx`, add a state:
  ```js
  const [isNightMode, setIsNightMode] = useState(() => {
    const hr = new Date().getHours();
    return hr >= 22 || hr < 5;
  });
  ```
  Render a tiny toggler/indicator on the home page header so the user can also manually toggle this gorgeous mode regardless of the clock!

- [ ] **Step 2: Implement midnight aurora styles**
  When `isNightMode` is true, add a class `.theme-night` to the app wrapper.
  In `.theme-night`, replace default background gradients with:
  ```css
  background: radial-gradient(circle at 50% 10%, rgba(13, 27, 42, 0.98), #030712);
  ```
  Add a gorgeous, GPU-optimized animated CSS pseudo-element for flowing starry polar aurora:
  ```css
  .theme-night::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(46, 196, 182, 0.08), rgba(255, 0, 110, 0.05));
    filter: blur(80px);
    opacity: 0.6;
    animation: nightAurora 12s ease-in-out infinite alternate;
  }
  ```

- [ ] **Step 3: Night lullaby gentle text**
  If night mode is active, display a sweet sleeping lamb icon and night greeting on the directory home page: `"夜深啦，送给小羊宝宝一片极光星空，听着《稻香》做个甜甜的梦吧 🌙✨"`

- [ ] **Step 4: Complete build, test, and deploy verification**
  Run: `npm test -- --run`
  Run: `npm run build`
  Run: `npm run deploy`
  Expected: perfect builds and deployments with zero regressions.
