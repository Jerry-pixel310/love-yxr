# Romantic Interaction & Convenience Upgrades Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Implement three ultra-sweet mobile interactions: PWA Custom Install Prompt Pill, Mobile Swipe-to-Flip Chapter Gestures, and Tappable Falling Stars with Sparkle Confetti & Wish Whispers.

**Architecture:**
- **PWA Installer Pill**: Listen to window event `beforeinstallprompt`, store the event, and show a beautiful pink sheep button on the home directory page. On iOS, show a cute "Share -> Add to Home Screen" tooltip popup.
- **Swipe-to-Flip**: Wrap default chapter templates with touch event coordinates tracking (`onTouchStart`, `onTouchEnd`) to detect horizontal swipes. Swipe left triggers next chapter, swipe right triggers previous chapter (or back to directory).
- **Tappable Falling Stars**: In the background particles/atmosphere or night aurora layer, render floating comets/meteors as clickable/touchable elements. Tapping them spawns a dynamic CSS heart burst at that coordinate, and displays a temporary glowing toast containing a random good luck wish.

**Tech Stack:** React 18, Touch Events, PWA installation APIs, CSS Canvas/Transition Particles.

---

## Task 1: 📱 PWA Custom Install Pill & Tooltip

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Setup global beforeinstallprompt listener**
  In `App.jsx` top-level component, add:
  ```javascript
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPill, setShowInstallPill] = useState(false)
  const [showIosTip, setShowIosTip] = useState(false)

  useEffect(() => {
    const handlePrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPill(true)
    }
    window.addEventListener('beforeinstallprompt', handlePrompt)
    
    // Also detect if already running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    // For iOS detection
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    if (isIos && !isStandalone) {
      setShowInstallPill(true) // We will show custom iOS tooltip button
    }

    return () => window.removeEventListener('beforeinstallprompt', handlePrompt)
  }, [])
  ```

- [ ] **Step 2: Create install action handler**
  ```javascript
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowInstallPill(false)
      }
    } else {
      // iOS show helper tooltip modal
      setShowIosTip(true)
    }
  }
  ```

- [ ] **Step 3: Render install pill in directory home page**
  On the Home Page directory (L3350+), right below the night mode pill, render a gorgeous installing button:
  ```jsx
  {showInstallPill && (
    <button className="pwa-install-pill animate-bounce-gentle" onClick={handleInstallClick} type="button">
      🐑 把小羊的信保存到手机桌面（随时离线阅读）
    </button>
  )}
  ```
  And render a gorgeous iOS-style modal backdrop tutorial when `showIosTip` is true (explaining how to click "Share" -> "Add to Home Screen" on Safari).

- [ ] **Step 4: Style installer pill and modal in `styles.css`**
  Add delicate CSS for `.pwa-install-pill` and `.pwa-ios-modal`.

---

## Task 2: 📖 Mobile Swipe-to-Flip Chapter Gestures

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Implement custom Swipe hook/handlers**
  In `App.jsx`, define a swipe container wrap.
  ```javascript
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e, currentChapter) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current
    const diffY = e.changedTouches[0].clientY - touchStartY.current
    
    // Horizontal swipe threshold: 75px, vertical limit to avoid diagonal scrolling triggers
    if (Math.abs(diffX) > 75 && Math.abs(diffY) < 50) {
      const chapters = ['letter', 'memory', 'gaokao', 'play', 'final']
      const currentIndex = chapters.indexOf(currentChapter)
      
      if (diffX < 0) {
        // Swipe Left: Next chapter
        if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
          goToPage(chapters[currentIndex + 1])
        }
      } else {
        // Swipe Right: Previous chapter or go back home
        if (currentIndex > 0) {
          goToPage(chapters[currentIndex - 1])
        } else if (currentIndex === 0) {
          goToPage('home')
        }
      }
    }
  }
  ```

- [ ] **Step 2: Bind touch event handlers**
  In the main `return` of the chapter page template (L3391+), apply `onTouchStart` and `onTouchEnd` directly to the outermost `.chapter-page` element:
  ```jsx
  <div 
    className={`page letter-page chapter-page chapter-page-${page} ${isNightMode ? 'theme-night' : ''}`}
    onTouchStart={handleTouchStart}
    onTouchEnd={(e) => handleTouchEnd(e, page)}
  >
  ```

- [ ] **Step 3: Render horizontal swipe instruction hint**
  Add a subtle, floating, semi-transparent mobile helper hint at the bottom of the chapters (only on mobile) indicating `← 左右滑动翻阅章节 →` that fades out after 3 seconds.

---

## Task 4: 💫 流星戳戳乐许愿彩蛋 (Meteor Tapper)

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Check existing atmosphere meteor renderer**
  Currently, we have 2 static meteors rendered in `.letter-atmosphere` (L3350+):
  ```jsx
  <span className="atmosphere-meteor meteor-one" />
  <span className="atmosphere-meteor meteor-two" />
  ```
  We will replace these with a **dynamic and interactive Meteor array** where meteors fly across the sky, are fully tappable, and respawn!

- [ ] **Step 2: Implement dynamic meteor spawner**
  Create a custom `AtmosphereMeteors` component inside `App.jsx` that maintains an active array of flying comets:
  - Each comet has a random diagonal path, duration, and coordinate.
  - Tapping/clicking a comet:
    1. Spawns a floating neon message: `"✨ 愿望成真！杨星冉宝宝今天也会超幸运~"`, `"🌟 抓住流星！杜昊翔比昨天更喜欢你一点~"`, `"💖 流星掠过：小羊宝宝要天天开心呀！"`
    2. Spawns 12 tiny exploding heart particles (`🌸` / `❤`) radiating from the click coordinates.
    3. Respawns the comet after a short delay.

- [ ] **Step 3: Write CSS for meteors and bubble toasts**
  Add high-quality glowing classes in `styles.css` for `.tappable-meteor`, `.meteor-heart-burst` and `.meteor-wish-toast`.

- [ ] **Step 4: Run Vitest & deployment**
  Ensure all 12 tests are 100% passing and production build succeeds.
