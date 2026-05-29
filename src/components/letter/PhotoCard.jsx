import { useState } from 'react'

function PhotoCard({ photo }) {
  const [imgError, setImgError] = useState(false)

  // 判断是否渲染极具浪漫感的 SVG 霓虹矢量插画
  const isPlaceholder = imgError || (photo.src && photo.src.includes('photos/photo-'))

  const renderVectorPlaceholder = () => {
    // 根据 placeholder 匹配最合适的矢量插画
    if (photo.placeholder && photo.placeholder.includes('我很喜欢的你')) {
      // 1. 璀璨星河心形星云卡
      return (
        <div className="photo-vector-placeholder nebula-starry-card">
          <svg className="vector-svg" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="nebulaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff2f7d" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#7928ca" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ff006e" stopOpacity="0.8" />
              </linearGradient>
              <filter id="vectorGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="15" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Background starry particles */}
            <g className="svg-stars">
              <circle cx="80" cy="100" r="1.5" fill="#fff" opacity="0.6" />
              <circle cx="320" cy="120" r="2" fill="#ffb3c1" opacity="0.8" />
              <circle cx="150" cy="380" r="1" fill="#fff" opacity="0.4" />
              <circle cx="280" cy="400" r="1.5" fill="#ffd166" opacity="0.7" />
              <circle cx="340" cy="280" r="1" fill="#fff" opacity="0.5" />
            </g>
            {/* Glowing constellation tracks */}
            <path d="M 200,120 Q 250,70 300,120 T 200,320 T 100,220 Z" fill="url(#nebulaGrad)" opacity="0.15" />
            <path d="M 200,140 C 230,90 280,100 290,140 C 300,180 250,230 200,280 C 150,230 100,180 110,140 C 120,100 170,90 200,140 Z" fill="none" stroke="#ff2f7d" strokeWidth="2.5" strokeDasharray="6,4" filter="url(#vectorGlow)" className="constellation-heart" />
            {/* Stars on the nodes */}
            <circle cx="200" cy="140" r="4" fill="#ffd166" />
            <circle cx="290" cy="140" r="3" fill="#ffb3c1" />
            <circle cx="200" cy="280" r="4.5" fill="#fff" filter="url(#vectorGlow)" />
            <circle cx="110" cy="140" r="3" fill="#ffb3c1" />
            {/* Center glow lamb emoji */}
            <text x="200" y="210" fontSize="56" textAnchor="middle" className="emoji-pulse">🐑</text>
          </svg>
          <div className="photo-vector-caption">
            <span className="vector-badge">Chapter 02</span>
            <p>{photo.placeholder}</p>
            <span className="vector-hint">（期待以后，亲手在这里换上我们的合照）</span>
          </div>
        </div>
      )
    }

    if (photo.placeholder && photo.placeholder.includes('开心的瞬间')) {
      // 2. 双羊极光漫步卡
      return (
        <div className="photo-vector-placeholder aurora-pasture-card">
          <svg className="vector-svg" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#051937" />
                <stop offset="100%" stopColor="#2e2b54" />
              </linearGradient>
              <linearGradient id="auroraGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#4facfe" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <rect width="400" height="500" fill="url(#auroraGrad)" rx="24" />
            {/* Aurora curtains */}
            <path d="M-50,80 Q 100,180 200,100 T 450,150 L 450,-50 L-50,-50 Z" fill="url(#auroraGreen)" className="aurora-wave-1" />
            <path d="M-50,130 Q 150,50 250,140 T 450,90 L 450,-50 L-50,-50 Z" fill="url(#auroraGreen)" opacity="0.7" className="aurora-wave-2" />
            {/* Grassy floor */}
            <path d="M-50,420 Q 120,380 200,410 T 450,390 L 450,550 L-50,550 Z" fill="#1b2a47" />
            <path d="M-50,440 Q 100,410 200,430 T 450,420 L 450,550 L-50,550 Z" fill="#24345d" />
            {/* Two grazing lambs */}
            <g className="lambs-duo">
              <text x="140" y="420" fontSize="48" className="lamb-left">🐑</text>
              <text x="240" y="420" fontSize="48" className="lamb-right">🐑</text>
              <text x="195" y="375" fontSize="24" className="heart-float">💖</text>
            </g>
          </svg>
          <div className="photo-vector-caption">
            <span className="vector-badge">Chapter 02</span>
            <p>{photo.placeholder}</p>
            <span className="vector-hint">（想把世间所有的美好，都和这一帧连在一起）</span>
          </div>
        </div>
      )
    }

    // 3. 梦幻极光玫瑰卡
    return (
      <div className="photo-vector-placeholder crystal-rose-card">
        <svg className="vector-svg" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="50%" stopColor="#ff5fa2" />
              <stop offset="100%" stopColor="#ff2f7d" />
            </linearGradient>
          </defs>
          {/* Glass Jar Glow Outline */}
          <rect x="110" y="100" width="180" height="280" rx="90" fill="rgba(255,255,255,0.03)" stroke="rgba(0, 242, 254, 0.4)" strokeWidth="2.5" className="glass-dome" />
          <path d="M 120,380 Q 200,390 280,380" stroke="rgba(0, 242, 254, 0.6)" strokeWidth="3" />
          {/* Stem & Leaves */}
          <path d="M 200,240 Q 195,310 200,380" stroke="#38ef7d" strokeWidth="3" />
          <path d="M 200,300 Q 170,290 165,305" stroke="#38ef7d" strokeWidth="2.5" fill="none" />
          <path d="M 200,330 Q 230,320 235,335" stroke="#38ef7d" strokeWidth="2.5" fill="none" />
          {/* Glowing rose flower */}
          <circle cx="200" cy="230" r="30" fill="url(#roseGrad)" opacity="0.3" className="rose-glow" />
          <path d="M 200,205 C 220,205 235,215 230,235 C 225,255 200,265 200,265 C 200,265 175,255 170,235 C 165,215 180,205 200,205 Z" fill="url(#roseGrad)" className="rose-petal-center" />
          <path d="M 200,215 C 210,215 220,220 218,230 C 216,240 200,248 200,248 C 200,248 184,240 182,230 C 180,220 190,215 200,215 Z" fill="#ffd166" opacity="0.9" />
          {/* Floating sparks inside glass */}
          <circle cx="160" cy="180" r="2.5" fill="#00f2fe" opacity="0.8" className="float-spark-1" />
          <circle cx="230" cy="170" r="2" fill="#ffb3c1" opacity="0.9" className="float-spark-2" />
          <circle cx="180" cy="340" r="1.5" fill="#fff" opacity="0.7" className="float-spark-3" />
        </svg>
        <div className="photo-vector-caption">
          <span className="vector-badge">Chapter 02</span>
          <p>{photo.placeholder}</p>
          <span className="vector-hint">（把浪漫密封在代码里，时间也拿它没有办法）</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`photo-card ${isPlaceholder ? 'is-vector' : ''}`}>
      {!isPlaceholder ? (
        <img
          src={photo.src}
          alt={photo.placeholder}
          className="photo-img"
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
        />
      ) : (
        renderVectorPlaceholder()
      )}
    </div>
  )
}

export default PhotoCard
