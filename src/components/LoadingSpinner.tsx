import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'h-6 w-6 border-2',
  md: 'h-12 w-12 border-2',
  lg: 'h-16 w-16 border-4',
}

/**
 * Reusable loading spinner component
 */
export function LoadingSpinner({
  size = 'md',
  className,
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={cn(
          'inline-block animate-spin rounded-full border-b-transparent border-blue-600',
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="text-slate-600 text-center animate-pulse">{text}</p>
      )}
    </div>
  )
}

/**
 * Full-page loading overlay
 */
export function LoadingOverlay({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

/**
 * Inline loading state for forms
 */
export function LoadingInline({ text }: { text?: string }) {
  return (
    <div className="py-8">
      <LoadingSpinner size="sm" text={text} />
    </div>
  )
}
