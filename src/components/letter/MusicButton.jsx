import { useCallback, useRef, useState } from 'react'

function MusicButton({ musicPath, buttonText }) {
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
      <audio ref={audioRef} src={musicPath} loop preload="none" />
      <button className="btn btn-music" onClick={toggle} aria-label="播放音乐">
        {playing ? '🎵 音乐播放中…' : `🎵 ${buttonText}`}
      </button>
      {failed && <p className="music-hint">暂时无法播放，再点一次试试</p>}
    </div>
  )
}

export default MusicButton
