import { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  centered?: boolean
}

export default function Container({
  children,
  size = 'lg',
  centered = true,
  className,
  ...props
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full'
  }

  return (
    <div
      className={clsx(
        sizes[size],
        centered && 'mx-auto',
        'px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
