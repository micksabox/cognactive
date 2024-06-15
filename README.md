# cognactive

## open source/access

### Modern [Remix](https://remix.run) web app providing open-source software and AI utility for the open access NAC protocol. [What is the NAC protocol?](/public/files/NAC_Protocol.pdf)

> Breaking the mold

![1500x500-3](/docs/media/1500x500-3.jpeg)

#cosmicdeathfungus

## Regimen Tracker

Multi-phase Tracking

- Phase 1 (2+ months)
- Phase 2 (a.k.a Maintenance)

Presented intuitively as a slick mobile application, you will love taking cognactive with you on your journey.

### Local Data Storage Policy

These data entities are stored using a local browser-based IndexedDB. These are not sent anywhere and stay completely on your device.

- myco die-off experiences
- journal notes
- important protocol phase transition dates

## Ingredient Scanner

- Vision model [gpt-4] to parse ingredients from photos

## Development

Clone this repository. With Node installed on your terminal run this at the project root folder:

### Install package dependencies

```sh
npm install
```

### Start dev server

```sh
npm run dev
```

Navigate to `http://localhost:3000` to see cognactive.

## NAC stack

Built on the Typescript full stack web framework [Remix](https://remix.run).

- [vite](https://vitejs.dev/)
- [react](https://reactjs.org/)
- [remix](https://remix.run)
- [shadcn ui](https://ui.shadcn.com/)
- [react-lucide](https://lucide.dev/)
- [transmart](https://github.com/Quilljou/transmart)
- [react-query](https://tanstack.com/query/latest/)
- [tailwindcss](https://tailwindcss.com/)
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
├── app              # App entry and routes
│   ├── routes       # Remix routes
│   │   └── index.tsx  # Root route
│   └── root.tsx     # Root component
├── src
│   ├── pages       # Top level React components
│   ├── assets      # Assets for images, favicon etc
│   ├── components  # Shared react components
│   ├── lib         # macro library
│   ├── utils       # macro utils
├── public           # Public assets
├── tests            # Integration and e2e test files (TODO)
```

## TODO

[Create a new issue](https://github.com/micksabox/cognactive/issues) to suggest actions or improvement ideas.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The template for this project initialization used [Vite-React-TS-Tailwind-Starter](https://github.com/Quilljou/vite-react-ts-tailwind-starter).

- nactivism research community: thanks for the feedback!
- NAC protocol authors

![logo](/public/apple-touch-icon-precomposed.png)
