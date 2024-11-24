import { Outlet } from 'react-router'
import React from 'react'

const BlogLayout: React.FC = () => {
  return (
    <div className="container prose prose-sm mx-auto my-8 max-w-5xl bg-white p-4 shadow-lg md:px-12 md:py-8">
      <Outlet />
    </div>
  )
}

export default BlogLayout
