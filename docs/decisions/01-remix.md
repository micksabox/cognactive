# Remix

Date: 2024-01-22

Status: accepted

## Context

Application started as a Vite-bundled SPA with React Router. Limitations quickly surfaced and a fullstack framework was desired.

## Decision

[Remix](https://remix.run) is a server and client framework for React applications. Refactor application as a Remix application.

## Consequences

- Allows for better user experience with features built-in to Remix like bundle code-splitting, link prefetching, client and server loaders for fullstack state, dynamic meta and more

- Allows server side rendering of text content for better search engine indexing and language model understanding

- Acts as a backend for frontend so that features that require privacy (api keys, etc) can be provided to users safely

### Cons

- The app would require a server to run and serve pages. This is acceptable as maximal anti-censorship is not a goal of this project, and many popular hosts are available.

- Vite Remix deployment on Vercel is still considered unstable and Vercel does not offer deploying of Vite Remix apps yet [See Github Issue](https://github.com/vercel/remix/issues/63)

Vite support might have to wait until its supported in deployment by Vercel.
