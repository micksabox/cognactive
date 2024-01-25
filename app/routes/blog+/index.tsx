import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import * as firstPost from './posts+/metagame.mdx'

// Enable with vite support
// import { getPosts } from '@/.server/blogposts'

function postFromModule(mod: any) {
  return {
    slug: mod.filename.replace(/\.mdx?$/, ''),
    ...mod.attributes,
  }
}

export const loader = async () => {
  const posts = [postFromModule(firstPost)]

  return json(posts)
}

export default function Component() {
  const posts = useLoaderData<typeof loader>()

  return (
    <div className="p-10">
      <h1>Blog</h1>
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link prefetch="intent" to={`posts/${post.slug}`}>
              {post.title}
            </Link>
            <p>{post.description}</p>
            <p>Published on {post.published}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
