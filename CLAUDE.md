# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quartz is a static site generator for publishing digital gardens and notes as websites. It processes Markdown content through a plugin-based pipeline and outputs static HTML.

## Common Commands

```bash
# Build the site
npx quartz build

# Build and serve locally with hot reload
npx quartz build --serve

# Build from specific content directory
npx quartz build -d docs

# Type checking and formatting
npm run check          # TypeScript check + Prettier check
npm run format         # Auto-format with Prettier

# Run tests
npm run test

# Generate documentation site
npm run docs
```

## Architecture

### Build Pipeline

Content flows through three stages:

1. **Parse** (`quartz/processors/parse.ts`) - Transforms Markdown to HTML AST using remark/rehype
2. **Filter** (`quartz/processors/filter.ts`) - Decides which content to publish
3. **Emit** (`quartz/processors/emit.ts`) - Generates output files (HTML, RSS, sitemap, etc.)

Multi-threaded builds use `workerpool` with files chunked into 128-file batches.

### Plugin System

Three plugin types in `quartz/plugins/`:

- **Transformers** (`transformers/`) - Modify AST during parsing. Hooks: `textTransform`, `markdownPlugins`, `htmlPlugins`, `externalResources`
- **Filters** (`filters/`) - Control publishing via `shouldPublish()` method
- **Emitters** (`emitters/`) - Generate output files via `emit()` method. Support incremental builds via `partialEmit()`

Plugins are configured in `quartz.config.ts`:
```typescript
plugins: {
  transformers: [Plugin.FrontMatter(), Plugin.ObsidianFlavoredMarkdown(), ...],
  filters: [Plugin.RemoveDrafts()],
  emitters: [Plugin.ContentPage(), Plugin.ContentIndex(), ...]
}
```

### Component System

UI components in `quartz/components/` use Preact. Each component can provide:
- `css` - Styles to inject
- `beforeDOMLoaded` - Script running in `<head>`
- `afterDOMLoaded` - Script running at end of `<body>`

Page layout configured in `quartz.layout.ts` with sections: `head`, `header`, `beforeBody`, `pageBody`, `afterBody`, `left`, `right`, `footer`.

### Path Types

Branded string types in `quartz/util/path.ts` prevent path/slug confusion:
- `FilePath` - Absolute paths with extensions
- `FullSlug` - URL paths without extensions (e.g., `"notes/index"`)
- `SimpleSlug` - No `/index` suffix or extensions

### Key Files

- `quartz.config.ts` - Site configuration (title, theme, plugins)
- `quartz.layout.ts` - Page layout component arrangement
- `quartz/build.ts` - Main build orchestration
- `quartz/bootstrap-cli.mjs` - CLI entry point
- `quartz/components/renderPage.tsx` - Page rendering logic

## Content Structure

- Content source: `content/` directory (configurable via `-d` flag)
- Build output: `public/` directory (configurable via `-o` flag)
- Static assets: `quartz/static/`
- Styles: `quartz/styles/`

## Frontmatter

Required: `title`

Optional: `tags`, `aliases`, `description`, `draft`, `created`, `modified`, `published`, `cssclasses`, `enableToc`, `comments`, `socialImage`
