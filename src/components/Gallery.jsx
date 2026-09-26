import { useCallback, useEffect, useRef, useState } from 'react'
import { Modal } from './Modal'
import { Icon } from './Icon'
import { useApp } from '../hooks/useApp'
import { backend } from '../services'

function Lightbox({ photos, index, onIndex, onClose, onDelete }) {
  const { t } = useApp()
  const photo = photos[index]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onIndex(Math.min(index + 1, photos.length - 1))
      if (e.key === 'ArrowLeft') onIndex(Math.max(index - 1, 0))
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [index, photos.length, onIndex, onClose])

  // Swipe left/right on phones.
  const touchX = useRef(null)
  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (dx < -50) onIndex(Math.min(index + 1, photos.length - 1))
    if (dx > 50) onIndex(Math.max(index - 1, 0))
    touchX.current = null
  }

  if (!photo) return null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/95 text-white" role="dialog" aria-modal="true" aria-label="Photo viewer">
      <div className="flex items-center justify-between p-3 sm:p-5">
        <span className="eyebrow tabular-nums opacity-70">
          {index + 1} / {photos.length}
        </span>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label={t.close}>
          <Icon name="close" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img src={photo.url} alt="" className="max-h-full max-w-full object-contain" />
        <button
          onClick={() => onIndex(index - 1)}
          disabled={index === 0}
          className="absolute left-2 hidden rounded-full bg-white/10 p-3 hover:bg-white/20 disabled:opacity-0 sm:block"
          aria-label="Previous photo"
        >
          <Icon name="chevronLeft" />
        </button>
        <button
          onClick={() => onIndex(index + 1)}
          disabled={index === photos.length - 1}
          className="absolute right-2 hidden rounded-full bg-white/10 p-3 hover:bg-white/20 disabled:opacity-0 sm:block"
          aria-label="Next photo"
        >
          <Icon name="chevronRight" />
        </button>
      </div>

      <div className="flex justify-center gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <a href={photo.url} download={`wedding-${photo.id}.jpg`} className="btn border-white/40 hover:bg-white hover:text-black">
          <Icon name="download" width={14} height={14} /> {t.download}
        </a>
        {photo.mine && (
          <button onClick={() => onDelete(photo.id)} className="btn border-white/40 hover:bg-white hover:text-black">
            <Icon name="trash" width={14} height={14} /> {t.delete}
          </button>
        )}
      </div>
    </div>
  )
}

function GalleryBody() {
  const { t } = useApp()
  const [photos, setPhotos] = useState(null)
  const [uploading, setUploading] = useState(0)
  const [viewing, setViewing] = useState(null)
  const uploadInput = useRef(null)
  const cameraInput = useRef(null)

  useEffect(() => {
    backend.listPhotos().then(setPhotos)
  }, [])

  const onFiles = async (e) => {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'))
    e.target.value = ''
    setUploading((n) => n + files.length)
    for (const file of files) {
      try {
        const photo = await backend.uploadPhoto(file)
        setPhotos((p) => [photo, ...(p ?? [])])
      } finally {
        setUploading((n) => n - 1)
      }
    }
  }

  const onDelete = useCallback(async (id) => {
    await backend.deletePhoto(id)
    setPhotos((p) => {
      const next = (p ?? []).filter((x) => x.id !== id)
      setViewing((v) => (v === null || next.length === 0 ? null : Math.min(v, next.length - 1)))
      return next
    })
  }, [])

  const closeViewer = useCallback(() => setViewing(null), [])

  return (
    <div className="px-4 pt-14 pb-10 sm:px-10">
      <div className="text-center">
        <p className="eyebrow text-accent">{t.gallery}</p>
        <h2 className="mt-3 font-display text-3xl sm:text-5xl">{t.galleryTitle}</h2>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button className="btn-solid" onClick={() => uploadInput.current?.click()}>
          <Icon name="upload" width={14} height={14} /> {t.upload}
        </button>
        {/* `capture` opens the camera directly on phones; desktop falls back to a file picker. */}
        <button className="btn" onClick={() => cameraInput.current?.click()}>
          <Icon name="camera" width={14} height={14} /> {t.takePhoto}
        </button>
        <input ref={uploadInput} type="file" accept="image/*" multiple hidden onChange={onFiles} />
        <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={onFiles} />
      </div>

      <div className="mt-10" aria-live="polite">
        {photos === null ? (
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 sm:gap-2 lg:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-paper-2 dark:bg-night" />
            ))}
          </div>
        ) : photos.length === 0 && uploading === 0 ? (
          <div className="py-20 text-center text-ink-soft dark:text-moon-soft">
            <Icon name="gallery" width={36} height={36} className="mx-auto opacity-50" />
            <p className="mt-4 font-display text-xl italic">{t.noPhotos}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 sm:gap-2 lg:grid-cols-5">
            {Array.from({ length: uploading }, (_, i) => (
              <div key={`up-${i}`} className="flex aspect-square animate-pulse items-center justify-center bg-paper-2 dark:bg-night">
                <Icon name="upload" className="opacity-40" />
              </div>
            ))}
            {photos.map((p, i) => (
              <button key={p.id} onClick={() => setViewing(i)} className="group aspect-square overflow-hidden bg-paper-2 dark:bg-night">
                <img
                  src={p.url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {viewing !== null && photos && (
        <Lightbox photos={photos} index={viewing} onIndex={setViewing} onClose={closeViewer} onDelete={onDelete} />
      )}
    </div>
  )
}

export function Gallery() {
  const { t, galleryOpen, setGalleryOpen } = useApp()
  const close = useCallback(() => setGalleryOpen(false), [setGalleryOpen])
  return (
    <Modal open={galleryOpen} onClose={close} label={t.gallery} variant="full">
      <GalleryBody />
    </Modal>
  )
}
