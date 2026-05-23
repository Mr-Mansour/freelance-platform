import { cn } from '../lib/utils'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium'
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
}

function Badge({ variant = 'default', size = 'sm', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        {
          'px-2.5 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        },
        {
          'bg-gray-800 text-gray-300': variant === 'default',
          'bg-green-900/50 text-green-400 border border-green-700': variant === 'success',
          'bg-yellow-900/50 text-yellow-400 border border-yellow-700': variant === 'warning',
          'bg-red-900/50 text-red-400 border border-red-700': variant === 'danger',
          'bg-blue-900/50 text-blue-400 border border-blue-700': variant === 'info',
          'bg-gradient-to-r from-purple-600/50 to-cyan-600/50 text-white border border-purple-500/50': variant === 'premium',
        },
        className
      )}
    >
      {children}
    </span>
  )
}

export { Badge }
