import { Link } from 'react-router'
import { getPosts } from '@/.server/blogposts'

import type { Route } from './+types/index'

export const loader = async () => {
  try {
    const posts = await getPosts()
    return { posts }
  } catch (error) {
    console.error(error)
    throw new Response('Failed to load blog posts: ' + (error instanceof Error ? error.message : 'Unknown error'), {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData

  return (
    <div className="p-10">
      <h1>Blog</h1>
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link prefetch="intent" to={`posts/${post.slug}`}>
              {post.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
