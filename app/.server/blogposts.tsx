import { ServerBuild } from 'react-router';

// This code and technique modified from https://github.com/pcattori/remix-blog-mdx

export type Frontmatter = {
  title: string
  description: string
  published: string // YYYY-MM-DD
  featured: boolean
}

export type PostMeta = {
  slug: string
  frontmatter: Frontmatter
}

export const getPosts = async (): Promise<PostMeta[]> => {
  // @ts-ignore
  const modules = import.meta.glob<{ frontmatter: Frontmatter }>('../routes/blog+/posts+/*.mdx', { eager: true })
  // @ts-ignore
  const build = await import('virtual:react-router/server-build')
  const posts = Object.entries(modules).map(([file, post]) => {
    let id = file.replace('../', '').replace(/\.mdx$/, '')
    let slug = build.routes[id].path
    if (slug === undefined) throw new Error(`No route for ${id}`)

    return {
      slug,
      // @ts-ignore
      frontmatter: post.frontmatter,
    }
  })
  return sortBy(posts, (post) => post.frontmatter.published, 'desc')
}

function sortBy<T>(arr: T[], key: (item: T) => any, dir: 'asc' | 'desc' = 'asc') {
  return arr.sort((a, b) => {
    const res = compare(key(a), key(b))
    return dir === 'asc' ? res : -res
  })
}

function compare<T>(a: T, b: T): number {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}
