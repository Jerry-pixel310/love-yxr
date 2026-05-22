import { useEffect, useRef, useState } from 'react'

/* ── 52种语言爱心 (from Python: 52种语言方言我爱你.py) ── */
function MultiLangHeart({ config }) {
  const canvasRef = useRef(null)
  const [active, setActive] = useState(false)
  const animRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1)
    const H = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1)
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    const texts = config.multiLangHeartTexts || []
    const colors = ['#FFB6C1', '#FF69B4', '#FF1493', '#DA70D6', '#FFD700', '#FFA07A', '#FF6EB4', '#FF82AB']

    // Generate heart path points
    const heartPoints = []
    for (let t = 0; t < 1000; t++) {
      const theta = (t / 1000) * 2 * Math.PI
      const scale = Math.min(w, h) * 0.022
      const x = 16 * Math.pow(Math.sin(theta), 3) * scale + w / 2
      const y = -(13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta)) * scale + h / 2
      heartPoints.push({ x, y })
    }

    // Create text objects
    const textObjs = texts.map((text, i) => {
      const idx = Math.floor(Math.random() * heartPoints.length)
      return {
        text,
        x: heartPoints[idx].x + (Math.random() - 0.5) * 20,
        y: heartPoints[idx].y + (Math.random() - 0.5) * 20,
        targetIdx: idx,
        color: colors[i % colors.length],
        fontSize: 10 + Math.random() * 6,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
      }
    })

    // Danmaku
    const danmakuTexts = config.loveDanmakuTexts || ['我爱你', '在一起', '小羊宝宝']
    const danmakus = Array.from({ length: 20 }, () => createDanmaku(w, h, danmakuTexts))

    function createDanmaku(w, h, txts) {
      const fromLeft = Math.random() > 0.5
      return {
        text: txts[Math.floor(Math.random() * txts.length)],
        x: fromLeft ? -100 : w + 100,
        y: 40 + Math.random() * (h - 80),
        speed: fromLeft ? (1.5 + Math.random() * 2) : -(1.5 + Math.random() * 2),
        alpha: 0,
        life: 0,
        maxLife: 120 + Math.floor(Math.random() * 80),
        fontSize: 12 + Math.random() * 6,
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Draw text objects along heart
      textObjs.forEach((obj) => {
        const target = heartPoints[obj.targetIdx]
        obj.x += (target.x - obj.x) * 0.015 + obj.speedX
        obj.y += (target.y - obj.y) * 0.015 + obj.speedY
        obj.targetIdx = (obj.targetIdx + 1) % heartPoints.length
        if (obj.x < 0 || obj.x > w) obj.speedX *= -1
        if (obj.y < 30 || obj.y > h - 30) obj.speedY *= -1
        ctx.font = `${obj.fontSize}px sans-serif`
        ctx.fillStyle = obj.color
        ctx.textAlign = 'center'
        ctx.fillText(obj.text, obj.x, obj.y)
      })

      // Draw center text
      ctx.font = `bold ${Math.min(w, h) * 0.06}px "Ma Shan Zheng", cursive`
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.textAlign = 'center'
      ctx.fillText('小羊', w / 2, h / 2)

      // Danmaku
      danmakus.forEach((d, i) => {
        d.life++
        if (d.life < d.maxLife * 0.2) d.alpha = Math.min(1, d.alpha + 0.06)
        else if (d.life > d.maxLife * 0.7) d.alpha = Math.max(0, d.alpha - 0.04)
        d.x += d.speed
        if (d.life >= d.maxLife || d.x < -200 || d.x > w + 200) {
          danmakus[i] = createDanmaku(w, h, danmakuTexts)
        }
        ctx.globalAlpha = d.alpha * 0.7
        ctx.font = `${d.fontSize}px sans-serif`
        ctx.fillStyle = '#FFEFD5'
        ctx.fillText(d.text, d.x, d.y)
        ctx.globalAlpha = 1
      })

      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [active, config])

  return (
    <section className="effect-section multilang-heart-section fade-in-scroll">
      <h3 className="section-title">{config.multiLangHeartTitle}</h3>
      <p className="effect-subtitle">{config.multiLangHeartSubtitle}</p>
      {!active ? (
        <button className="btn btn-soft effect-btn" onClick={() => setActive(true)}>
          {config.multiLangHeartButtonText}
        </button>
      ) : (
        <div className="effect-canvas-wrap">
          <canvas ref={canvasRef} className="effect-canvas multilang-canvas" />
          <button className="btn btn-close-effect" onClick={() => setActive(false)}>关闭</button>
        </div>
      )}
    </section>
  )
}

/* ── 弹幕告白 (from Python: 52种语言方言我爱你.py danmaku part) ── */
function LoveDanmaku({ config }) {
  const [active, setActive] = useState(false)
  const containerRef = useRef(null)
  const intervalRef = useRef(null)
  const [danmakus, setDanmakus] = useState([])
  const idRef = useRef(0)

  useEffect(() => {
    if (!active) return
    const texts = config.loveDanmakuTexts || []
    const colors = ['#FFB6C1', '#FF69B4', '#FFEFD5', '#FFD700', '#FF82AB', '#FFC0CB']

    intervalRef.current = setInterval(() => {
      const id = idRef.current++
      const fromLeft = Math.random() > 0.5
      setDanmakus((prev) => [...prev.slice(-60), {
        id,
        text: texts[Math.floor(Math.random() * texts.length)],
        top: 5 + Math.random() * 85,
        fromLeft,
        duration: 5 + Math.random() * 4,
        fontSize: 14 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      }])
      setTimeout(() => {
        setDanmakus((prev) => prev.filter((d) => d.id !== id))
      }, 10000)
    }, 200)

    return () => clearInterval(intervalRef.current)
  }, [active, config])

  return (
    <section className="effect-section danmaku-section fade-in-scroll">
      <h3 className="section-title">{config.loveDanmakuTitle}</h3>
      <p className="effect-subtitle">{config.loveDanmakuSubtitle}</p>
      {!active ? (
        <button className="btn btn-soft effect-btn" onClick={() => setActive(true)}>
          {config.loveDanmakuButtonText}
        </button>
      ) : (
        <div className="effect-danmaku-wrap" ref={containerRef}>
          <div className="danmaku-stage">
            {danmakus.map((d) => (
              <span
                key={d.id}
                className={`danmaku-item ${d.fromLeft ? 'from-left' : 'from-right'}`}
                style={{
                  top: `${d.top}%`,
                  fontSize: `${d.fontSize}px`,
                  color: d.color,
                  animationDuration: `${d.duration}s`,
                }}
              >
                {d.text}
              </span>
            ))}
          </div>
          <button className="btn btn-close-effect" onClick={() => { setActive(false); setDanmakus([]) }}>关闭</button>
        </div>
      )}
    </section>
  )
}

/* ── 此爱弹窗 (from Python: 此爱弹窗.py) ── */
function LoveQuotePopups({ config }) {
  const [active, setActive] = useState(false)
  const [hearts, setHearts] = useState([])
  const [finalMsg, setFinalMsg] = useState(null)

  const startPopups = () => {
    setActive(true)
    setFinalMsg(null)
    const texts = config.loveQuotePopupsTexts || []
    const popColors = [
      { bg: '#d9c7ef', text: '#5A4FCF' },
      { bg: '#f9879a', text: '#C2185B' },
      { bg: '#cbf1f7', text: '#1565C0' },
      { bg: '#ffe48f', text: '#E65100' },
    ]

    const newHearts = Array.from({ length: Math.min(texts.length * 2, 40) }, (_, i) => {
      const colorSet = popColors[i % popColors.length]
      return {
        id: i,
        text: texts[i % texts.length],
        x: 5 + Math.random() * 80,
        y: 5 + Math.random() * 80,
        bg: colorSet.bg,
        textColor: colorSet.text,
        delay: i * 80,
        size: 100 + Math.random() * 60,
      }
    })
    setHearts(newHearts)

    setTimeout(() => {
      setFinalMsg('此爱不变')
    }, newHearts.length * 80 + 2000)
  }

  return (
    <section className="effect-section love-quote-section fade-in-scroll">
      <h3 className="section-title">{config.loveQuotePopupsTitle}</h3>
      <p className="effect-subtitle">{config.loveQuotePopupsSubtitle}</p>
      {!active ? (
        <button className="btn btn-soft effect-btn" onClick={startPopups}>
          {config.loveQuotePopupsButtonText}
        </button>
      ) : (
        <div className="effect-popup-wrap">
          <div className="popup-stage">
            {hearts.map((h) => (
              <div
                key={h.id}
                className="love-quote-heart"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  animationDelay: `${h.delay}ms`,
                  '--heart-bg': h.bg,
                  '--heart-text-color': h.textColor,
                  '--heart-size': `${h.size}px`,
                }}
              >
                <svg viewBox="0 0 100 100" className="heart-svg">
                  <path d="M50 88 C25 65 5 50 5 30 A22 22 0 0 1 50 25 A22 22 0 0 1 95 30 C95 50 75 65 50 88Z" fill="var(--heart-bg)" />
                </svg>
                <span className="heart-quote-text">{h.text}</span>
              </div>
            ))}
            {finalMsg && (
              <div className="love-quote-final fade-in">
                <span>{finalMsg}</span>
              </div>
            )}
          </div>
          <button className="btn btn-close-effect" onClick={() => { setActive(false); setHearts([]); setFinalMsg(null) }}>关闭</button>
        </div>
      )}
    </section>
  )
}

/* ── 关怀弹窗 (from Python: 爱心弹窗(1).py) ── */
function CarePopups({ config }) {
  const [active, setActive] = useState(false)
  const [popups, setPopups] = useState([])
  const idRef = useRef(0)

  const startCare = () => {
    setActive(true)
    const texts = config.carePopupsTexts || []
    const colors = ['#FFB6C1', '#87CEEB', '#98FB98', '#FFFACD', '#FF69B4', '#87CEFA']

    // Heart shape placement
    const heartPositions = []
    const n = 50
    for (let i = 0; i < n; i++) {
      const theta = (i / n) * 2 * Math.PI
      const px = 50 + 16 * Math.pow(Math.sin(theta), 3) * 2.2
      const py = 50 - (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta)) * 2.2
      heartPositions.push({ x: Math.max(2, Math.min(88, px)), y: Math.max(2, Math.min(88, py)) })
    }

    // First wave: heart shape
    const wave1 = heartPositions.map((pos, i) => ({
      id: idRef.current++,
      text: texts[i % texts.length],
      x: pos.x,
      y: pos.y,
      color: colors[i % colors.length],
      delay: i * 40,
    }))

    setPopups(wave1)

    // Second wave: fill screen
    setTimeout(() => {
      const wave2 = Array.from({ length: 40 }, (_, i) => ({
        id: idRef.current++,
        text: texts[i % texts.length],
        x: 2 + Math.random() * 88,
        y: 2 + Math.random() * 88,
        color: colors[i % colors.length],
        delay: i * 30,
      }))
      setPopups((prev) => [...prev, ...wave2])
    }, wave1.length * 40 + 500)
  }

  return (
    <section className="effect-section care-section fade-in-scroll">
      <h3 className="section-title">{config.carePopupsTitle}</h3>
      <p className="effect-subtitle">{config.carePopupsSubtitle}</p>
      {!active ? (
        <button className="btn btn-soft effect-btn" onClick={startCare}>
          {config.carePopupsButtonText}
        </button>
      ) : (
        <div className="effect-popup-wrap">
          <div className="popup-stage care-stage">
            {popups.map((p) => (
              <div
                key={p.id}
                className="care-popup-card"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  backgroundColor: p.color,
                  animationDelay: `${p.delay}ms`,
                }}
              >
                {p.text}
              </div>
            ))}
          </div>
          <button className="btn btn-close-effect" onClick={() => { setActive(false); setPopups([]) }}>关闭</button>
        </div>
      )}
    </section>
  )
}

/* ── 爱心花海 (from Python: 爱心花海(1).py) ── */
function HeartPetalTrail({ config }) {
  const canvasRef = useRef(null)
  const [active, setActive] = useState(false)
  const animRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const scale = Math.min(w, h) * 0.022
    const cx = w / 2, cy = h / 2

    // Heart path
    const pathLen = 600
    const heartPath = []
    for (let i = 0; i < pathLen; i++) {
      const t = (2 * Math.PI * i) / pathLen
      const x = cx + 16 * Math.pow(Math.sin(t), 3) * scale
      const y = cy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale
      heartPath.push({ x, y })
    }

    // Spark (meteor) state
    let progress = 0
    const speed = 0.002
    const trail = []
    const trailMaxLife = 60

    // Petals
    const petals = []
    const petalColors = [
      [255, 140, 180], [255, 160, 200], [255, 120, 180], [255, 100, 160],
      [255, 180, 210], [255, 200, 220], [255, 130, 170], [255, 150, 190],
    ]

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Update spark position
      progress = (progress + speed) % 1
      const idx = Math.floor(progress * pathLen) % pathLen
      const sparkX = heartPath[idx].x
      const sparkY = heartPath[idx].y
      const prevIdx = (idx - 1 + pathLen) % pathLen
      const moveX = sparkX - heartPath[prevIdx].x
      const moveY = sparkY - heartPath[prevIdx].y

      // Add to trail
      trail.push({ x: sparkX, y: sparkY, life: trailMaxLife, moveX, moveY })

      // Update & draw trail
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life--
        if (trail[i].life <= 0) { trail.splice(i, 1); continue }
        const ratio = trail[i].life / trailMaxLife
        const alpha = ratio * 0.4
        const radius = 4 * ratio
        ctx.beginPath()
        ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 240, 200, ${alpha})`
        ctx.fill()

        // Spawn petals from trail
        if (Math.random() < 0.04 * ratio) {
          const color = petalColors[Math.floor(Math.random() * petalColors.length)]
          const dist = Math.hypot(trail[i].x - cx, trail[i].y - cy) || 1
          const radX = (trail[i].x - cx) / dist
          const radY = (trail[i].y - cy) / dist
          petals.push({
            x: trail[i].x, y: trail[i].y,
            vx: radX * (1 + Math.random()) + (Math.random() - 0.5),
            vy: radY * (1 + Math.random()) + (Math.random() - 0.5),
            life: 80 + Math.floor(Math.random() * 40),
            maxLife: 80 + Math.floor(Math.random() * 40),
            size: 3 + Math.random() * 5,
            color,
            angle: Math.random() * 360,
            angleSpeed: (Math.random() - 0.5) * 3,
          })
        }
      }

      // Draw connecting lines in trail
      if (trail.length > 1) {
        for (let i = 0; i < trail.length - 1; i++) {
          const a = trail[i], b = trail[i + 1]
          const alpha = (a.life / trailMaxLife) * 0.25
          const lineW = Math.max(1, 3 * (a.life / trailMaxLife))
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(255, 240, 200, ${alpha})`
          ctx.lineWidth = lineW
          ctx.stroke()
        }
      }

      // Draw spark core
      const glowGrad = ctx.createRadialGradient(sparkX, sparkY, 0, sparkX, sparkY, 16)
      glowGrad.addColorStop(0, 'rgba(255,240,200,0.6)')
      glowGrad.addColorStop(1, 'rgba(255,240,200,0)')
      ctx.fillStyle = glowGrad
      ctx.fillRect(sparkX - 16, sparkY - 16, 32, 32)
      ctx.beginPath()
      ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#FFF0C8'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(sparkX - 1, sparkY - 1, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#FFF'
      ctx.fill()

      // Update & draw petals
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.995
        p.vy *= 0.995
        p.angle += p.angleSpeed
        p.life--
        if (p.life <= 0) { petals.splice(i, 1); continue }
        const alpha = p.life / p.maxLife
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.angle * Math.PI) / 180)
        // Draw petal as ellipse
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${alpha * 0.8})`
        ctx.fill()
        ctx.restore()
      }

      // Keep petals manageable
      if (petals.length > 500) petals.splice(0, 100)

      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [active, config])

  return (
    <section className="effect-section petal-trail-section fade-in-scroll">
      <h3 className="section-title">{config.heartPetalTrailTitle}</h3>
      <p className="effect-subtitle">{config.heartPetalTrailSubtitle}</p>
      {!active ? (
        <button className="btn btn-soft effect-btn" onClick={() => setActive(true)}>
          {config.heartPetalTrailButtonText}
        </button>
      ) : (
        <div className="effect-canvas-wrap petal-trail-wrap">
          <canvas ref={canvasRef} className="effect-canvas petal-canvas" />
          <button className="btn btn-close-effect" onClick={() => setActive(false)}>关闭</button>
        </div>
      )}
    </section>
  )
}

export { MultiLangHeart, LoveDanmaku, LoveQuotePopups, CarePopups, HeartPetalTrail }

