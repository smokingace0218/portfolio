# Shruti — interactive portfolio

## Current portfolio source

- [Browse the current portfolio source on GitHub](https://github.com/smokingace0218/portfolio/tree/main/outputs/portfolio)
- [View the latest source commit](https://github.com/smokingace0218/portfolio/commit/34ffc9bfd9fe4b6af01637a5a7987fe04912ffa7)

This repository contains the portfolio source. A live Netlify URL is not confirmed yet. See [CURRENT_BUILD.md](CURRENT_BUILD.md) for the deployment status and build settings.

## Netlify deployment

The live site is the approved snapshot in [outputs/portfolio-approved/dist](outputs/portfolio-approved/dist/). [outputs/portfolio](outputs/portfolio/) stays the older draft. Netlify is configured from the repository root with [netlify.toml](netlify.toml):

- **Base directory:** `.`
- **Build command:** `echo Approved static snapshot`
- **Publish directory:** `outputs/portfolio-approved/dist`

`_redirects` and `_headers` inside that folder are the route and cache rules. The first visit opens `/sketchbook/`.

If the Netlify UI base directory is still `outputs/portfolio`, `npm run build` copies this same snapshot into `outputs/portfolio/dist` and publishes that. Leave the root command as the echo above. Do not point the build back at the old draft.
