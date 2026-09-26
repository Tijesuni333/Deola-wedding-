/**
 * Shows a real photo when a path is given, otherwise tasteful placeholder art
 * so the layout looks finished before the couple sends their pictures.
 */
const tints = [
  ['#d8b9a3', '#9c6b4f'],
  ['#c9c3b0', '#6f735b'],
  ['#e3c9b8', '#a7766d'],
  ['#cfc4d6', '#7d6a86'],
]

export function PhotoFrame({ src, label, index = 0, className = '' }) {
  if (src) {
    return <img src={src} alt={label} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  }
  const [a, b] = tints[index % tints.length]
  return (
    <div
      role="img"
      aria-label={`${label} (photo coming soon)`}
      className={`relative flex h-full w-full items-end overflow-hidden ${className}`}
      style={{ background: `linear-gradient(145deg, ${a}, ${b})` }}
    >
      <div className="grain absolute inset-0 opacity-25 mix-blend-multiply" />
      <span className="relative p-4 font-display text-lg text-white/90 italic">{label}</span>
    </div>
  )
}
