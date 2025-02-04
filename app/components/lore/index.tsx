import React from 'react'

const LoreContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

export { LoreContainer }
