import { Link } from 'react-router'
import { getPosts } from '@/.server/blogposts'

import type { Route } from './+types/index'

// function postFromModule(mod: any) {
//   return {
//     slug: mod.filename.replace(/\.mdx?$/, ''),
//     ...mod.attributes,
//   }
// }

export const loader = async () => {
  const posts = await getPosts()

  return { posts }
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData

  console.log(posts)

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
