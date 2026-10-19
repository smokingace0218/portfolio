# Shruti — interactive portfolio

## Open the portfolio

- [Live portfolio](https://shruti-portfolio.shruti786aaa.chatgpt.site)
- [Matera case study](https://shruti-portfolio.shruti786aaa.chatgpt.site/work/matera)
- [Janitri experience](https://shruti-portfolio.shruti786aaa.chatgpt.site/experience/janitri#matera-answer)

For the current cross-chat handoff and verified navigation, see [CURRENT_BUILD.md](CURRENT_BUILD.md).

The Matera card in the Janitri experience opens the full case study. Direct links and refreshes work on the published site.

## Netlify deployment

The complete website source is in [`outputs/portfolio`](outputs/portfolio/). Netlify is configured from the repository root with `netlify.toml`:

- **Base directory:** `outputs/portfolio`
- **Build command:** `npm run build`
- **Publish directory:** `dist` (relative to the base directory)

The build copies the site shell, route pages, and all portfolio assets into `dist`. `_redirects` sends client-side routes back to the portfolio shell so direct links and refreshes resolve.

Connect the `main` branch to Netlify and enable production deploys from `main`. Future approved changes can be pushed to `main` when explicitly requested.
