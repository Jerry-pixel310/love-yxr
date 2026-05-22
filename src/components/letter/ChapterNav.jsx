function ChapterNav({ activeChapter, onNavigate }) {
  const chapters = [
    { key: 'letter', icon: '💌', label: '信' },
    { key: 'memory', icon: '🌸', label: '回忆' },
    { key: 'gaokao', icon: '⭐', label: '加油' },
    { key: 'play', icon: '🎁', label: '机关' },
    { key: 'effects', icon: '✨', label: '特效' },
    { key: 'final', icon: '💗', label: '最后' },
  ]

  return (
    <nav className="chapter-nav" aria-label="情书章节导航">
      {chapters.map((chapter) => (
        <button
          key={chapter.key}
          type="button"
          className={`chapter-nav-item ${activeChapter === chapter.key ? 'is-active' : ''}`}
          onClick={() => onNavigate(chapter.key)}
        >
          <span>{chapter.icon}</span>
          <em>{chapter.label}</em>
        </button>
      ))}
    </nav>
  )
}

export default ChapterNav
