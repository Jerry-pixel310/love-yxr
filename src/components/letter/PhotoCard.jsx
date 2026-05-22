import { useState } from 'react'

function PhotoCard({ photo }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="photo-card">
      {!imgError ? (
        <img
          src={photo.src}
          alt={photo.placeholder}
          className="photo-img"
          loading="lazy"
          decoding="async"
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

export default PhotoCard
