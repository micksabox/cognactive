# cognactive

Web application to track NAC protocol events.

- regimen
- myco die-off experiences

## Local Development

Clone this repository and run

```sh
npm install
npm dev
```

## Tech Stack

- [vite](https://vitejs.dev/)
- [react](https://reactjs.org/)
- [remix](https://remix.run)
- [shadcn ui](https://ui.shadcn.com/)
- [react-i18next](https://github.com/i18next/react-i18next)
- [react-lucide](https://lucide.dev/)
- [transmart](https://github.com/Quilljou/transmart)
- [react-query](https://tanstack.com/query/latest/)
- [tailwindcss](https://tailwindcss.com/)
- [less](http://lesscss.org/)
- [postcss](https://postcss.org/)
- [eslint](https://eslint.org/)/[stylelint](https://stylelint.io/)
- [prettier](https://prettier.io/)
- [svgr](https://react-svgr.com/)
- [editorconfig](https://editorconfig.org/)
- [husky](https://typicode.github.io/husky/#/)/[lint-staged](https://github.com/okonet/lint-staged)
- [commitlint](https://commitlint.js.org/)

## Project Structure

```sh
src
├── app.tsx     # App entry
├── assets      # Assets for images, favicon etc
├── components  # React components
├── hooks       # React hooks
├── i18n        # i18n files
├── lib         # Utils、tools、services
├── main.tsx    # File entry
├── pages       # One .tsx per page
├── router.tsx  # Routers
├── styles      # Less files
├── types       # Typescript types
└── vite-env.d.ts
```

## TODO

- [ ] Re-implement i8ln [How to internationalize a Remix application](https://locize.com/blog/remix-i18n/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The template for this project initialization used [Vite-React-TS-Tailwind-Starter](https://github.com/Quilljou/vite-react-ts-tailwind-starter).

- nactivism research community
