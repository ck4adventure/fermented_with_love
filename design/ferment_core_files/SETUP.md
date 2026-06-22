# MDX Setup for fermentedwithlove.com

Before adding these pages to your Next.js project, you'll need MDX support installed.
Hand this file to Claude Code and it can walk you through the whole thing, but here's
the overview so you know what's happening.

## Packages to install

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install gray-matter
```

`gray-matter` parses the frontmatter (the `---` block at the top of each MDX file)
so you can use it in your pages — for titles, descriptions, tags, search, etc.

## next.config.js

```js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
})
```

## Suggested file structure

```
/content
  /getting-started
    what-is-wild-fermentation.mdx
    equipment.mdx
    yeast-field-guide.mdx
    troubleshooting.mdx
  /working-with-fruit
    processing-fruit.mdx
    using-a-hydrometer.mdx
    sugar-additions.mdx
  /fermentation
    primary-fermentation.mdx
    racking.mdx
    bottling.mdx
```

Pages in `/app` or `/pages` can then use `gray-matter` to read and parse these files,
and render them via a shared MDX layout component.

## Frontmatter schema used in these files

```
title        — page title, used in <head> and as the H1
description  — 1-2 sentences, used for search snippets and meta description
section      — which nav section this belongs to
slug         — URL-friendly identifier
order        — display order within the section (lower = first)
tags         — array of strings for filtering and future faceted search
lastUpdated  — ISO date string, update whenever you revise the page
```
