# eleventy-tailwind
11ty + Tailwind CSS

The need for speed, using:

- [Eleventy](https://11ty.dev) for templates and site generation
- [TailwindCSS](https://tailwindcss.com) for a utility first CSS workflow
- [Terser](https://www.npmjs.com/package/terser) for a simple JS build pipeline
- [HTMLMinifier](https://www.npmjs.com/package/html-minifier-terser) for minifying all HTML


## Prerequisites

- [Node and NPM](https://nodejs.org/)

## Running locally

```bash

# install dependencies
npm install

# serve locally
npm run serve
```


## Previewing the production build

When building for production, the CSS is inlined and purged per page.

```bash

# run the production build
npm run build
```


## Styling with TailwindCSS

While running/developing locally, the `npm run serve` command will recompile the site as files are saved and this includes the CSS pipeline from Tailwind.

### Global CSS utilities.

A small number of bespoke CSS rules are provided for efficiency of repeated or global classes. These reside in `src/_includes/css/styles.css`
