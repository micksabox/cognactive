import BlogLayout from 'src/pages/blog/layout'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Cognactive | Blog',
      description: 'Read the latest blog posts.',
    },
  ]
}

const Blog: React.FC = () => {
  return <BlogLayout />
}

export default Blog
