import { useState } from 'react'

function MusicButton({ isPlaying, onToggle, buttonText }) {
  const [failed, setFailed] = useState(false)

  const handleToggle = () => {
    onToggle().catch(() => {
      setFailed(true)
      setTimeout(() => setFailed(false), 3000)
    })
  }

  return (
    <div className="music-control">
      <button className="btn btn-music" onClick={handleToggle} aria-label="播放音乐">
        {isPlaying ? '🎵 音乐播放中…' : `🎵 ${buttonText}`}
      </button>
      {failed && <p className="music-hint">暂时无法播放，再点一次试试</p>}
    </div>
  )
}

export default MusicButton
