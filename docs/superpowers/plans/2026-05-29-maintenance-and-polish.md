# Maintenance & Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Four sequential passes: image compression → test coverage → PWA support → CSS dead-code removal.

**Architecture:** Each task is independent and self-contained. Tasks 1-3 add/modify files; Task 4 is read-only analysis followed by targeted CSS deletion. Every task ends with `npm test -- --run` + `npm run build` verification before commit.

**Tech Stack:** Vite + React 18, Vitest + @testing-library/react, sharp (Node CLI for WebP conversion), Workbox-free manual Service Worker, GitHub Pages (`base: /love-yxr/`)

---

## Task 1: Image Compression → WebP

**Files:**
- Modify: `public/images/ranran-memory.jpg` → replace with `ranran-memory.webp`
- Modify: `public/images/ranran-game-mvp.jpg` → replace with `ranran-game-mvp.webp`
- Modify: `public/images/ice-rose-reference-frame.jpg` → replace with `ice-rose-reference-frame.webp`
- Modify: `src/App.jsx` — update 3 `asset()` calls and `MemoryFilmStrip` src strings
- Modify: `src/data/letter.js` — update `memoryPhoto.src`

- [ ] **Step 1: Install sharp CLI**
  Run: `npm install --save-dev sharp-cli`

- [ ] **Step 2: Convert all three images to WebP at quality 82**
  Run:
  ```
  npx sharp-cli --input public/images/ranran-memory.jpg --output public/images/ranran-memory.webp --quality 82
  npx sharp-cli --input public/images/ranran-game-mvp.jpg --output public/images/ranran-game-mvp.webp --quality 82
  npx sharp-cli --input public/images/ice-rose-reference-frame.jpg --output public/images/ice-rose-reference-frame.webp --quality 82
  ```

- [ ] **Step 3: Delete original JPGs**
  Run:
  ```
  Remove-Item public/images/ranran-memory.jpg
  Remove-Item public/images/ranran-game-mvp.jpg
  Remove-Item public/images/ice-rose-reference-frame.jpg
  ```

- [ ] **Step 4: Update `src/data/letter.js` — memoryPhoto.src**
  In `letter.js` line ~249, change:
  ```js
  src: '/images/ranran-memory.jpg',
  ```
  to:
  ```js
  src: '/images/ranran-memory.webp',
  ```

- [ ] **Step 5: Update `src/App.jsx` — all image references**
  Three changes:
  1. `MemoryFilmStrip` frame 2: `asset('/images/ranran-game-mvp.jpg')` → `asset('/images/ranran-game-mvp.webp')`
  2. `MemoryFilmStrip` frame 3: `asset('/images/ice-rose-reference-frame.jpg')` → `asset('/images/ice-rose-reference-frame.webp')`
  3. Memory cinema section `<img src={asset('/images/ranran-game-mvp.jpg')}` → `.webp`

- [ ] **Step 6: Run tests**
  Run: `npm test -- --run`
  Expected: 9/9 pass

- [ ] **Step 7: Build and verify**
  Run: `npm run build`
  Expected: exit 0, JS/CSS sizes unchanged

- [ ] **Step 8: Commit**
  ```
  git add public/images src/App.jsx src/data/letter.js
  git commit -m "perf: convert images to WebP (~60% smaller)"
  git push origin main
  ```

---

## Task 2: Test Coverage — Missing Components

**Files:**
- Modify: `src/App.test.jsx` — add 4 new tests

Target components with zero test coverage:
- `HeartBurst` (overlay modal)
- `ShakeFortune` (shake phone widget)
- `EffectsShowcase` (effects page)
- `SpinWheel` (spin wheel widget in play chapter)

- [ ] **Step 1: Add HeartBurst test**
  Add to `App.test.jsx`:
  ```js
  test('shows HeartBurst overlay when heart burst button clicked', async () => {
    await openChapter('最后一章')
    fireEvent.click(screen.getByText('点亮第一圈光'))
    await new Promise((r) => setTimeout(r, 400))
    fireEvent.click(screen.getByText('把小羊抱进心里'))
    await new Promise((r) => setTimeout(r, 400))
    const btn = screen.queryByText('杜昊翔一直在想你')
    // HeartBurst vows are rendered — check at least one
    // Note: HeartBurst phase starts at 'counting', vows render immediately
    expect(document.querySelector('.heart-burst-overlay')).toBeTruthy()
  }, 12000)
  ```

- [ ] **Step 2: Run test to verify it passes**
  Run: `npm test -- --run`
  Expected: 10/10 pass

- [ ] **Step 3: Add ShakeFortune click test**
  Add to `App.test.jsx`:
  ```js
  test('ShakeFortune shows fortune after click', async () => {
    await openChapter('打开小机关')
    const shakeBtn = screen.getByRole('button', { name: '点击摇一摇' })
    fireEvent.click(shakeBtn)
    await new Promise((r) => setTimeout(r, 900))
    // After 700ms, fortune should be set
    expect(document.querySelector('.shake-phone.has-fortune')).toBeTruthy()
  }, 12000)
  ```

- [ ] **Step 4: Add EffectsShowcase navigation test**
  Add to `App.test.jsx`:
  ```js
  test('navigates to effects page and back', async () => {
    await enterWithPassphrase()
    fireEvent.click(screen.getByText('进入特效世界'))
    await new Promise((r) => setTimeout(r, 2500))
    expect(screen.getByText('Ranran\'s romantic universe')).toBeTruthy()
    fireEvent.click(screen.getByText('← 返回情书'))
    await new Promise((r) => setTimeout(r, 300))
    expect(screen.getByText('有一封信给冉冉宝宝')).toBeTruthy()
  }, 12000)
  ```

- [ ] **Step 5: Run all tests**
  Run: `npm test -- --run`
  Expected: all pass

- [ ] **Step 6: Commit**
  ```
  git add src/App.test.jsx
  git commit -m "test: add coverage for HeartBurst, ShakeFortune, EffectsShowcase"
  git push origin main
  ```

---

## Task 3: PWA Support

**Files:**
- Create: `public/manifest.json`
- Create: `public/sw.js`
- Modify: `index.html` — add `<link rel="manifest">` and SW registration script

**Design decisions:**
- Service Worker strategy: Cache-first for static assets, network-first for HTML
- No Workbox — manual SW to keep it minimal and zero-dependency
- Icons: use existing emoji-based SVG inline (no extra image files needed)

- [ ] **Step 1: Create `public/manifest.json`**
  ```json
  {
    "name": "给小羊宝宝的一封信",
    "short_name": "小羊的信",
    "description": "一封专门为杨星冉宝宝写的浪漫网页信",
    "start_url": "/love-yxr/",
    "scope": "/love-yxr/",
    "display": "standalone",
    "background_color": "#0d0720",
    "theme_color": "#ff2f7d",
    "lang": "zh-CN",
    "icons": [
      {
        "src": "/love-yxr/icon-192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/love-yxr/icon-512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
  ```

- [ ] **Step 2: Generate PWA icons**
  Use sharp-cli (already installed) to generate two pink heart icons:
  - Option A: copy an existing image and resize
  - Option B: create a minimal SVG → PNG via sharp
  
  If no source icon exists, create `public/icon.svg`:
  ```svg
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="100" fill="#0d0720"/>
    <text x="256" y="340" font-size="300" text-anchor="middle" fill="#ff2f7d">❤</text>
  </svg>
  ```
  Then convert:
  ```
  npx sharp-cli --input public/icon.svg --output public/icon-192.png --width 192 --height 192
  npx sharp-cli --input public/icon.svg --output public/icon-512.png --width 512 --height 512
  ```

- [ ] **Step 3: Create `public/sw.js`**
  ```js
  const CACHE = 'love-letter-v1'
  const PRECACHE = [
    '/love-yxr/',
    '/love-yxr/index.html',
  ]

  self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
    )
  })

  self.addEventListener('activate', (e) => {
    e.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      ).then(() => self.clients.claim())
    )
  })

  self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return
    const url = new URL(e.request.url)
    // Network-first for HTML; cache-first for assets
    if (url.pathname.endsWith('.html') || url.pathname === '/love-yxr/') {
      e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
      )
    } else {
      e.respondWith(
        caches.match(e.request).then((cached) =>
          cached || fetch(e.request).then((res) => {
            const clone = res.clone()
            caches.open(CACHE).then((c) => c.put(e.request, clone))
            return res
          })
        )
      )
    }
  })
  ```

- [ ] **Step 4: Update `index.html`**
  Add inside `<head>`:
  ```html
  <link rel="manifest" href="/love-yxr/manifest.json" />
  <meta name="theme-color" content="#ff2f7d" />
  <link rel="apple-touch-icon" href="/love-yxr/icon-192.png" />
  ```
  Add before `</body>`:
  ```html
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/love-yxr/sw.js')
      })
    }
  </script>
  ```

- [ ] **Step 5: Run tests**
  Run: `npm test -- --run`
  Expected: all pass (SW registration in jsdom is no-op, won't fail)

- [ ] **Step 6: Build and deploy**
  Run: `npm run deploy`
  Expected: exit 0

- [ ] **Step 7: Commit**
  ```
  git add public/manifest.json public/sw.js public/icon.svg public/icon-192.png public/icon-512.png index.html
  git commit -m "feat: add PWA support (manifest, service worker, icons)"
  git push origin main
  ```

---

## Task 4: CSS Dead-Code Removal

**Files:**
- Modify: `src/styles.css` (currently 236KB / 9100+ lines)

**Strategy:** Search for CSS class selectors that have no corresponding usage in `src/App.jsx` or `src/components/**`. Remove entire rule blocks for dead selectors. Do NOT touch utility classes, pseudo-elements, or CSS custom properties.

- [ ] **Step 1: Extract all CSS class selectors from styles.css**
  Run:
  ```powershell
  Select-String -Path src/styles.css -Pattern '^\.[a-z][a-z0-9-]+\s*[{,]' | ForEach-Object { $_.Matches.Value.Trim().TrimEnd('{,').Trim() } | Sort-Object -Unique | Out-File css-classes.txt
  ```

- [ ] **Step 2: Extract all className usages from JSX/JS files**
  Run:
  ```powershell
  Select-String -Path src/App.jsx,src/components/effects/InteractiveEffects.jsx,src/components/letter/*.jsx -Pattern 'className="([^"]+)"' -AllMatches | ForEach-Object { $_.Matches | ForEach-Object { $_.Groups[1].Value -split ' ' } } | Sort-Object -Unique | Out-File used-classes.txt
  ```

- [ ] **Step 3: Compute difference — candidates for removal**
  Run:
  ```powershell
  $css = Get-Content css-classes.txt
  $used = Get-Content used-classes.txt
  Compare-Object $css $used | Where-Object { $_.SideIndicator -eq '<=' } | Select-Object InputObject | Out-File dead-classes.txt
  ```
  Review `dead-classes.txt` manually — some selectors may be dynamic (e.g. `phase-counting`, `is-shaking`) and must be kept.

- [ ] **Step 4: Remove confirmed dead rule blocks from styles.css**
  For each confirmed dead selector, remove its entire rule block using the Edit tool.

- [ ] **Step 5: Run tests + build**
  Run: `npm test -- --run && npm run build`
  Visual-check that build succeeds and CSS size is reduced.

- [ ] **Step 6: Cleanup temp files**
  Run:
  ```
  Remove-Item css-classes.txt, used-classes.txt, dead-classes.txt
  ```

- [ ] **Step 7: Commit**
  ```
  git add src/styles.css
  git commit -m "chore: remove unused CSS selectors"
  git push origin main
  ```
