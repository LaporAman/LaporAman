function initials(name) {
  return (name || '?').trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-[76px] w-[76px] text-2xl'
}

export default function Avatar({ name, src, size = 'md', className = '' }) {
  const sizeClass = SIZES[size] || SIZES.md
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizeClass} rounded-full object-cover flex-none ${className}`}
      />
    )
  }
  return (
    <div className={`${sizeClass} rounded-full bg-teal text-white flex items-center justify-center font-bold flex-none ${className}`}>
      {initials(name)}
    </div>
  )
}
