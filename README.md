# Shruti — interactive portfolio

## Current portfolio source

- [Browse the current portfolio source on GitHub](https://github.com/smokingace0218/portfolio/tree/main/outputs/portfolio)
- [View the latest source commit](https://github.com/smokingace0218/portfolio/commit/34ffc9bfd9fe4b6af01637a5a7987fe04912ffa7)

This repository contains the portfolio source. A live Netlify URL is not confirmed yet. See [CURRENT_BUILD.md](CURRENT_BUILD.md) for the deployment status and build settings.

## Netlify deployment

The complete website source is in [outputs/portfolio](outputs/portfolio/). Netlify is configured from the repository root with [netlify.toml](netlify.toml):

- **Base directory:** `outputs/portfolio`
- **Build command:** `npm run build`
- **Publish directory:** `dist` (relative to the base directory)

The build script copies the site shell, route pages, and portfolio assets into `dist`. The `_redirects` file routes client-side paths back through the portfolio shell.

To publish, connect this GitHub repository to Netlify, set `main` as the production branch, and run the first production deploy. The Netlify connection and build result have not been verified yet.
