function ChapterNav({ onEffectsClick }) {
  const chapters = [
    { href: '#chapter-letter', icon: '💌', label: '信' },
    { href: '#chapter-memory', icon: '🌸', label: '回忆' },
    { href: '#chapter-gaokao', icon: '⭐', label: '加油' },
    { href: '#chapter-play', icon: '🎁', label: '机关' },
    { href: '#chapter-effects', icon: '✨', label: '特效' },
    { href: '#chapter-final', icon: '💗', label: '最后' },
  ]

  return (
    <nav className="chapter-nav" aria-label="情书章节导航">
      {chapters.map((chapter) => {
        if (chapter.href === '#chapter-effects') {
          return (
            <button key={chapter.href} type="button" className="chapter-nav-item" onClick={onEffectsClick}>
              <span>{chapter.icon}</span>
              <em>{chapter.label}</em>
            </button>
          )
        }
        return (
          <a key={chapter.href} href={chapter.href} className="chapter-nav-item">
            <span>{chapter.icon}</span>
            <em>{chapter.label}</em>
          </a>
        )
      })}
    </nav>
  )
}

export default ChapterNav
