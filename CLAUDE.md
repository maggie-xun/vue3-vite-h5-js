# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev       # Start dev server with HMR (Vite)
npm run build     # Production build (targets ES2015)
npm run preview   # Preview production build locally
npm run lint      # Run all linters (oxlint + ESLint, auto-fix mode)
npm run format    # Format src/ with Prettier
```

## Architecture

- **Vue 3 + Vite 7** SPA with Composition API (`<script setup>`) and ESM modules.
- **`@` alias** resolves to `./src/` (configured in both `vite.config.js` and `jsconfig.json`).
- **Router** (`src/router/index.js`): Vue Router 5 with `createWebHistory`. The Home route (`/`) is eagerly loaded; the About route (`/about`) uses lazy loading with dynamic `import()` for code splitting.
- **State management**: Pinia 3 with composition-style stores (see `src/stores/counter.js` as the pattern — `defineStore` receives a setup function returning reactive state and methods).
- **App entry** (`src/main.js`): Creates the Vue app, installs Pinia and Router, mounts to `#app`. Global CSS is imported here from `src/assets/main.css`.

## Linting & Formatting

- **ESLint** (`eslint.config.js`): Flat config format. Extends `@eslint/js` recommended, `eslint-plugin-vue` essential rules, imports Oxlint rules from `.oxlintrc.json`, and applies `eslint-config-prettier` to avoid conflicts.
- **Oxlint** (`.oxlintrc.json`): Fast Rust-based linter with `eslint`, `unicorn`, `oxc`, and `vue` plugins. Only `correctness` category is set to error.
- **Prettier** (`.prettierrc.json`): No semicolons, single quotes, 100 char print width.
- **Pre-commit** (`.husky/pre-commit`): Runs `lint-staged`, which lints JS/Vue files on staged changes (ESLint + Prettier + stylelint for `.vue` files).

## Editor Setup

Recommended VS Code extensions: Volar, ESLint, EditorConfig, Oxc, Prettier (see `.vscode/extensions.json`). Settings enable format-on-save with Prettier as default, plus Oxc auto-fix on save.
