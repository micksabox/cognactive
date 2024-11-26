declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const component: ComponentType
  export default component
}

declare module '*.md' {
  import type { ComponentType } from 'react'
  const component: ComponentType
  export default component
}
