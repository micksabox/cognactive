import React from 'react'
import { Header } from '../header'

export const getNoneLayout = (page: React.ReactElement) => page

export const getDefaultLayout = (page: React.ReactElement) => {
  return (
    <div className="h-min-screen">
      <Header className="fixed top-0 z-10 h-16" />
      <div className="mt-16">{page}</div>
    </div>
  )
}
