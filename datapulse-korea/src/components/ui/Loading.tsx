import { HTMLAttributes } from 'react'
import clsx from 'clsx'

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'skeleton' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
}

export default function Loading({
  variant = 'spinner',
  size = 'md',
  className,
  ...props
}: LoadingProps) {
  if (variant === 'spinner') {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12'
    }

    return (
      <div className={clsx('flex items-center justify-center', className)} {...props}>
        <svg
          className={clsx('animate-spin text-blue-600', sizes[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div
        className={clsx('skeleton bg-gray-200 rounded', className)}
        {...props}
      />
    )
  }

  if (variant === 'pulse') {
    return (
      <div
        className={clsx('animate-pulse-slow bg-gray-200 rounded', className)}
        {...props}
      />
    )
  }

  return null
}

// 스켈레톤 프리셋 컴포넌트들
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, idx) => (
        <Loading
          key={idx}
          variant="skeleton"
          className={clsx(
            'h-4',
            idx === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={clsx('p-6 bg-white rounded-2xl border border-gray-100', className)}>
      <Loading variant="skeleton" className="h-6 w-1/3 mb-4" />
      <SkeletonText lines={3} />
      <Loading variant="skeleton" className="h-10 w-full mt-4" />
    </div>
  )
}
