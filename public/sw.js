const CACHE = 'love-letter-v2' // 升级缓存版本，强制清除之前的旧离线缓存
const PRECACHE = [
  '/love-yxr',
  '/love-yxr/',
  '/love-yxr/index.html',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)

  // 1. 核心修复：如果是页面导航请求（用户开网页），或者是 HTML，或者是项目首页（无论带不带尾部斜杠），都必须绝对网络优先！
  const isNavigate = e.request.mode === 'navigate'
  const isHtml = url.pathname.endsWith('.html')
  const isHomepage = url.pathname === '/love-yxr/' || url.pathname === '/love-yxr'

  if (isNavigate || isHtml || isHomepage) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    )
  } else {
    // 2. 对于静态资源（js、css、图片等），使用缓存优先，未缓存的再 fetch 并存入缓存
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
