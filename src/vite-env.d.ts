/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
import 'react'
declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element
  export const frontmatter: any
  export default MDXComponent
}

// Satisfy Typescript tailwind integration with Satori
declare module 'react' {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    tw?: string
  }
}
