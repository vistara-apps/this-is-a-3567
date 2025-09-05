import React from 'react'

export default function Card({ 
  children, 
  variant = 'plain', 
  className = '',
  onClick,
  ...props 
}) {
  const baseClasses = 'rounded-lg transition-all duration-200'
  
  const variantClasses = {
    plain: 'glass-card p-6',
    withImage: 'glass-card overflow-hidden',
    elevated: 'glass-card p-6 shadow-card hover:shadow-lg transform hover:-translate-y-1'
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}