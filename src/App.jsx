import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import letterConfig from './data/letter.js'

/* ── Heart Burst overlay ── */
const HEART_COUNT = 128
const HEART_COLORS = ['#ff2f7d', '#ff5fa2', '#ff9fc5', '#ffd166', '#ffffff', '#ff477e', '#ffb3c1', '#ff006e']

function HeartBurst({ onClose }) {
  const [countdown, setCountdown] = useState(3)
  const [phase, setPhase] = useState('counting') // counting | love | fading

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((n) => n - 1), 1000)
      return () => clearTimeout(t)
    }
    setPhase('love')
    const t2 = setTimeout(() => setPhase('fading'), 5200)
    return () => clearTimeout(t2)
  }, [countdown])

  useEffect(() => {
    if (phase === 'fading') {
      const t = setTimeout(onClose, 900)
      return () => clearTimeout(t)
    }
  }, [phase, onClose])

  const hearts = Array.from({ length: HEART_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / HEART_COUNT
    const ring = i % 5
    const size = 12 + ring * 7 + Math.random() * 22
    const left = 50 + Math.cos(angle) * (10 + ring * 9) + (Math.random() - 0.5) * 16
    const delay = 0.15 + (i % 28) * 0.026
    const duration = 2.4 + Math.random() * 2.2
    const color = HEART_COLORS[i % HEART_COLORS.length]
    const rotate = -70 + Math.random() * 140
    const burstX = Math.cos(angle) * (42 + ring * 13)
    const burstY = Math.sin(angle) * (34 + ring * 10)
    return { size, left, delay, duration, color, rotate, burstX, burstY, id: i }
  })

  const beams = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    rotate: i * 20,
    delay: (i % 6) * 0.08,
  }))

  const vows = ['冉冉高考加油', '杜昊翔一直在想你', '你会闪闪发光', '你一定会去理想的地方']

  return (
    <div
      className={`heart-burst-overlay phase-${phase} ${phase === 'fading' ? 'is-fading' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-label="我喜欢你"
    >
      <div className="heart-burst-cinema-bg" />
      <div className="heart-burst-white-flash" />
      <div className="heart-burst-beams" aria-hidden="true">
        {beams.map(({ id, rotate, delay }) => (
          <span key={id} style={{ '--beam-rotate': `${rotate}deg`, '--beam-delay': `${delay}s` }} />
        ))}
      </div>
      <div className="heart-burst-hearts" aria-hidden="true">
        {hearts.map(({ id, size, left, delay, duration, color, rotate, burstX, burstY }) => (
          <span
            key={id}
            className="burst-heart"
            style={{
              left: `${left}%`,
              fontSize: `${size}px`,
              color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              '--rotate': `${rotate}deg`,
              '--burst-x': `${burstX}vw`,
              '--burst-y': `${burstY}vh`,
            }}
          >
            ❤
          </span>
        ))}
      </div>
      <div className="heart-burst-shockwaves" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="heart-burst-vows" aria-hidden="true">
        {vows.map((vow, index) => (
          <span key={vow} style={{ '--vow-i': index }}>{vow}</span>
        ))}
      </div>
      <div className="heart-burst-center" aria-live="polite">
        {phase === 'counting' && (
          <>
            <span className="heart-burst-ready">准备把这一颗心送给杨星冉</span>
            <span key={countdown} className="heart-burst-number">{countdown}</span>
          </>
        )}
        {phase !== 'counting' && (
          <>
            <div className="heart-burst-mega-heart">
              <span>❤</span>
            </div>
            <div className="heart-burst-confession">
              <span>杨星冉</span>
              <strong>我真的很想你</strong>
              <p>不管这段时间有多辛苦，都希望你记得：你已经很棒了，我也一直在认真为你加油。</p>
            </div>
          </>
        )}
        <p className="heart-burst-hint">点击任意位置关闭</p>
      </div>
    </div>
  )
}

/* ── Confession Dialog ── */
const CONFESSION_REPLIES = [
  '谢谢宝宝。',
  '其实等这个答案好久了。',
  '以后我会认真喜欢你的。',
  '现在可以打开你的信了。',
]

const NO_MESSAGES = [
  '那再想想？',
  '我可以等的。',
  '反正这个按钮快要消失了。',
]

function ConfessionDialog({ onConfirm }) {
  const [rejectCount, setRejectCount] = useState(0)
  const [phase, setPhase] = useState('ask') // ask | replied
  const [shownReplies, setShownReplies] = useState([])
  const [noPos, setNoPos] = useState({ x: null, y: null })
  const noRef = useRef(null)

  const handleYes = () => {
    setPhase('replied')
    CONFESSION_REPLIES.forEach((line, i) => {
      setTimeout(() => {
        setShownReplies((prev) => [...prev, line])
        if (i === CONFESSION_REPLIES.length - 1) {
          setTimeout(onConfirm, 1400)
        }
      }, i * 1400)
    })
  }

  const handleNo = () => {
    const next = rejectCount + 1
    setRejectCount(next)
    if (next >= 2) {
      const btn = noRef.current
      if (btn) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const bw = btn.offsetWidth
        const bh = btn.offsetHeight
        const nx = Math.random() * (vw - bw)
        const ny = Math.random() * (vh - bh)
        setNoPos({ x: nx, y: ny })
      }
    }
  }

  const noStyle =
    noPos.x !== null
      ? { position: 'fixed', left: noPos.x, top: noPos.y, zIndex: 10001 }
      : {}

  return (
    <div className="confession-overlay" role="dialog" aria-modal="true" aria-label="告白确认">
      <div className="confession-card">
        {phase === 'ask' ? (
          <>
            <span className="confession-icon">💌</span>
            <p className="confession-question">宝宝，你喜欢我吗？</p>
            {rejectCount > 0 && (
              <p className="confession-no-msg">
                {NO_MESSAGES[Math.min(rejectCount - 1, NO_MESSAGES.length - 1)]}
              </p>
            )}
            <div className="confession-buttons">
              <button className="btn btn-confession-yes" type="button" onClick={handleYes}>
                喜欢 💗
              </button>
              {rejectCount < 3 && (
                <button
                  ref={noRef}
                  className="btn btn-confession-no"
                  type="button"
                  style={noStyle}
                  onMouseEnter={rejectCount >= 2 ? handleNo : undefined}
                  onClick={rejectCount < 2 ? handleNo : undefined}
                >
                  不喜欢
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="confession-replies">
            <span className="confession-icon">🌸</span>
            {shownReplies.map((line) => (
              <p key={line} className="confession-reply-line fade-in">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Cursor hearts ── */
function CursorHearts() {
  const [sparks, setSparks] = useState([])
  const counterRef = useRef(0)

  const handleMove = useCallback((e) => {
    const x = e.clientX ?? e.touches?.[0]?.clientX
    const y = e.clientY ?? e.touches?.[0]?.clientY
    if (x == null) return
    const id = counterRef.current++
    setSparks((prev) => [...prev.slice(-28), { id, x, y }])
    setTimeout(() => setSparks((prev) => prev.filter((s) => s.id !== id)), 900)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
    }
  }, [handleMove])

  return (
    <div className="cursor-hearts" aria-hidden="true">
      {sparks.map(({ id, x, y }) => (
        <span key={id} className="cursor-heart" style={{ left: x, top: y }}>❤</span>
      ))}
    </div>
  )
}

/* ── Petal rain ── */
const PETAL_COUNT = 22
function PetalRain() {
  const petals = Array.from({ length: PETAL_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 12,
    duration: 7 + Math.random() * 8,
    size: 10 + Math.random() * 14,
    rotate: Math.random() * 360,
    drift: -30 + Math.random() * 60,
  }))
  return (
    <div className="petal-rain" aria-hidden="true">
      {petals.map(({ id, left, delay, duration, size, rotate, drift }) => (
        <span
          key={id}
          className="petal"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            fontSize: `${size}px`,
            '--rotate': `${rotate}deg`,
            '--drift': `${drift}px`,
          }}
        >
          🌸
        </span>
      ))}
    </div>
  )
}

/* ── Spin wheel ── */
function SpinWheel({ items }) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [deg, setDeg] = useState(0)

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    const winIndex = Math.floor(Math.random() * items.length)
    const sliceDeg = 360 / items.length
    const targetDeg = deg + 1440 + (360 - winIndex * sliceDeg - sliceDeg / 2)
    setDeg(targetDeg)
    setTimeout(() => {
      setResult(items[winIndex])
      setSpinning(false)
    }, 3200)
  }

  const sliceDeg = 360 / items.length
  const colors = ['#fce4ec', '#f8bbd0', '#f48fb1', '#ffd8e4', '#ffe0b2', '#fff9c4', '#e8f5e9', '#e3f2fd']

  return (
    <div className="spinwheel-wrap">
      <div className="spinwheel-container">
        <div className="spinwheel-pointer">▼</div>
        <svg
          className="spinwheel"
          viewBox="0 0 200 200"
          style={{ transform: `rotate(${deg}deg)`, transition: spinning ? 'transform 3.2s cubic-bezier(0.17,0.67,0.12,1)' : 'none' }}
        >
          {items.map((item, i) => {
            const startAngle = i * sliceDeg
            const endAngle = startAngle + sliceDeg
            const toRad = (a) => (a * Math.PI) / 180
            const x1 = 100 + 100 * Math.cos(toRad(startAngle - 90))
            const y1 = 100 + 100 * Math.sin(toRad(startAngle - 90))
            const x2 = 100 + 100 * Math.cos(toRad(endAngle - 90))
            const y2 = 100 + 100 * Math.sin(toRad(endAngle - 90))
            const midAngle = startAngle + sliceDeg / 2 - 90
            const tx = 100 + 62 * Math.cos(toRad(midAngle))
            const ty = 100 + 62 * Math.sin(toRad(midAngle))
            return (
              <g key={item}>
                <path
                  d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                  fill={colors[i % colors.length]}
                  stroke="rgba(200,120,140,0.18)"
                  strokeWidth="1"
                />
                <text
                  x={tx} y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7"
                  fill="#8d5a6a"
                  transform={`rotate(${midAngle + 90},${tx},${ty})`}
                >
                  {item.length > 10 ? item.slice(0, 9) + '…' : item}
                </text>
              </g>
            )
          })}
          <circle cx="100" cy="100" r="12" fill="white" stroke="rgba(200,120,140,0.3)" strokeWidth="1.5" />
        </svg>
      </div>
      <button className="btn btn-soft spinwheel-btn" type="button" onClick={spin} disabled={spinning}>
        {spinning ? '转动中…' : result ? '再转一次' : '开始转动'}
      </button>
      {result && (
        <div className="spinwheel-result fade-in">
          <span>🎉</span>
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}

/* ── Sweetness quiz ── */
function SweetnessQuiz({ questions, levels }) {
  const [answers, setAnswers] = useState({})
  const allDone = Object.keys(answers).length === questions.length

  const totalScore = Object.entries(answers).reduce((sum, [qi, oi]) => {
    return sum + (questions[qi]?.scores[oi] ?? 0)
  }, 0)

  const level = levels.find((l) => totalScore >= l.min && totalScore <= l.max)

  return (
    <div className="sweetness-wrap">
      {questions.map((q, qi) => (
        <div key={q.question} className="sweetness-question">
          <p className="quiz-question">{qi + 1}. {q.question}</p>
          <div className="quiz-options">
            {q.options.map((opt, oi) => (
              <button
                key={opt}
                type="button"
                className={`quiz-option ${answers[qi] === oi ? 'is-selected' : ''}`}
                onClick={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      {allDone && level && (
        <div className="sweetness-result fade-in">
          <p className="sweetness-label">今日甜度：{level.label} 🧋</p>
          <p className="sweetness-desc">{level.desc}</p>
        </div>
      )}
    </div>
  )
}

/* ── Timeline ── */
function Timeline({ events }) {
  return (
    <div className="timeline">
      {events.map((ev, i) => (
        <div key={ev.date} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
          <div className="timeline-dot" />
          <div className="timeline-card">
            <span className="timeline-date">{ev.date}</span>
            <p className="timeline-text">{ev.text}</p>
          </div>
        </div>
      ))}
      <div className="timeline-line" />
    </div>
  )
}

/* ── 520 Countdown ── */
function Countdown520() {
  const getNext520 = () => {
    const now = new Date()
    let next = new Date(now.getFullYear(), 4, 20, 0, 0, 0)
    if (now >= next) next = new Date(now.getFullYear() + 1, 4, 20, 0, 0, 0)
    return next
  }

  const calc = () => {
    const diff = getNext520() - new Date()
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { d, h, m, s }
  }

  const [time, setTime] = useState(calc)

  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="countdown-wrap">
      <p className="countdown-label">{letterConfig.countdownTitle}</p>
      <div className="countdown-digits">
        {[{ v: time.d, u: '天' }, { v: time.h, u: '时' }, { v: time.m, u: '分' }, { v: time.s, u: '秒' }].map(({ v, u }) => (
          <div key={u} className="countdown-unit">
            <span className="countdown-num">{String(v).padStart(2, '0')}</span>
            <span className="countdown-unit-label">{u}</span>
          </div>
        ))}
      </div>
      <p className="countdown-sub">等到下一个 520，我还是会喜欢你。</p>
    </div>
  )
}

/* ── Floating particles ── */
function Particles() {
  const items = Array.from({ length: 18 }, (_, i) => i)
  return (
    <div className="particles" aria-hidden="true">
      {items.map((i) => (
        <span
          key={i}
          className={`particle ${i % 3 === 0 ? 'heart' : 'dot'}`}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            fontSize: `${8 + Math.random() * 10}px`,
            opacity: 0.25 + Math.random() * 0.35,
          }}
        />
      ))}
    </div>
  )
}

/* ── Music button ── */
function MusicButton() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {
        setFailed(true)
        setTimeout(() => setFailed(false), 3000)
      })
    }
  }, [playing])

  return (
    <div className="music-control">
      <audio ref={audioRef} src={letterConfig.musicPath} loop preload="auto" />
      <button className="btn btn-music" onClick={toggle} aria-label="播放音乐">
        {playing ? '🎵 音乐播放中…' : `🎵 ${letterConfig.musicButtonText}`}
      </button>
      {failed && <p className="music-hint">暂时无法播放，再点一次试试</p>}
    </div>
  )
}

/* ── Typewriter text ── */
function TypewriterText({ text, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!visible) return null

  const lines = text.split('\n')
  return (
    <div ref={ref} className="typewriter-block fade-in">
      {lines.map((line, i) =>
        line === '' ? (
          <br key={i} />
        ) : (
          <p key={i} className="typewriter-line" style={{ animationDelay: `${i * 0.15}s` }}>
            {line}
          </p>
        )
      )}
    </div>
  )
}

/* ── Photo card ── */
function PhotoCard({ photo }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="photo-card">
      {!imgError ? (
        <img
          src={photo.src}
          alt={photo.placeholder}
          className="photo-img"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="photo-placeholder">
          <span className="photo-placeholder-icon">📷</span>
          <p>{photo.placeholder}</p>
        </div>
      )}
    </div>
  )
}

function HeartPopupShow({ config }) {
  const [isOpen, setIsOpen] = useState(false)

  const points = Array.from({ length: 72 }, (_, index) => {
    const ring = index % 3
    const ringIndex = Math.floor(index / 3)
    const ringCount = Math.ceil(72 / 3)
    const t = (Math.PI * 2 * ringIndex) / ringCount + ring * 0.16
    const scale = 1 + ring * 0.34
    const x = 16 * Math.pow(Math.sin(t), 3) * scale
    const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale
    return {
      message: config.heartPopupMessages[index % config.heartPopupMessages.length],
      left: 50 + x * 2.05,
      top: 51 - y * 2.45,
      delay: index * 0.035,
      rotate: index % 2 === 0 ? -5 : 5,
      depth: ring,
    }
  })

  const sparks = Array.from({ length: 90 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 90
    const radius = 36 + (index % 5) * 11
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      delay: (index % 18) * 0.025,
      size: 4 + (index % 4),
    }
  })

  const orbitWords = ['很想你', '高考加油', '闪闪发光', '杜昊翔在想你', '杨星冉最棒']

  const overlay = (
    <div className="heart-popup-overlay" role="dialog" aria-modal="true" aria-label={config.heartPopupTitle}>
      <button className="heart-popup-close" onClick={() => setIsOpen(false)} aria-label="关闭满屏心动">
        ×
      </button>
      <div className="heart-popup-aurora" />
      <div className="heart-popup-flash" />
      <div className="heart-popup-stage">
        <div className="heart-popup-heart-core" />
        <div className="heart-popup-orbit">
          {orbitWords.map((word, index) => (
            <span key={word} style={{ '--orbit-i': index }}>
              {word}
            </span>
          ))}
        </div>
        {sparks.map((spark, index) => (
          <i
            key={index}
            className="heart-popup-spark"
            style={{
              '--spark-x': `${spark.x}vw`,
              '--spark-y': `${spark.y}vh`,
              '--spark-delay': `${spark.delay}s`,
              '--spark-size': `${spark.size}px`,
            }}
          />
        ))}
        {points.map((point, index) => (
          <div
            key={`${point.message}-${index}`}
            className={`heart-popup-card depth-${point.depth}`}
            style={{
              left: `${point.left}%`,
              top: `${point.top}%`,
              animationDelay: `${point.delay}s`,
              '--card-rotate': `${point.rotate}deg`,
            }}
          >
            {point.message}
          </div>
        ))}
        <div className="heart-popup-center">
          <em>TO</em>
          <span>{config.heartPopupCenterTitle}</span>
          <strong>{config.heartPopupCenterText}</strong>
          <small>杜昊翔的满屏心动</small>
        </div>
      </div>
    </div>
  )

  return (
    <section className="heart-popup-section fade-in-scroll">
      <h3 className="section-title">{config.heartPopupTitle}</h3>
      <p className="heart-popup-subtitle">{config.heartPopupSubtitle}</p>
      <button className="btn heart-popup-trigger" onClick={() => setIsOpen(true)}>
        {config.heartPopupButtonText}
      </button>

      {isOpen && createPortal(overlay, document.body)}
    </section>
  )
}

function StarUniverse({ config }) {
  const [litPlanets, setLitPlanets] = useState([])
  const [activePlanetId, setActivePlanetId] = useState(config.starUniversePlanets[0]?.id)

  const activePlanet = config.starUniversePlanets.find((planet) => planet.id === activePlanetId) || config.starUniversePlanets[0]
  const complete = litPlanets.length === config.starUniversePlanets.length

  const lightPlanet = (planetId) => {
    setActivePlanetId(planetId)
    setLitPlanets((current) => current.includes(planetId) ? current : [...current, planetId])
  }

  return (
    <section className="star-universe-section fade-in-scroll">
      <div className="star-universe-sky" aria-hidden="true">
        {Array.from({ length: 28 }, (_, index) => (
          <span
            key={index}
            className="star-universe-spark"
            style={{
              left: `${(index * 29) % 100}%`,
              top: `${(index * 47) % 100}%`,
              animationDelay: `${(index % 9) * 0.28}s`,
            }}
          />
        ))}
      </div>
      <div className="star-universe-header">
        <span className="star-universe-kicker">Only for 小羊</span>
        <h3>{config.starUniverseTitle}</h3>
        <p>{config.starUniverseSubtitle}</p>
      </div>
      <div className="star-universe-orbit">
        {config.starUniversePlanets.map((planet, index) => {
          const lit = litPlanets.includes(planet.id)
          return (
            <button
              key={planet.id}
              className={`star-planet star-planet-${index + 1} ${lit ? 'is-lit' : ''}`}
              onClick={() => lightPlanet(planet.id)}
              type="button"
            >
              <span className="star-planet-emoji">{planet.emoji}</span>
              <span>{planet.name}</span>
            </button>
          )
        })}
      </div>
      <article className="star-universe-message">
        <span>{activePlanet?.name}</span>
        <p>{activePlanet?.text}</p>
      </article>
      <div className="star-universe-progress">
        {config.starUniverseProgressText} {litPlanets.length} / {config.starUniversePlanets.length} 颗星球
      </div>
      {complete && (
        <div className="star-universe-complete">
          <strong>{config.starUniverseCompleteTitle}</strong>
          <p>{config.starUniverseCompleteText}</p>
        </div>
      )}
    </section>
  )
}

function LoveBlindBox({ config }) {
  const [isOpening, setIsOpening] = useState(false)
  const [rewardIndex, setRewardIndex] = useState(null)

  const openBox = () => {
    if (isOpening) return
    setIsOpening(true)
    setTimeout(() => {
      const nextIndex =
        config.blindBoxRewards.length > 1
          ? (() => {
              let next
              do {
                next = Math.floor(Math.random() * config.blindBoxRewards.length)
              } while (next === rewardIndex)
              return next
            })()
          : 0
      setRewardIndex(nextIndex)
      setIsOpening(false)
    }, 750)
  }

  const reward = rewardIndex != null ? config.blindBoxRewards[rewardIndex] : null

  return (
    <section className="love-blind-box-section fade-in-scroll">
      <h3 className="section-title">{config.blindBoxTitle}</h3>
      <p className="love-blind-box-subtitle">{config.blindBoxSubtitle}</p>

      <div className="love-blind-box-stage">
        <div className={`love-blind-box ${isOpening ? 'is-shaking' : ''} ${reward ? 'is-open' : ''}`}>
          <div className="love-blind-box-ribbon" />
          <div className="love-blind-box-lid" />
        </div>

        {reward && (
          <div className="love-blind-box-reward">
            <span className="love-blind-box-reward-title">{reward.title}</span>
            <p>{reward.text}</p>
          </div>
        )}

        <button
          className="btn love-blind-box-btn"
          onClick={openBox}
          disabled={isOpening}
        >
          {reward ? config.blindBoxAgainText : config.blindBoxButtonText}
        </button>
      </div>
    </section>
  )
}

function SweetStampBook({ config }) {
  const [stampedIds, setStampedIds] = useState([])
  const [activeStampId, setActiveStampId] = useState(config.stampBookStamps[0]?.id)

  const activeStamp = config.stampBookStamps.find((stamp) => stamp.id === activeStampId) || config.stampBookStamps[0]
  const complete = stampedIds.length === config.stampBookStamps.length

  const stampIt = (stampId) => {
    setActiveStampId(stampId)
    setStampedIds((current) => current.includes(stampId) ? current : [...current, stampId])
  }

  return (
    <section className="sweet-stamp-section fade-in-scroll">
      <div className="sweet-stamp-paper">
        <div className="sweet-stamp-header">
          <span>Sweet Passport</span>
          <h3>{config.stampBookTitle}</h3>
          <p>{config.stampBookSubtitle}</p>
        </div>

        <div className="sweet-stamp-grid">
          {config.stampBookStamps.map((stamp, index) => {
            const stamped = stampedIds.includes(stamp.id)
            const active = activeStamp?.id === stamp.id
            return (
              <button
                key={stamp.id}
                className={`sweet-stamp-slot ${stamped ? 'is-stamped' : ''} ${active ? 'is-active' : ''}`}
                onClick={() => stampIt(stamp.id)}
                style={{ animationDelay: `${index * 0.06}s` }}
                type="button"
              >
                <span className="sweet-stamp-mark">{stamp.mark}</span>
                <span className="sweet-stamp-label">{stamp.label}</span>
              </button>
            )
          })}
        </div>

        <article className="sweet-stamp-note">
          <strong>{activeStamp?.label}</strong>
          <p>{activeStamp?.text}</p>
        </article>

        <div className="sweet-stamp-progress">
          {config.stampBookProgressText} {stampedIds.length} / {config.stampBookStamps.length}
        </div>

        {complete && (
          <div className="sweet-stamp-complete">
            <strong>{config.stampBookCompleteTitle}</strong>
            <p>{config.stampBookCompleteText}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function WhisperEnvelopes({ config }) {
  const [openedIds, setOpenedIds] = useState([])

  const toggle = (id) => {
    setOpenedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <section className="whisper-section fade-in-scroll">
      <h3 className="section-title">{config.whisperTitle}</h3>
      <p className="whisper-subtitle">{config.whisperSubtitle}</p>
      <div className="whisper-grid">
        {config.whisperEnvelopes.map((env, index) => {
          const isOpen = openedIds.includes(env.id)
          return (
            <div
              key={env.id}
              className={`whisper-envelope ${isOpen ? 'is-open' : ''}`}
              style={{ '--env-color': env.color, animationDelay: `${index * 0.1}s` }}
              onClick={() => toggle(env.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggle(env.id)}
            >
              <div className="whisper-envelope-flap" />
              <div className="whisper-envelope-body">
                <span className="whisper-envelope-seal">♡</span>
              </div>
              <div className="whisper-note">
                <p>{env.note}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function WishBottle({ config }) {
  const [isShaking, setIsShaking] = useState(false)
  const [wishIndex, setWishIndex] = useState(null)

  const shake = () => {
    if (isShaking) return
    setIsShaking(true)
    setTimeout(() => {
      const next = (() => {
        if (config.wishBottleWishes.length <= 1) return 0
        let n
        do { n = Math.floor(Math.random() * config.wishBottleWishes.length) }
        while (n === wishIndex)
        return n
      })()
      setWishIndex(next)
      setIsShaking(false)
    }, 700)
  }

  const wish = wishIndex != null ? config.wishBottleWishes[wishIndex] : null

  return (
    <section className="wish-bottle-section fade-in-scroll">
      <h3 className="section-title">{config.wishBottleTitle}</h3>
      <p className="wish-bottle-subtitle">{config.wishBottleSubtitle}</p>

      <div className="wish-bottle-stage">
        <div
          className={`wish-bottle ${isShaking ? 'is-shaking' : ''} ${wish ? 'has-wish' : ''}`}
          onClick={shake}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && shake()}
        >
          <div className="wish-bottle-glass">
            <div className="wish-bottle-neck" />
            <div className="wish-bottle-body">
              <div className="wish-bottle-liquid" />
              <span className="wish-bottle-icon">✦</span>
            </div>
            <div className="wish-bottle-cap" />
          </div>
        </div>

        {wish && (
          <div className="wish-bottle-card">
            <span className="wish-bottle-emoji">{wish.emoji}</span>
            <p>{wish.wish}</p>
          </div>
        )}

        <button className="btn wish-bottle-btn" onClick={shake} disabled={isShaking} type="button">
          {wish ? config.wishBottleAgainText : config.wishBottleShakeText}
        </button>
      </div>
    </section>
  )
}

function LoveWeather({ config }) {
  const [forecastIndex, setForecastIndex] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refresh = () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setTimeout(() => {
      const next = (() => {
        if (config.weatherForecasts.length <= 1) return 0
        let n
        do { n = Math.floor(Math.random() * config.weatherForecasts.length) }
        while (n === forecastIndex)
        return n
      })()
      setForecastIndex(next)
      setIsRefreshing(false)
    }, 500)
  }

  const forecast = forecastIndex != null ? config.weatherForecasts[forecastIndex] : null

  return (
    <section className="love-weather-section fade-in-scroll">
      <h3 className="section-title">{config.weatherTitle}</h3>
      <p className="love-weather-subtitle">{config.weatherSubtitle}</p>

      <div className="love-weather-card-wrap">
        <div className={`love-weather-card ${forecast ? 'has-forecast' : ''} ${isRefreshing ? 'is-refreshing' : ''}`}>
          {forecast ? (
            <>
              <div className="love-weather-top">
                <span className="love-weather-icon">{forecast.icon}</span>
                <div className="love-weather-info">
                  <strong className="love-weather-condition">{forecast.condition}</strong>
                  <span className="love-weather-temp">{forecast.temp}</span>
                </div>
              </div>
              <p className="love-weather-desc">{forecast.desc}</p>
            </>
          ) : (
            <div className="love-weather-placeholder">
              <span>🌡️</span>
              <p>点击下方按钮，查收今日专属天气</p>
            </div>
          )}
        </div>

        <button className="btn love-weather-btn" onClick={refresh} disabled={isRefreshing} type="button">
          {forecast ? config.weatherAgainText : config.weatherRefreshText}
        </button>
      </div>
    </section>
  )
}

function MedalWall({ config }) {
  const [unlockedIds, setUnlockedIds] = useState([])
  const [activeId, setActiveId] = useState(null)

  const unlock = (id) => {
    setActiveId(id)
    setUnlockedIds((prev) => prev.includes(id) ? prev : [...prev, id])
  }

  const complete = unlockedIds.length === config.medals.length
  const activeMedal = config.medals.find((m) => m.id === activeId)

  return (
    <section className="medal-wall-section fade-in-scroll">
      <h3 className="section-title">{config.medalTitle}</h3>
      <p className="medal-wall-subtitle">{config.medalSubtitle}</p>

      <div className="medal-wall-grid">
        {config.medals.map((medal, index) => {
          const unlocked = unlockedIds.includes(medal.id)
          const active = activeId === medal.id
          return (
            <button
              key={medal.id}
              className={`medal-slot ${unlocked ? 'is-unlocked' : ''} ${active ? 'is-active' : ''}`}
              onClick={() => unlock(medal.id)}
              style={{ animationDelay: `${index * 0.07}s` }}
              type="button"
              aria-label={medal.label}
            >
              <span className="medal-emoji">{medal.emoji}</span>
              <span className="medal-label">{unlocked ? medal.label : medal.hint}</span>
              {unlocked && <span className="medal-shine" />}
            </button>
          )
        })}
      </div>

      {activeMedal && (
        <div className="medal-desc-card">
          <span className="medal-desc-emoji">{activeMedal.emoji}</span>
          <div>
            <strong>{activeMedal.label}</strong>
            <p>{activeMedal.desc}</p>
          </div>
        </div>
      )}

      <div className="medal-progress">
        已解锁 {unlockedIds.length} / {config.medals.length} 枚勋章
      </div>

      {complete && (
        <div className="medal-complete">
          <strong>{config.medalCompleteTitle}</strong>
          <p>{config.medalCompleteText}</p>
        </div>
      )}
    </section>
  )
}

function DailyQuestion({ config }) {
  const [qIndex, setQIndex] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const draw = () => {
    const next = (() => {
      if (config.dailyQuestions.length <= 1) return 0
      let n
      do { n = Math.floor(Math.random() * config.dailyQuestions.length) }
      while (n === qIndex)
      return n
    })()
    setQIndex(next)
    setRevealed(false)
  }

  const current = qIndex != null ? config.dailyQuestions[qIndex] : null

  return (
    <section className="daily-q-section fade-in-scroll">
      <h3 className="section-title">{config.dailyQTitle}</h3>
      <p className="daily-q-subtitle">{config.dailyQSubtitle}</p>

      <div className="daily-q-stage">
        {current ? (
          <div className="daily-q-card">
            <p className="daily-q-question">{current.q}</p>
            {revealed ? (
              <div className="daily-q-answer">
                <span className="daily-q-answer-tag">我的答案</span>
                <p>{current.a}</p>
              </div>
            ) : (
              <button
                className="btn daily-q-reveal-btn"
                onClick={() => setRevealed(true)}
                type="button"
              >
                {config.dailyQRevealText}
              </button>
            )}
          </div>
        ) : (
          <div className="daily-q-empty">
            <span>💌</span>
            <p>点击下方按钮，抽一道只写给小羊的题目</p>
          </div>
        )}

        <div className="daily-q-actions">
          <button className="btn daily-q-draw-btn" onClick={draw} type="button">
            {current ? config.dailyQNextText : config.dailyQDrawText}
          </button>
        </div>
      </div>
    </section>
  )
}

function ShakeFortune({ config }) {
  const [fortune, setFortune] = useState(null)
  const [strength, setStrength] = useState(null)
  const [isShaking, setIsShaking] = useState(false)
  const lastShakeRef = useRef(0)
  const peakRef = useRef(0)

  const pickFortune = (level) => {
    const pool = config.shakeFortunesByStrength[level]
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const triggerShake = (peak) => {
    const now = Date.now()
    if (now - lastShakeRef.current < 1200) return
    lastShakeRef.current = now

    let level = 'gentle'
    if (peak > 55) level = 'strong'
    else if (peak > 28) level = 'medium'

    setIsShaking(true)
    setFortune(null)
    setStrength(null)
    setTimeout(() => {
      setFortune(pickFortune(level))
      setStrength(level)
      setIsShaking(false)
    }, 700)
  }

  const handleClick = () => {
    if (isShaking) return
    const mockPeak = 25 + Math.random() * 55
    triggerShake(mockPeak)
  }

  useEffect(() => {
    let permission = false

    const onMotion = (e) => {
      const a = e.accelerationIncludingGravity
      if (!a) return
      const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2)
      if (mag > peakRef.current) peakRef.current = mag
      if (mag > 18) {
        const peak = peakRef.current
        peakRef.current = 0
        triggerShake(peak)
      }
    }

    const requestMotion = async () => {
      if (typeof DeviceMotionEvent !== 'undefined' &&
          typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
          const res = await DeviceMotionEvent.requestPermission()
          if (res === 'granted') { window.addEventListener('devicemotion', onMotion); permission = true }
        } catch (_) {}
      } else if (typeof DeviceMotionEvent !== 'undefined') {
        window.addEventListener('devicemotion', onMotion)
        permission = true
      }
    }
    requestMotion()
    return () => { if (permission) window.removeEventListener('devicemotion', onMotion) }
  }, [])

  const strengthLabel = { gentle: '轻轻摇', medium: '用力摇', strong: '使劲摇！' }

  return (
    <section className="shake-section fade-in-scroll">
      <h3 className="section-title">{config.shakeTitle}</h3>
      <p className="shake-subtitle">{config.shakeSubtitle}</p>

      <div className="shake-stage">
        <div
          className={`shake-phone ${isShaking ? 'is-shaking' : ''} ${fortune ? 'has-fortune' : ''}`}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          aria-label={config.shakeBtnText}
        >
          <div className="shake-phone-body">
            <div className="shake-phone-screen">
              {isShaking ? (
                <span className="shake-phone-loading">✦</span>
              ) : fortune ? (
                <span className="shake-phone-emoji">{fortune.emoji}</span>
              ) : (
                <span className="shake-phone-hint">{config.shakeHint}</span>
              )}
            </div>
          </div>
        </div>

        {fortune && (
          <div className={`shake-fortune-card shake-strength-${strength}`}>
            {strength && (
              <span className="shake-strength-tag">{strengthLabel[strength]}</span>
            )}
            <strong className="shake-fortune-title">{fortune.title}</strong>
            <p>{fortune.text}</p>
          </div>
        )}

        <button
          className="btn shake-btn"
          onClick={handleClick}
          disabled={isShaking}
          type="button"
        >
          {fortune ? config.shakeAgainText : config.shakeBtnText}
        </button>
      </div>
    </section>
  )
}

function ReplyLetter({ config }) {
  const [input, setInput] = useState('')
  const [sent, setSent] = useState(null)
  const [reply, setReply] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef(null)

  const matchReply = (text) => {
    const lower = text.toLowerCase()
    for (const rule of config.replyRules) {
      if (rule.keywords.some((kw) => lower.includes(kw))) return rule
    }
    const pool = config.replyDefault
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const send = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setSent(trimmed)
    setReply(null)
    setIsTyping(true)
    setTimeout(() => {
      setReply(matchReply(trimmed))
      setIsTyping(false)
    }, 1200)
  }

  const reset = () => {
    setSent(null)
    setReply(null)
    setInput('')
    setIsTyping(false)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  return (
    <section className="reply-section fade-in-scroll">
      <h3 className="section-title">{config.replyTitle}</h3>
      <p className="reply-subtitle">{config.replySubtitle}</p>

      <div className="reply-stage">
        {!sent ? (
          <div className="reply-compose">
            <div className="reply-paper">
              <div className="reply-paper-header">
                <span className="reply-to">To: 我</span>
                <span className="reply-from">From: 小羊 🐑</span>
              </div>
              <textarea
                ref={textareaRef}
                className="reply-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={config.replyPlaceholder}
                maxLength={80}
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
                }}
              />
              <div className="reply-char-count">{input.length} / 80</div>
            </div>
            <button
              className="btn reply-send-btn"
              onClick={send}
              disabled={!input.trim()}
              type="button"
            >
              {config.replySendText}
            </button>
          </div>
        ) : (
          <div className="reply-conversation">
            <div className="reply-bubble reply-bubble-sent">
              <span className="reply-bubble-tag">小羊说</span>
              <p>{sent}</p>
            </div>

            {isTyping ? (
              <div className="reply-typing">
                <span /><span /><span />
              </div>
            ) : reply ? (
              <div className="reply-bubble reply-bubble-reply">
                <span className="reply-bubble-tag">我说 {reply.emoji}</span>
                <p>{reply.reply}</p>
              </div>
            ) : null}

            {reply && (
              <button className="btn reply-again-btn" onClick={reset} type="button">
                {config.replyAgainText}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

const CELL = 72  // px per grid cell
const SNAP_DIST = 38

function DragPuzzle({ config }) {
  const pieces = config.dragPieces
  const cols = Math.max(...pieces.map((p) => p.targetX)) + 1
  const rows = Math.max(...pieces.map((p) => p.targetY)) + 1

  const getInitialPositions = useCallback(() => {
    const positions = {}
    pieces.forEach((p, i) => {
      const angle = (i / pieces.length) * Math.PI * 2
      positions[p.id] = {
        x: 160 + Math.cos(angle) * 110,
        y: 260 + Math.sin(angle) * 80,
        snapped: false,
      }
    })
    return positions
  }, [pieces])

  const [positions, setPositions] = useState(getInitialPositions)
  const [dragging, setDragging] = useState(null)
  const [complete, setComplete] = useState(false)
  const boardRef = useRef(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  const getTargetPos = (piece) => ({
    x: 48 + piece.targetX * CELL,
    y: 12 + piece.targetY * CELL,
  })

  const onPointerDown = (e, id) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = boardRef.current.getBoundingClientRect()
    const pos = positions[id]
    dragOffset.current = {
      x: e.clientX - rect.left - pos.x,
      y: e.clientY - rect.top - pos.y,
    }
    setDragging(id)
  }

  const onPointerMove = (e) => {
    if (!dragging) return
    const rect = boardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.current.x
    const y = e.clientY - rect.top - dragOffset.current.y
    setPositions((prev) => ({ ...prev, [dragging]: { ...prev[dragging], x, y, snapped: false } }))
  }

  const onPointerUp = () => {
    if (!dragging) return
    const piece = pieces.find((p) => p.id === dragging)
    const target = getTargetPos(piece)
    const pos = positions[dragging]
    const dist = Math.hypot(pos.x - target.x, pos.y - target.y)

    setPositions((prev) => {
      const next = { ...prev }
      if (dist < SNAP_DIST) {
        next[dragging] = { x: target.x, y: target.y, snapped: true }
        const allSnapped = pieces.every((p) => p.id === dragging ? true : next[p.id]?.snapped)
        if (allSnapped) setTimeout(() => setComplete(true), 300)
      }
      return next
    })
    setDragging(null)
  }

  const reset = () => {
    setPositions(getInitialPositions())
    setComplete(false)
  }

  const boardH = rows * CELL + 80
  const boardW = cols * CELL + 96

  return (
    <section className="drag-puzzle-section fade-in-scroll">
      <h3 className="section-title">{config.dragTitle}</h3>
      <p className="drag-puzzle-subtitle">{config.dragSubtitle}</p>

      <div className="drag-puzzle-wrap">
        <div
          ref={boardRef}
          className="drag-puzzle-board"
          style={{ width: boardW, height: boardH + 160 }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Target slots */}
          {pieces.map((piece) => {
            const t = getTargetPos(piece)
            return (
              <div
                key={`slot-${piece.id}`}
                className="drag-slot"
                style={{ left: t.x, top: t.y, width: CELL - 8, height: CELL - 8 }}
              />
            )
          })}

          {/* Draggable pieces */}
          {pieces.map((piece) => {
            const pos = positions[piece.id]
            const isDraggingThis = dragging === piece.id
            return (
              <div
                key={piece.id}
                className={`drag-piece ${pos.snapped ? 'is-snapped' : ''} ${isDraggingThis ? 'is-dragging' : ''}`}
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: CELL - 8,
                  height: CELL - 8,
                  zIndex: isDraggingThis ? 100 : pos.snapped ? 10 : 5,
                  touchAction: 'none',
                }}
                onPointerDown={(e) => onPointerDown(e, piece.id)}
              >
                {piece.char}
              </div>
            )
          })}
        </div>

        {complete && (
          <div className="drag-complete">
            <strong>{config.dragCompleteTitle}</strong>
            <p>{config.dragCompleteText}</p>
          </div>
        )}

        <button className="btn drag-reset-btn" onClick={reset} type="button">
          重新拼
        </button>
      </div>
    </section>
  )
}

function TimeCapsule({ config }) {
  const [input, setInput] = useState('')
  const [sealed, setSealed] = useState(false)
  const [isSealing, setIsSealing] = useState(false)
  const textareaRef = useRef(null)

  const seal = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setIsSealing(true)
    setTimeout(() => {
      setSealed(true)
      setIsSealing(false)
    }, 1500)
  }

  const reset = () => {
    setInput('')
    setSealed(false)
    setIsSealing(false)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <section className="time-capsule-section fade-in-scroll">
      <h3 className="section-title">{config.timeCapsuleTitle}</h3>
      <p className="time-capsule-subtitle">{config.timeCapsuleSubtitle}</p>

      <div className="time-capsule-stage">
        {!sealed ? (
          <div className="time-capsule-compose">
            <div className="time-capsule-paper">
              <div className="time-capsule-date">{today}</div>
              <textarea
                ref={textareaRef}
                className="time-capsule-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={config.timeCapsulePlaceholder}
                maxLength={120}
                rows={4}
                disabled={isSealing}
              />
              <div className="time-capsule-char-count">{input.length} / 120</div>
            </div>

            <div className="time-capsule-capsule-preview">
              <div className={`capsule-container ${isSealing ? 'is-sealing' : ''}`}>
                <div className="capsule-body">
                  <div className="capsule-glass">
                    <div className="capsule-liquid" />
                  </div>
                  <div className="capsule-message-hint">
                    {input ? '准备封存……' : '等待写入'}
                  </div>
                </div>
                <div className="capsule-lid">
                  <span className="capsule-lid-icon">✦</span>
                </div>
              </div>
            </div>

            <button
              className="btn time-capsule-seal-btn"
              onClick={seal}
              disabled={!input.trim() || isSealing}
              type="button"
            >
              {isSealing ? (
                <span className="seal-loading">
                  <span className="seal-dot" />
                  <span className="seal-dot" />
                  <span className="seal-dot" />
                </span>
              ) : (
                config.timeCapsuleSealText
              )}
            </button>
          </div>
        ) : (
          <div className="time-capsule-sealed">
            <div className="sealed-capsule">
              <div className="sealed-capsule-body">
                <span className="sealed-capsule-icon">🔒</span>
                <div className="sealed-capsule-label">SEALED</div>
              </div>
              <div className="sealed-date">{today}</div>
            </div>

            <div className="sealed-message-card">
              <div className="sealed-title">{config.timeCapsuleSealedTitle}</div>
              <p className="sealed-text">{config.timeCapsuleSealedText}</p>
              <div className="sealed-original">
                <span className="sealed-tag">封存的话</span>
                <p>"{input}"</p>
              </div>
            </div>

            <button className="btn time-capsule-again-btn" onClick={reset} type="button">
              {config.timeCapsuleAgainText}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function GaokaoCheer({ config }) {
  const [daysLeft, setDaysLeft] = useState(null)
  const [currentCheer, setCurrentCheer] = useState(0)

  useEffect(() => {
    const target = new Date(config.gaokaoDate)
    target.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24))
    setDaysLeft(diff)
  }, [config.gaokaoDate])

  const nextCheer = () => {
    setCurrentCheer((prev) => (prev + 1) % config.gaokaoCheers.length)
  }

  const cheer = config.gaokaoCheers[currentCheer]

  let statusText = ''
  if (daysLeft === 1) statusText = config.gaokaoDayBeforeText
  else if (daysLeft === 0) statusText = config.gaokaoTodayText
  else if (daysLeft > 0) statusText = `${config.gaokaoCountdownPrefix} ${daysLeft} ${config.gaokaoCountdownSuffix}`
  else statusText = '高考已经结束，新的旅程开始了。'

  return (
    <section className="gaokao-section fade-in-scroll">
      <h3 className="section-title">{config.gaokaoTitle}</h3>
      <p className="gaokao-subtitle">{config.gaokaoSubtitle}</p>

      <div className="gaokao-countdown">
        <div className="gaokao-countdown-number">{daysLeft !== null ? Math.max(0, daysLeft) : '--'}</div>
        <div className="gaokao-countdown-label">{statusText}</div>
      </div>

      <div className="gaokao-card">
        <div className="gaokao-cheer">
          <span className="gaokao-emoji">{cheer.emoji}</span>
          <p className="gaokao-cheer-text">{cheer.text}</p>
        </div>
        <button className="btn gaokao-next-btn" onClick={nextCheer} type="button">
          换一句加油
        </button>
      </div>

      <div className="gaokao-messages">
        <div className="gaokao-message">
          <span className="gaokao-message-icon">💌</span>
          <p>{config.gaokaoMissText}</p>
        </div>
        <div className="gaokao-message">
          <span className="gaokao-message-icon">🌟</span>
          <p>{config.gaokaoExpectText}</p>
        </div>
      </div>
    </section>
  )
}

function MissingClock({ config }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const start = new Date(config.missClockStartDate)
  const diff = Math.max(0, now.getTime() - start.getTime())
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400) + 1
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const dateText = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  const timeText = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const wish = config.missClockWishes[Math.floor(totalSeconds / 8) % config.missClockWishes.length]

  return (
    <section className="missing-clock-section fade-in-scroll" aria-label={config.missClockTitle}>
      <div className="missing-clock-sparkles" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="missing-clock-header">
        <span className="missing-clock-kicker">Love Timer</span>
        <h3 className="section-title">{config.missClockTitle}</h3>
        <p>{config.missClockSubtitle}</p>
      </div>

      <div className="missing-clock-today">
        <span>{config.missClockDateLabel}</span>
        <strong>{dateText}</strong>
        <em>{timeText}</em>
      </div>

      <div className="missing-clock-counter">
        <p>{config.missClockSinceLabel}</p>
        <div className="missing-clock-grid">
          <div><strong>{days}</strong><span>天</span></div>
          <div><strong>{hours}</strong><span>时</span></div>
          <div><strong>{minutes}</strong><span>分</span></div>
          <div><strong>{seconds}</strong><span>秒</span></div>
        </div>
      </div>

      <div className="missing-clock-note">
        <span>💗</span>
        <p>{config.missClockNote}</p>
      </div>
      <div className="missing-clock-wish">{wish}</div>
    </section>
  )
}

function ParticleUniverse({ config }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false })
  const rafRef = useRef(null)
  const targetsRef = useRef([])
  const burstRef = useRef(0)
  const zoomRef = useRef(1.18)
  const touchDistanceRef = useRef(null)
  const [shapeIndex, setShapeIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const shapeName = config.particleUniverseShapes[shapeIndex]

  useEffect(() => {
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 560
    const count = isSmallScreen ? 760 : 1180
    const colors = ['#ffd6e8', '#ff9ac7', '#ff78b6', '#ffe0a8', '#b9ccff', '#c7a8ff']
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      x: (Math.random() - 0.5) * 520,
      y: (Math.random() - 0.5) * 360,
      z: (Math.random() - 0.5) * 260,
      vx: 0,
      vy: 0,
      vz: 0,
      px: 0,
      py: 0,
      tx: 0,
      ty: 0,
      tz: 0,
      radius: 0.55 + Math.random() * 1.85,
      color: colors[i % colors.length],
      phase: Math.random() * Math.PI * 2,
      energy: 0.45 + Math.random() * 1.15,
      orbit: Math.random() * Math.PI * 2,
    }))
  }, [])

  useEffect(() => {
    const makeTargets = () => {
      const total = particlesRef.current.length || 900
      if (shapeIndex === 1 && typeof document !== 'undefined') {
        const offscreen = document.createElement('canvas')
        offscreen.width = 620
        offscreen.height = 260
        let ctx = null
        try {
          ctx = offscreen.getContext('2d')
        } catch {
          ctx = null
        }
        if (!ctx) {
          return Array.from({ length: total }, (_, i) => {
            const row = Math.floor(i / 70)
            const col = i % 70
            return {
              x: (col - 35) * 6,
              y: (row % 10 - 5) * 18 + Math.sin(col * 0.5) * 14,
              z: (Math.random() - 0.5) * 70,
            }
          })
        }
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = 'bold 172px Microsoft YaHei, sans-serif'
        ctx.lineWidth = 16
        ctx.strokeStyle = '#fff'
        ctx.strokeText('冉冉', 310, 132)
        ctx.fillText('冉冉', 310, 132)
        const data = ctx.getImageData(0, 0, offscreen.width, offscreen.height).data
        const points = []
        for (let y = 8; y < offscreen.height; y += 4) {
          for (let x = 8; x < offscreen.width; x += 4) {
            if (data[(y * offscreen.width + x) * 4 + 3] > 80) {
              points.push({ x: (x - 310) * 0.84, y: (y - 132) * 0.84, z: (Math.random() - 0.5) * 22 })
            }
          }
        }
        return Array.from({ length: total }, (_, i) => {
          if (!points.length) return { x: 0, y: 0, z: 0 }
          const index = Math.floor((i * points.length) / total)
          const point = points[(index * 37) % points.length]
          return {
            x: point.x + (Math.random() - 0.5) * 1.2,
            y: point.y + (Math.random() - 0.5) * 1.2,
            z: point.z,
          }
        })
      }

      return Array.from({ length: total }, (_, i) => {
        const t = (Math.PI * 2 * i) / total
        const ring = i % 7
        const layer = Math.floor(i / 7) / Math.max(1, Math.floor(total / 7))
        if (shapeIndex === 0) {
          const heartT = t * 3.2
          const shell = 0.72 + (ring / 7) * 0.46
          const x = 16 * Math.pow(Math.sin(heartT), 3) * 11 * shell
          const y = -(13 * Math.cos(heartT) - 5 * Math.cos(2 * heartT) - 2 * Math.cos(3 * heartT) - Math.cos(4 * heartT)) * 11 * shell
          const z = Math.sin(layer * Math.PI * 2) * 92 + (ring - 3) * 18
          return { x, y, z }
        }
        if (shapeIndex === 2) {
          const band = ring % 3
          const radius = 82 + band * 54
          const wave = Math.sin(t * 6 + ring) * 18
          return {
            x: Math.cos(t * 2.6 + band * 0.9) * (radius + wave),
            y: Math.sin(t * 1.4 + band) * (radius * 0.34) + Math.sin(t * 10) * 6,
            z: Math.sin(t * 2.6 + band) * 170 + (ring - 3) * 18,
          }
        }
        if (shapeIndex === 3) {
          const stem = i / total
          const bloom = stem > 0.48
          const petal = Math.floor((stem - 0.48) * 18)
          const radius = bloom ? 36 + ring * 13 + Math.sin(t * 8) * 10 : 10 + stem * 48
          return {
            x: bloom ? Math.cos(t * 7 + petal) * radius : Math.sin(stem * Math.PI * 9) * 42,
            y: bloom ? -58 + Math.sin(t * 5 + petal) * 44 : 132 - stem * 210,
            z: bloom ? Math.sin(t * 7 + petal) * 82 : Math.cos(stem * Math.PI * 5) * 28,
          }
        }
        const sphere = Math.acos(1 - 2 * layer)
        const orbit = ring <= 1
        const ear = ring === 6
        return {
          x: ear ? Math.cos(t) * 62 + (i % 2 === 0 ? -96 : 96) : orbit ? Math.cos(t * 1.8) * 220 : Math.sin(sphere) * Math.cos(t * 8) * 122,
          y: ear ? -96 + Math.sin(t) * 36 : orbit ? Math.sin(t * 1.8) * 44 : Math.sin(sphere) * Math.sin(t * 8) * 116,
          z: ear ? Math.sin(t) * 42 : orbit ? Math.sin(t * 1.8) * 96 : Math.cos(sphere) * 126,
        }
      })
    }

    targetsRef.current = makeTargets()
    particlesRef.current.forEach((particle, i) => {
      const target = targetsRef.current[i % targetsRef.current.length]
      const blast = 5 + Math.random() * 10
      particle.vx += (Math.random() - 0.5) * blast
      particle.vy += (Math.random() - 0.5) * blast
      particle.vz += (Math.random() - 0.5) * blast
      particle.tx = target.x
      particle.ty = target.y
      particle.tz = target.z
    })
    burstRef.current = 1
  }, [shapeIndex])

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.userAgent.includes('jsdom')) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    let ctx = null
    try {
      ctx = canvas.getContext('2d')
    } catch {
      ctx = null
    }
    if (!ctx) return undefined
    let width = 0
    let height = 0
    let time = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    let frame = 0

    const render = () => {
      frame += 1
      time += 0.01
      if (canvas.width === 0 || canvas.height === 0 || width === 0) resize()
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(8, 4, 22, 0.32)'
      ctx.fillRect(0, 0, width, height)
      const pointer = pointerRef.current
      const px = (pointer.x - 0.5) * width
      const py = (pointer.y - 0.5) * height
      const centerX = width / 2
      const centerY = height / 2
      const burst = burstRef.current
      burstRef.current = Math.max(0, burstRef.current - 0.018)

      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.46)
      coreGradient.addColorStop(0, `rgba(255, 135, 190, ${0.08 + burst * 0.14})`)
      coreGradient.addColorStop(0.45, 'rgba(184, 146, 255, 0.035)')
      coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = coreGradient
      ctx.fillRect(0, 0, width, height)

      const projected = []

      particlesRef.current.forEach((particle, index) => {
        particle.vx += (particle.tx - particle.x) * 0.012
        particle.vy += (particle.ty - particle.y) * 0.012
        particle.vz += (particle.tz - particle.z) * 0.012
        particle.vx *= 0.9
        particle.vy *= 0.9
        particle.vz *= 0.9
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz

        const textMode = shapeIndex === 1
        const rotation = textMode ? (pointer.x - 0.5) * 0.18 : time * 0.46 + (pointer.x - 0.5) * 1.25
        const tilt = textMode ? (pointer.y - 0.5) * 0.08 : Math.sin(time * 0.7) * 0.28 + (pointer.y - 0.5) * 0.45
        const cos = Math.cos(rotation)
        const sin = Math.sin(rotation)
        const zoom = zoomRef.current
        const baseRx = particle.x * cos - particle.z * sin
        const baseRz = particle.x * sin + particle.z * cos
        let rx = baseRx * zoom
        let ry = (particle.y * Math.cos(tilt) - baseRz * Math.sin(tilt)) * zoom + Math.sin(time * 1.8 + particle.phase) * (textMode ? 1.4 : 6) + (pointer.y - 0.5) * (textMode ? 10 : 54)
        let rz = (particle.y * Math.sin(tilt) + baseRz * Math.cos(tilt)) * zoom

        if (pointer.active) {
          const dx = rx - px
          const dy = ry - py
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = Math.max(0, 1 - dist / 210)
          const strength = textMode ? 16 : 44
          rx += (dx / dist) * force * strength * particle.energy
          ry += (dy / dist) * force * strength * particle.energy
          rz += force * (textMode ? 22 : 74)
        }

        if (burst > 0) {
          const blast = burst * (textMode ? 24 : 68) * particle.energy
          rx += Math.cos(particle.phase) * blast
          ry += Math.sin(particle.phase) * blast
          rz += Math.sin(particle.phase * 1.7) * blast
        }

        const depth = 520 / (520 + rz)
        const sx = centerX + rx * depth
        const sy = centerY + ry * depth
        const alpha = Math.max(0.12, Math.min(textMode ? 0.88 : 0.74, 0.14 + depth * (textMode ? 0.62 : 0.44) + burst * 0.12))
        const radius = particle.radius * depth * (pointer.active ? 1.14 : 1) * (1 + burst * 0.24) * (textMode ? 1.16 : 1)
        projected.push({ sx, sy, radius, alpha, color: particle.color, depth, index })

        if (frame % 2 === 0 && index % 3 === 0 && particle.px && particle.py) {
          ctx.globalCompositeOperation = 'lighter'
          ctx.globalAlpha = alpha * 0.1
          ctx.strokeStyle = particle.color
          ctx.lineWidth = Math.max(0.18, radius * 0.22)
          ctx.beginPath()
          ctx.moveTo(particle.px, particle.py)
          ctx.lineTo(sx, sy)
          ctx.stroke()
        }

        particle.px = sx
        particle.py = sy
      })

      ctx.globalCompositeOperation = 'lighter'
      projected.slice(0, 120).forEach((a, i) => {
        if (i % 10 !== 0) return
        for (let j = i + 10; j < Math.min(projected.length, i + 34); j += 17) {
          const b = projected[j]
          const dx = a.sx - b.sx
          const dy = a.sy - b.sy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 44) {
            ctx.globalAlpha = (1 - dist / 44) * 0.07
            ctx.strokeStyle = '#ffd6e8'
            ctx.lineWidth = 0.45
            ctx.beginPath()
            ctx.moveTo(a.sx, a.sy)
            ctx.lineTo(b.sx, b.sy)
            ctx.stroke()
          }
        }
      })

      projected
        .sort((a, b) => a.depth - b.depth)
        .forEach((particle) => {
        ctx.globalAlpha = particle.alpha
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.index % 4 === 0 ? 10 : 0
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.sx, particle.sy, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      ctx.globalCompositeOperation = 'source-over'
      rafRef.current = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    const resizeTimer = setTimeout(resize, 80)
    rafRef.current = requestAnimationFrame(render)
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isFullscreen, shapeIndex])

  const updatePointer = (event) => {
    if (event.pointerType === 'touch') {
      const touches = event.currentTarget.hasPointerCapture?.(event.pointerId)
      if (touches) event.currentTarget.releasePointerCapture(event.pointerId)
    }
    const rect = event.currentTarget.getBoundingClientRect()
    pointerRef.current = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
      active: true,
    }
  }

  const handleWheel = (event) => {
    event.preventDefault()
    const nextZoom = zoomRef.current + (event.deltaY < 0 ? 0.08 : -0.08)
    zoomRef.current = Math.max(0.72, Math.min(2.35, nextZoom))
  }

  const handleTouchMove = (event) => {
    if (event.touches.length === 2) {
      event.preventDefault()
      const [a, b] = event.touches
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      if (touchDistanceRef.current) {
        const delta = (distance - touchDistanceRef.current) / 180
        zoomRef.current = Math.max(0.72, Math.min(2.35, zoomRef.current + delta))
      }
      touchDistanceRef.current = distance
    }
  }

  const handleTouchEnd = () => {
    touchDistanceRef.current = null
  }

  const nextShape = () => {
    setShapeIndex((index) => (index + 1) % config.particleUniverseShapes.length)
  }

  const closeFullscreen = (event) => {
    event.stopPropagation()
    setIsFullscreen(false)
  }

  const handleStageKeyDown = (event) => {
    if (event.key === 'Escape' && isFullscreen) {
      event.preventDefault()
      setIsFullscreen(false)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      nextShape()
    }
  }

  const stage = (
    <>
      <div className="particle-universe-copy">
        <span className="particle-universe-kicker">3D Love Particles</span>
        <h3 className="section-title">{config.particleUniverseTitle}</h3>
        <p>{config.particleUniverseSubtitle}</p>
      </div>
      <div
        className="particle-universe-stage"
        onPointerMove={updatePointer}
        onPointerLeave={() => { pointerRef.current.active = false }}
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={nextShape}
        onKeyDown={handleStageKeyDown}
        role="button"
        tabIndex={0}
        aria-label={config.particleUniverseButtonText}
      >
        <canvas ref={canvasRef} className="particle-universe-canvas" />
        <div className="particle-universe-overlay" aria-hidden="true" />
        <div key={shapeIndex} className="particle-universe-shockwave" aria-hidden="true" />
        {shapeIndex === 1 && <div className="particle-universe-text-guide" aria-hidden="true">冉冉</div>}
        <div className="particle-universe-shape">
          <span>正在绽放</span>
          <strong>{shapeName}</strong>
        </div>
      </div>
      <div className="particle-universe-controls">
        <p className="particle-universe-hint">{config.particleUniverseHint}</p>
        <button
          className="btn particle-universe-btn"
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            nextShape()
          }}
        >
          {config.particleUniverseButtonText}
        </button>
        {!isFullscreen && (
          <button className="btn particle-universe-fullscreen-btn" type="button" onClick={() => setIsFullscreen(true)}>
            全屏打开这片星河
          </button>
        )}
      </div>
    </>
  )

  return (
    <section className="particle-universe-section fade-in-scroll" aria-label={config.particleUniverseTitle}>
      {!isFullscreen && stage}
      {isFullscreen && createPortal(
        <div className="particle-universe-fullscreen" role="dialog" aria-modal="true" aria-label={config.particleUniverseTitle}>
          <button className="particle-universe-close" type="button" onClick={closeFullscreen} aria-label="关闭粒子宇宙">
            ×
          </button>
          {stage}
        </div>,
        document.body
      )}
    </section>
  )
}

const ICE_ROSE_SHARDS = Array.from({ length: 28 }, (_, i) => i)
const ICE_ROSE_SNOW = Array.from({ length: 36 }, (_, i) => i)
const ICE_ROSE_ORBIT_DOTS = Array.from({ length: 12 }, (_, i) => i)

function IceRoseShow({ config }) {
  const glowRef = useRef(null)
  const orbitRef = useRef(null)
  const coreRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    let t = 0
    const tick = () => {
      t += 0.012
      if (glowRef.current) {
        const s = 0.88 + 0.12 * Math.sin(t * 1.1)
        const op = 0.32 + 0.18 * Math.sin(t * 0.9)
        glowRef.current.style.transform = `translate(-50%, -50%) scale(${s})`
        glowRef.current.style.opacity = op
      }
      if (orbitRef.current) {
        const deg = (t * 18) % 360
        orbitRef.current.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`
      }
      if (coreRef.current) {
        const pulse = 1 + 0.07 * Math.sin(t * 2.2)
        const bright = 1 + 0.18 * Math.sin(t * 1.8)
        coreRef.current.style.transform = `translate(-50%, -50%) scale(${pulse})`
        coreRef.current.style.filter = `brightness(${bright}) drop-shadow(0 0 ${14 + 10 * Math.abs(Math.sin(t * 1.8))}px rgba(80,220,255,0.9))`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <section className="ice-rose-section fade-in-scroll" aria-label={config.iceRoseTitle}>
      <div className="ice-rose-copy">
        <span className="ice-rose-kicker">Frozen Rose</span>
        <h3 className="section-title">{config.iceRoseTitle}</h3>
        <p>{config.iceRoseSubtitle}</p>
      </div>
      <div className="ice-rose-stage" aria-hidden="true">
        <div className="ice-rose-code" aria-hidden="true">
          <span>✦ ICE</span><span>ROSE</span><span>FOR</span><span>冉冉</span>
        </div>
        <div className="ice-rose-meteor ice-rose-meteor-one" />
        <div className="ice-rose-meteor ice-rose-meteor-two" />
        <div className="ice-rose-meteor ice-rose-meteor-three" />
        <div className="ice-rose-shards" aria-hidden="true">
          {ICE_ROSE_SHARDS.map((i) => <span key={i} style={{ '--i': i }} />)}
        </div>
        <div className="ice-rose-snowfield" aria-hidden="true">
          {ICE_ROSE_SNOW.map((i) => <span key={i} style={{ '--i': i }} />)}
        </div>

        {/* rAF-driven radial glow halo */}
        <div ref={glowRef} className="ice-rose-raf-glow" aria-hidden="true" />

        {/* rAF-driven orbit ring with dots */}
        <div ref={orbitRef} className="ice-rose-raf-orbit" aria-hidden="true">
          {ICE_ROSE_ORBIT_DOTS.map((i) => (
            <span key={i} className="ice-rose-orbit-dot" style={{ '--i': i }} />
          ))}
        </div>

        <div className="ice-rose-bloom">
          <svg className="ice-rose-svg" viewBox="0 0 620 520" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="iceRosePetal" cx="38%" cy="22%" r="72%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
                <stop offset="22%" stopColor="rgba(120,238,255,0.88)" />
                <stop offset="52%" stopColor="rgba(36,111,255,0.48)" />
                <stop offset="100%" stopColor="rgba(255,145,194,0.72)" />
              </radialGradient>
              <radialGradient id="iceRosePetalInner" cx="42%" cy="28%" r="68%">
                <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                <stop offset="30%" stopColor="rgba(180,248,255,0.92)" />
                <stop offset="65%" stopColor="rgba(73,180,255,0.56)" />
                <stop offset="100%" stopColor="rgba(255,170,210,0.8)" />
              </radialGradient>
              <radialGradient id="iceRoseBlue" cx="44%" cy="36%" r="68%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="18%" stopColor="#b8f4ff" />
                <stop offset="42%" stopColor="#47dfff" />
                <stop offset="68%" stopColor="#176dff" />
                <stop offset="100%" stopColor="#ffb8d3" />
              </radialGradient>
              <radialGradient id="iceRoseGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(100,230,255,0.45)" />
                <stop offset="60%" stopColor="rgba(80,160,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,140,195,0)" />
              </radialGradient>
              <linearGradient id="iceRoseEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="50%" stopColor="rgba(147,228,255,0.7)" />
                <stop offset="100%" stopColor="rgba(255,180,220,0.5)" />
              </linearGradient>
              <filter id="iceGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="iceGlowStrong" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Background glow blob */}
            <ellipse className="ice-rose-svg-bglow" cx="310" cy="260" rx="130" ry="110" fill="url(#iceRoseGlow)" />

            {/* Stem */}
            <g className="ice-rose-svg-stem">
              <path d="M310 295 Q320 360 316 445" strokeWidth="10" />
              <path d="M312 338 Q288 358 268 348" />
              <path d="M313 372 Q336 385 352 376" />
              <path d="M311 310 Q304 345 308 380" strokeWidth="4" stroke="rgba(200,255,255,0.22)" />
            </g>

            {/* Outer petals — 12 petals */}
            <g className="ice-rose-svg-outer-petals" filter="url(#iceGlow)">
              {Array.from({ length: 12 }, (_, i) => (
                <g key={i} className={`petal-outer petal-o${i}`}>
                  <path
                    className="ice-rose-svg-petal"
                    d="M310 258 Q344 198 322 128 Q310 96 298 128 Q276 198 310 258Z"
                    transform={`rotate(${i * 30} 310 260)`}
                  />
                </g>
              ))}
            </g>

            {/* Mid petals — 8 petals offset */}
            <g className="ice-rose-svg-mid-petals" filter="url(#iceGlow)">
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i} className={`petal-mid petal-m${i}`}>
                  <path
                    fill="url(#iceRosePetalInner)"
                    stroke="rgba(200,250,255,0.7)"
                    strokeWidth="1.6"
                    opacity="0.88"
                    d="M310 258 Q336 218 318 162 Q310 136 302 162 Q284 218 310 258Z"
                    transform={`rotate(${i * 45 + 22.5} 310 260)`}
                  />
                </g>
              ))}
            </g>

            {/* Inner petals — 6 petals */}
            <g className="ice-rose-svg-inner-petals">
              {Array.from({ length: 6 }, (_, i) => (
                <g key={i} className={`petal-inner petal-i${i}`}>
                  <path
                    fill="rgba(230,252,255,0.92)"
                    stroke="rgba(255,255,255,0.88)"
                    strokeWidth="1.2"
                    opacity="0.94"
                    d="M310 258 Q324 232 314 192 Q310 174 306 192 Q296 232 310 258Z"
                    transform={`rotate(${i * 60 + 10} 310 260)`}
                  />
                </g>
              ))}
            </g>

            {/* Ice crystal star rays */}
            <g className="ice-rose-svg-rays" opacity="0.52">
              {Array.from({ length: 8 }, (_, i) => (
                <line
                  key={i}
                  className="ice-rose-svg-ray"
                  x1="310" y1="260"
                  x2={310 + 155 * Math.cos((i * 45 - 90) * Math.PI / 180)}
                  y2={260 + 155 * Math.sin((i * 45 - 90) * Math.PI / 180)}
                  stroke="rgba(180,244,255,0.38)"
                  strokeWidth="1"
                  strokeDasharray="3 8"
                />
              ))}
            </g>

            {/* Core */}
            <circle ref={coreRef} className="ice-rose-svg-core" cx="310" cy="260" r="34" filter="url(#iceGlowStrong)" />

            {/* Core shimmer ring */}
            <circle className="ice-rose-svg-core-ring" cx="310" cy="260" r="46" fill="none" stroke="rgba(180,248,255,0.38)" strokeWidth="1.5" />
            <circle className="ice-rose-svg-core-ring2" cx="310" cy="260" r="60" fill="none" stroke="rgba(255,180,220,0.22)" strokeWidth="1" strokeDasharray="4 6" />

            {/* Highlight trace */}
            <path className="ice-rose-svg-highlight" d="M290 238 Q308 224 332 234 Q346 246 340 266" />

            {/* Sparkle dots */}
            <g className="ice-rose-svg-sparkles">
              {[[230,170],[390,155],[410,310],[200,320],[310,105],[170,230],[450,225]].map(([x,y], i) => (
                <circle key={i} className={`ice-sparkle ice-sparkle-${i}`} cx={x} cy={y} r={i % 2 === 0 ? 3 : 2} fill="rgba(255,255,255,0.9)" filter="url(#iceGlow)" />
              ))}
            </g>
          </svg>
        </div>
        <div className="ice-rose-floor" />
      </div>
      <div className="ice-rose-controls">
        <p>{config.iceRoseNote}</p>
      </div>
    </section>
  )
}

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
    const danmakuTexts = config.loveDanmakuTexts || ['我爱你', '在一起', '冉冉']
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
      ctx.fillText('冉冉', w / 2, h / 2)

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

/* ── Standalone Effects Showcase (全部特效合集独立页面) ── */
function EffectsShowcase({ config, onBack }) {
  return (
    <div className="page effects-showcase-page">
      <Particles />
      <header className="effects-showcase-header">
        <button className="btn btn-soft effects-back-btn" onClick={onBack}>← 返回情书</button>
        <h1 className="effects-showcase-title">{config.effectsShowcaseTitle}</h1>
        <p className="effects-showcase-subtitle">{config.effectsShowcaseSubtitle}</p>
      </header>
      <main className="effects-showcase-body">
        <MultiLangHeart config={config} />
        <LoveDanmaku config={config} />
        <LoveQuotePopups config={config} />
        <CarePopups config={config} />
        <HeartPetalTrail config={config} />
      </main>
      <PetalRain />
      <CursorHearts />
    </div>
  )
}

function ChapterDivider({ kicker, title, text }) {
  return (
    <section className="chapter-divider fade-in-scroll">
      <span className="chapter-kicker">{kicker}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  )
}

function getVisitInfo() {
  const nav = navigator
  return [
    `访问页面：${window.location.href}`,
    `来源页面：${document.referrer || '直接打开 / 无来源'}`,
    `访问时间：${new Date().toLocaleString('zh-CN')}`,
    `语言：${nav.language || '未知'}`,
    `设备宽高：${window.innerWidth} × ${window.innerHeight}`,
    `屏幕宽高：${window.screen?.width || '未知'} × ${window.screen?.height || '未知'}`,
    `浏览器：${nav.userAgent || '未知'}`,
  ].join('\n')
}

function submitNetlifyForm(formName, payload) {
  const body = new URLSearchParams({ 'form-name': formName, ...payload })
  return fetch('/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  })
}

function NetlifyReplyForm({ summary, visitInfo, activityLog }) {
  const moods = ['想你了', '有点感动', '想抱抱', '今天有点累', '想偷偷说句话']
  const [mood, setMood] = useState(moods[0])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    setError('')

    try {
      const response = await submitNetlifyForm('ranran-reply', {
        mood,
        message,
        interactionSummary: summary,
        visitInfo,
        activityLog,
        submittedAt: new Date().toLocaleString('zh-CN'),
      })

      if (!response.ok) throw new Error('submit failed')
      setStatus('sent')
      setMessage('')
    } catch {
      setStatus('idle')
      setError('刚刚没有寄出去，等网络好一点再试一次好不好。')
    }
  }

  return (
    <section className="netlify-reply-section fade-in-scroll">
      <div className="netlify-reply-card">
        <span className="netlify-reply-kicker">Only You Can Send</span>
        <h3 className="section-title">给小羊宝宝的悄悄回信</h3>
        <p className="netlify-reply-subtitle">如果这一页让你有一点点想说的话，就把它悄悄寄给我。</p>

        <form
          name="ranran-reply"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          className="netlify-reply-form"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="ranran-reply" />
          <input type="hidden" name="interactionSummary" value={summary} />
          <input type="hidden" name="visitInfo" value={visitInfo} />
          <input type="hidden" name="activityLog" value={activityLog} />
          <input type="hidden" name="submittedAt" value={new Date().toLocaleString('zh-CN')} />
          <p className="hidden">
            <label>
              不要填写这个字段
              <input name="bot-field" />
            </label>
          </p>

          <div className="netlify-field-group">
            <span className="netlify-field-label">现在的小羊心情是</span>
            <div className="netlify-mood-grid">
              {moods.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`netlify-mood-btn ${mood === item ? 'is-selected' : ''}`}
                  onClick={() => setMood(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <input type="hidden" name="mood" value={mood} />
          </div>

          <label className="netlify-field-group">
            <span className="netlify-field-label">想对我说的话</span>
            <textarea
              className="netlify-reply-textarea"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="小羊宝宝想说什么都可以，我会认真看。"
              rows={5}
            />
          </label>

          <div className="netlify-summary-box">
            <span>会一起寄来的互动小记录</span>
            <p>{summary}</p>
          </div>

          <button className="btn netlify-reply-submit" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? '正在寄出...' : '把回信寄给你'}
          </button>

          {status === 'sent' && (
            <p className="netlify-reply-status is-success">收到啦，我会认真保存小羊宝宝的每一句话。</p>
          )}
          {error && <p className="netlify-reply-status is-error">{error}</p>}
        </form>
      </div>
    </section>
  )
}

/* ── Main App ── */
export default function App() {
  const [page, setPage] = useState('cover') // cover | gate | transition | letter | effects
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [openedEnvelopeIndexes, setOpenedEnvelopeIndexes] = useState([])
  const [fortune, setFortune] = useState('')
  const [quizAnswers, setQuizAnswers] = useState({})
  const [timeCapsuleOpen, setTimeCapsuleOpen] = useState(false)
  const [collectedStars, setCollectedStars] = useState([])
  const [heartBurst, setHeartBurst] = useState(false)
  const heartBurstShown = useRef(false)
  const [confessionDone, setConfessionDone] = useState(false)
  const [activityLog, setActivityLog] = useState([])
  const visitInfoRef = useRef('')
  const visitLoggedRef = useRef(false)

  const recordActivity = useCallback((text) => {
    const time = new Date().toLocaleString('zh-CN')
    setActivityLog((current) => [`${time}｜${text}`, ...current].slice(0, 80))
  }, [])

  useEffect(() => {
    if (page === 'letter' && !heartBurstShown.current) {
      heartBurstShown.current = true
      const t = setTimeout(() => setHeartBurst(true), 5000)
      return () => clearTimeout(t)
    }
  }, [page])

  useEffect(() => {
    if (page !== 'letter' || visitLoggedRef.current) return
    visitLoggedRef.current = true
    visitInfoRef.current = getVisitInfo()
    recordActivity('成功进入情书正文')
    submitNetlifyForm('ranran-visit-log', {
      visitedAt: new Date().toLocaleString('zh-CN'),
      visitInfo: visitInfoRef.current,
      activityLog: '成功进入情书正文',
      interactionSummary: '刚进入页面，暂时还没有互动',
    }).catch(() => {})
  }, [page, recordActivity])

  const handleOpenClick = () => {
    recordActivity('点击打开信封封面')
    setPage('gate')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() === letterConfig.passphrase) {
      setError('')
      recordActivity('输入正确暗号，进入情书')
      setPage('transition')
      setTimeout(() => setPage('letter'), 2000)
      setConfessionDone(false)
    } else {
      recordActivity(`尝试输入暗号失败：${input.trim() || '空'}`)
      setError(letterConfig.gateErrorText)
    }
  }

  const toggleMiniEnvelope = (index) => {
    const title = letterConfig.secretEnvelopes[index]?.title || `第 ${index + 1} 封`
    recordActivity(`点击小信封：${title}`)
    setOpenedEnvelopeIndexes((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    )
  }

  const drawFortune = () => {
    const nextIndex = fortune
      ? (letterConfig.fortunes.indexOf(fortune) + 1) % letterConfig.fortunes.length
      : Math.floor(Math.random() * letterConfig.fortunes.length)
    recordActivity(`抽取心动签：${letterConfig.fortunes[nextIndex]}`)
    setFortune(letterConfig.fortunes[nextIndex])
  }

  const chooseQuizAnswer = (questionIndex, option) => {
    recordActivity(`回答默契问答：${letterConfig.quizQuestions[questionIndex]?.question || questionIndex + 1} → ${option}`)
    setQuizAnswers((current) => ({ ...current, [questionIndex]: option }))
  }

  const toggleStar = (index) => {
    recordActivity(`点亮/取消星星：${letterConfig.stars[index] || index + 1}`)
    setCollectedStars((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    )
  }

  const openedEnvelopeTitles = openedEnvelopeIndexes
    .map((index) => letterConfig.secretEnvelopes[index]?.title)
    .filter(Boolean)
  const quizSummary = letterConfig.quizQuestions
    .map((quiz, index) => quizAnswers[index] ? `${quiz.question}：${quizAnswers[index]}` : null)
    .filter(Boolean)
  const latestStar = collectedStars.length > 0
    ? letterConfig.stars[collectedStars[collectedStars.length - 1]]
    : ''
  const interactionSummary = [
    `打开小信封：${openedEnvelopeTitles.length ? openedEnvelopeTitles.join('、') : '还没有打开'}`,
    `心动签：${fortune || '还没有抽'}`,
    `问答选择：${quizSummary.length ? quizSummary.join('；') : '还没有选择'}`,
    `点亮星星：${collectedStars.length} / ${letterConfig.stars.length}${latestStar ? `，最后一颗是“${latestStar}”` : ''}`,
    `时间胶囊：${timeCapsuleOpen ? '已打开' : '还没有打开'}`,
    `告白确认：${confessionDone ? '已确认喜欢' : '还没有确认'}`,
    `彩蛋按钮：${showEasterEgg ? '已打开' : '还没有打开'}`,
  ].join('\n')

  useEffect(() => {
    if (page !== 'letter') return undefined
    const sendFinalSnapshot = () => {
      const body = new URLSearchParams({
        'form-name': 'ranran-visit-log',
        visitedAt: new Date().toLocaleString('zh-CN'),
        visitInfo: visitInfoRef.current || getVisitInfo(),
        activityLog: activityLog.join('\n') || '没有记录到更多互动',
        interactionSummary,
      })
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/', body)
      } else {
        submitNetlifyForm('ranran-visit-log', {
          visitedAt: new Date().toLocaleString('zh-CN'),
          visitInfo: visitInfoRef.current || getVisitInfo(),
          activityLog: activityLog.join('\n') || '没有记录到更多互动',
          interactionSummary,
        }).catch(() => {})
      }
    }
    window.addEventListener('pagehide', sendFinalSnapshot)
    return () => window.removeEventListener('pagehide', sendFinalSnapshot)
  }, [page, activityLog, interactionSummary])

  /* ── Effects showcase page ── */
  if (page === 'effects') {
    return <EffectsShowcase config={letterConfig} onBack={() => setPage('letter')} />
  }

  /* ── Cover page ── */
  if (page === 'cover') {
    return (
      <div className="page cover-page">
        <Particles />
        <div className="envelope-wrapper fade-in">
          <div className="envelope">
            <div className="envelope-flap" />
            <div className="envelope-body">
              <span className="envelope-heart">💌</span>
            </div>
          </div>
        </div>
        <h1 className="cover-title fade-in">{letterConfig.coverTitle}</h1>
        <p className="cover-subtitle fade-in-delay">{letterConfig.coverSubtitle}</p>
        <button className="btn btn-primary fade-in-delay2" onClick={handleOpenClick}>
          {letterConfig.openButtonText}
        </button>
      </div>
    )
  }

  /* ── Gate (passphrase) page ── */
  if (page === 'gate') {
    return (
      <div className="page gate-page">
        <Particles />
        <div className="gate-card fade-in">
          <div className="envelope-mini">💌</div>
          <h2 className="gate-prompt">{letterConfig.gatePrompt}</h2>
          <form onSubmit={handleSubmit} className="gate-form">
            <input
              type="text"
              className="gate-input"
              placeholder={letterConfig.gatePlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary">
              确认
            </button>
          </form>
          {error && (
            <p className="gate-error fade-in" role="alert">
              {error.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < error.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    )
  }

  /* ── Transition (envelope opening) ── */
  if (page === 'transition') {
    return (
      <div className="page transition-page">
        <Particles />
        <div className="envelope-opening">
          <div className="envelope envelope-open">
            <div className="envelope-flap flap-open" />
            <div className="envelope-body">
              <div className="letter-paper paper-rise">
                <p>💌</p>
              </div>
            </div>
          </div>
          <p className="transition-text fade-in">{letterConfig.gateSuccessText}</p>
        </div>
      </div>
    )
  }

  /* ── Letter page ── */
  return (
    <div className="page letter-page">
      <Particles />
      <div className="letter-atmosphere" aria-hidden="true">
        <span className="atmosphere-glow glow-one" />
        <span className="atmosphere-glow glow-two" />
        <span className="atmosphere-meteor meteor-one" />
        <span className="atmosphere-meteor meteor-two" />
      </div>

      {/* Music */}
      <MusicButton />

      {/* Opening */}
      <header className="letter-header">
        <TypewriterText text={letterConfig.openingLine} delay={300} />
      </header>

      {/* Sections */}
      <main className="letter-body">
        <ChapterDivider
          kicker="Chapter 01"
          title="先把我想你的这封信打开"
          text="这一页从温柔开始，慢慢写到回忆、陪伴、想念和祝福。"
        />

        {letterConfig.sections.map((section, i) => (
          <section key={i} className="letter-section">
            {section.title && <h3 className="section-title">{section.title}</h3>}
            <TypewriterText text={section.text} delay={800 + i * 1200} />
          </section>
        ))}

        <MissingClock config={letterConfig} />

        {/* Reasons */}
        <section className="reasons-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.reasonsTitle}</h3>
          <div className="reasons-grid">
            {letterConfig.reasons.map((reason, i) => (
              <article key={reason} className="reason-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <span className="reason-number">{String(i + 1).padStart(2, '0')}</span>
                <p>{reason}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Secret envelopes */}
        <section className="secret-envelopes-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.secretEnvelopesTitle}</h3>
          <div className="secret-envelopes-grid">
            {letterConfig.secretEnvelopes.map((envelope, i) => {
              const isOpen = openedEnvelopeIndexes.includes(i)
              return (
                <button
                  key={envelope.title}
                  type="button"
                  className={`secret-envelope-card ${isOpen ? 'is-open' : ''}`}
                  onClick={() => toggleMiniEnvelope(i)}
                >
                  <span className="secret-envelope-icon">{isOpen ? '💗' : '💌'}</span>
                  <span className="secret-envelope-title">{envelope.title}</span>
                  {isOpen && <span className="secret-envelope-text">{envelope.text}</span>}
                </button>
              )
            })}
          </div>
        </section>

        {/* Photos */}
        <section className="photos-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.photosTitle}</h3>
          <div className="photos-grid">
            {letterConfig.photos.map((photo, i) => (
              <PhotoCard key={i} photo={photo} />
            ))}
          </div>
        </section>

        {/* Future checklist */}
        <section className="future-checklist-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.futureChecklistTitle}</h3>
          <div className="future-checklist">
            {letterConfig.futureChecklist.map((item, i) => (
              <div key={item} className="future-check-item" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="future-check-mark">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Promises */}
        <section className="promises-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.promisesTitle}</h3>
          <div className="promises-grid">
            {letterConfig.promises.map((p, i) => (
              <div key={i} className="promise-card" style={{ animationDelay: `${i * 0.12}s` }}>
                <span className="promise-icon">💗</span>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Heart loading */}
        <section className="heart-loading-section fade-in-scroll">
          <p className="heart-loading-text">{letterConfig.heartLoadingText}</p>
          <div className="heart-loading-track" aria-label={letterConfig.heartLoadingText}>
            <div className="heart-loading-bar" />
          </div>
          <p className="heart-loading-result">{letterConfig.heartLoadingResult}</p>
        </section>

        {/* Chat memories */}
        <section className="chat-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.chatTitle}</h3>
          <div className="chat-phone">
            {letterConfig.chatMessages.map((message, i) => (
              <div key={`${message.text}-${i}`} className={`chat-row ${message.from === 'me' ? 'from-me' : 'from-her'}`}>
                <span className="chat-bubble">{message.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Fortune */}
        <section className="fortune-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.fortuneTitle}</h3>
          <div className="fortune-card">
            <span className="fortune-symbol">🌾</span>
            <p>{fortune || '点一下，抽一张只属于今天的心动签。'}</p>
            <button className="btn btn-soft" type="button" onClick={drawFortune}>
              {fortune ? '再抽一张' : '抽一张心动签'}
            </button>
          </div>
        </section>

        {/* Quiz */}
        <section className="quiz-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.quizTitle}</h3>
          <div className="quiz-list">
            {letterConfig.quizQuestions.map((quiz, i) => {
              const selected = quizAnswers[i]
              return (
                <article key={quiz.question} className="quiz-card">
                  <p className="quiz-question">{i + 1}. {quiz.question}</p>
                  <div className="quiz-options">
                    {quiz.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`quiz-option ${selected === option ? 'is-selected' : ''}`}
                        onClick={() => chooseQuizAnswer(i, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {selected && (
                    <p className={`quiz-feedback ${selected === quiz.answer ? 'is-right' : 'is-soft'}`}>
                      {selected === quiz.answer ? quiz.feedback : '这个答案也很可爱，不过再选一次会更接近我的心意。'}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        {/* Time capsule */}
        <section className="time-capsule-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.timeCapsuleTitle}</h3>
          <div className="time-capsule-card">
            <span className="time-capsule-icon">🕰️</span>
            <p>{timeCapsuleOpen ? letterConfig.timeCapsuleText : letterConfig.timeCapsuleHint}</p>
            {!timeCapsuleOpen && (
              <button
                className="btn btn-soft"
                type="button"
                onClick={() => {
                  recordActivity('打开时间胶囊')
                  setTimeCapsuleOpen(true)
                }}
              >
                打开时间胶囊
              </button>
            )}
          </div>
        </section>

        {/* Stars */}
        <section className="star-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.starTitle}</h3>
          <p className="star-progress">已点亮 {collectedStars.length} / {letterConfig.stars.length} 颗</p>
          <div className="star-field">
            {letterConfig.stars.map((star, i) => {
              const collected = collectedStars.includes(i)
              return (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${collected ? 'is-collected' : ''}`}
                  onClick={() => toggleStar(i)}
                  aria-label={star}
                  title={star}
                >
                  ★
                </button>
              )
            })}
          </div>
          {collectedStars.length > 0 && (
            <div className="star-message">
              {letterConfig.stars[collectedStars[collectedStars.length - 1]]}
            </div>
          )}
        </section>

        {/* Love card */}
        <section className="love-card-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.loveCardTitle}</h3>
          <div className="generated-love-card">
            {letterConfig.loveCardLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <ChapterDivider
          kicker="Chapter 02"
          title="把回忆放给冉冉看"
          text="有些画面不只是照片和视频，是我很想好好保存的瞬间。"
        />

        {/* Memory cinema */}
        <section className="memory-cinema-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.memoryCinemaTitle}</h3>
          <p className="memory-cinema-subtitle">{letterConfig.memoryCinemaSubtitle}</p>
          <div className="memory-cinema-grid">
            <article className="memory-photo-card">
              <img src={letterConfig.memoryPhoto.src} alt={letterConfig.memoryPhoto.caption} />
              <p>{letterConfig.memoryPhoto.caption}</p>
            </article>
            <article className="memory-photo-card">
              <img src="/images/ranran-game-mvp.jpg" alt="小羊宝宝的王者 MVP" />
              <p>MVP 就是小羊，这一局太厉害了。</p>
            </article>
          </div>
        </section>

        <ChapterDivider
          kicker="Chapter 03"
          title="我在远处陪你上岸"
          text="高三很辛苦，马上高考了。希望这些小小的温柔，能陪你多一点勇气和安心。"
        />

        <GaokaoCheer config={letterConfig} />

        <ChapterDivider
          kicker="Chapter 04"
          title="给小羊准备的浪漫机关"
          text="这些小互动不是为了热闹，是想让你一点一点收到我的偏爱。"
        />

        <ParticleUniverse config={letterConfig} />

        <IceRoseShow config={letterConfig} />

        <StarUniverse config={letterConfig} />

        <LoveBlindBox config={letterConfig} />

        <SweetStampBook config={letterConfig} />

        <WhisperEnvelopes config={letterConfig} />

        <WishBottle config={letterConfig} />

        <LoveWeather config={letterConfig} />

        <MedalWall config={letterConfig} />

        <DailyQuestion config={letterConfig} />

        <ShakeFortune config={letterConfig} />

        <ReplyLetter config={letterConfig} />

        <DragPuzzle config={letterConfig} />

        <TimeCapsule config={letterConfig} />

        <HeartPopupShow config={letterConfig} />

        <ChapterDivider
          kicker="Chapter 05"
          title="给冉冉的浪漫特效合集"
          text="这些效果都是专门为你写的程序，现在变成了可以在手机上看的网页版。"
        />

        <MultiLangHeart config={letterConfig} />
        <LoveDanmaku config={letterConfig} />
        <LoveQuotePopups config={letterConfig} />
        <CarePopups config={letterConfig} />
        <HeartPetalTrail config={letterConfig} />

        <section className="effects-entry-section fade-in-scroll">
          <div className="effects-entry-card">
            <span className="effects-entry-icon">✨</span>
            <p className="effects-entry-text">想在独立页面一次看完所有特效？</p>
            <button
              className="btn btn-soft effects-entry-btn"
              onClick={() => {
                recordActivity('进入独立特效合集页面')
                setPage('effects')
              }}
            >
              打开浪漫特效合集
            </button>
          </div>
        </section>

        <NetlifyReplyForm
          summary={interactionSummary}
          visitInfo={visitInfoRef.current || getVisitInfo()}
          activityLog={activityLog.join('\n')}
        />

        <ChapterDivider
          kicker="Final Chapter"
          title="把所有温柔都送给你"
          text="最后这一章，不讲大道理，只想把很想你这件事认真送到你面前。"
        />

        {/* Final */}
        <section className="final-section">
          <TypewriterText text={letterConfig.finalText} delay={800 + letterConfig.sections.length * 1200 + 600} />
          <TypewriterText text={letterConfig.finalSubText} delay={800 + letterConfig.sections.length * 1200 + 1800} />
        </section>

        {/* Spin wheel */}
        <section className="spinwheel-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.spinWheelTitle}</h3>
          <SpinWheel items={letterConfig.spinWheelItems} />
        </section>

        {/* Sweetness quiz */}
        <section className="sweetness-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.sweetnessTitle}</h3>
          <SweetnessQuiz questions={letterConfig.sweetnessQuestions} levels={letterConfig.sweetnessLevels} />
        </section>

        {/* Timeline */}
        <section className="timeline-section fade-in-scroll">
          <h3 className="section-title">{letterConfig.timelineTitle}</h3>
          <Timeline events={letterConfig.timelineEvents} />
        </section>

        {/* 520 countdown */}
        <section className="countdown-section fade-in-scroll">
          <Countdown520 />
        </section>

        {/* Heart burst trigger button */}
        <section className="heart-burst-trigger-section fade-in-scroll">
          <div className="heart-burst-final-copy">
            <span>最后的最后</span>
            <strong>再把杜昊翔的心送给杨星冉一次</strong>
            <p>点下去以后，整片星空都会替我说：你很重要，也值得所有温柔。</p>
          </div>
          <button
            className="btn btn-heart-burst"
            type="button"
            onClick={() => setHeartBurst(true)}
          >
            💗 再送宝宝一颗心
          </button>
        </section>

        {/* Easter egg */}
        <section className="easter-section">
          {!showEasterEgg ? (
            <button
              className="btn btn-easter"
              onClick={() => {
                recordActivity('点击最终彩蛋按钮')
                setShowEasterEgg(true)
              }}
            >
              {letterConfig.easterEggButton}
            </button>
          ) : (
            <div className="easter-reveal fade-in">
              <TypewriterText text={letterConfig.easterEggText} delay={0} />
              <p className="sign-off">{letterConfig.signOff}</p>
            </div>
          )}
        </section>
      </main>
      <CursorHearts />
      <PetalRain />
      {heartBurst && <HeartBurst onClose={() => setHeartBurst(false)} />}
      {!confessionDone && (
        <ConfessionDialog
          onConfirm={() => {
            recordActivity('确认告白弹窗：喜欢你')
            setConfessionDone(true)
          }}
        />
      )}
    </div>
  )
}

