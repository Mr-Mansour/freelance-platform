import { cn } from '../lib/utils'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  className?: string
}

function Avatar({ src, alt = '', size = 'md', fallback, className }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }

  return (
    <div className={cn('relative rounded-full overflow-hidden bg-gray-800', sizeClasses[size], className)}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-medium text-gray-400">
          {fallback || '?'}
        </div>
      )}
    </div>
  )
}

export { Avatar }
