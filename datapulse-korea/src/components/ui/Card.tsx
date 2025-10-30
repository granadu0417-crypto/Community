import { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'bordered' | 'elevated' | 'gradient'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300'

  const variants = {
    default: 'bg-white border border-gray-100',
    bordered: 'bg-white border-2 border-gray-200',
    elevated: 'bg-white shadow-lg',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-100'
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const hoverStyles = hover ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : ''

  return (
    <div
      className={clsx(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('mb-4 pb-4 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={clsx('text-xl font-bold text-gray-900', className)}>
      {children}
    </h3>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={clsx('text-gray-600', className)}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={clsx('mt-4 pt-4 border-t border-gray-100', className)}>
      {children}
    </div>
  )
}
