/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element
  export const frontmatter: any
  export default MDXComponent
}
