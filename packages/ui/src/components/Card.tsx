import { cn } from '../lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
}

function Card({ className, children, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm',
        hover && 'hover:border-cyan-500/50 transition-colors duration-300',
        className
      )}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-6 pb-0', className)}>{children}</div>
}

function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export { Card, CardHeader, CardContent }
