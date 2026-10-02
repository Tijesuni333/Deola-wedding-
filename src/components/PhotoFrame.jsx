/**
 * Shows a real photo when a path is given, otherwise tasteful placeholder art
 * so the layout looks finished before the couple sends their pictures.
 */
const tints = [
  ['#e8d6b3', '#573831'],
  ['#f5f5dc', '#8a6556'],
  ['#e8d6b3', '#3a2520'],
  ['#efe3c8', '#73504a'],
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
