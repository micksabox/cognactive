import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import * as firstPost from './posts+/metagame.mdx'
console.log(firstPost)

// Enable with vite support
// import { getPosts } from '@/.server/blogposts'

function postFromModule(mod: any) {
  return {
    slug: mod.filename.replace(/\.mdx?$/, ''),
    ...mod.attributes.meta,
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
            <Link prefetch="intent" to={post.slug}>
              {post.frontmatter.title}
            </Link>
            <p>{post.frontmatter.description}</p>
            <p>Published on {post.frontmatter.published}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
