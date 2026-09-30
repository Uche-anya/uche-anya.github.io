# Uche Anya's portfolio

A personal portfolio for my data engineering and BI work. Home introduces me and three selected projects; Projects holds the full collection with platform and discipline filters; About tells my journey. Each of the eleven projects has a dedicated case-study page. Built with HTML, CSS, JavaScript, and Vite.

Routes: `/`, `/projects/`, `/about/`, and `/projects/:id/`. The build writes fourteen HTML pages into `dist`, with case-study content included in the HTML for direct links and reading without JavaScript. Vite's development fallback renders the same layouts through `src/pages.js`.

## Develop

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

## Build and verify

```sh
npm run build
npx playwright install chromium
npm test
npm run format:check
```

Playwright starts the development and production-preview servers when they are not already running. Build first so the production checks use current files.

For an automated accessibility scan, keep `npm run dev` running and use `npm run audit:a11y`. The scan checks Home and a case study at desktop and mobile sizes.

## Deploy to GitHub Pages

The repository `Uche-anya/uche-anya.github.io` publishes to `https://uche-anya.github.io/`. In repository Settings → Pages, select GitHub Actions as the build source. The workflow in `.github/workflows/pages.yml` builds and publishes all fourteen pages on pushes to `main`, or on manual dispatch. No deployment token needs to be stored in the repository.

## Alternative: deploy to Vercel

```sh
npx vercel login
npx vercel --prod
```

The checked-in `vercel.json` configures the Vite build and `dist` output. No application secrets or environment variables are needed. Authentication to the owner's Vercel account is required to publish.

## Edit content

- `src/projects.js`: project summaries, technologies, case studies, repository links.
- `index.html`: introduction, contact information, metadata, and hero illustration.
- `src/style.css`: responsive layout, typography, colours, and motion.
- `src/main.js`: project cards and filters.
- `src/pages.js` and `src/pages.css`: page layouts and case-study content.
- `scripts/build-pages.mjs`: static page generation after the Vite build.

Project descriptions come from the linked repositories and my own project notes. FEMA and Northbridge do not have public repository links on the site. Both are in progress, along with Lakebase Commerce. Their descriptions distinguish implemented work, synthetic data, and future plans. Diagrams are illustrative, not live dashboards.

Fonts load from Google Fonts with system fallbacks. Published case studies, navigation, contact details, and GitHub access remain available without JavaScript; project cards and filtering require JavaScript.

## Motion

The opening sequence lives in `src/intro.js` and `src/intro.css`. Visitors see a welcome screen and select Enter portfolio to start the percentage counter and pipeline animation, followed by the page reveal. Loading takes roughly five seconds. The welcome screen appears on Home and can be skipped with the button or Escape; Projects, About, and case studies open directly. The sequence is omitted for reduced motion or a saved motion pause. The percentage tracks the intro, not network download progress.

The motion layer lives in `src/motion.js` and `src/motion.css`. It uses browser APIs for the particle field, data-flow diagrams, scrolling technology list, and pointer effects. The motion button pauses animations and saves that choice locally. System reduced-motion settings take priority. Canvas rendering stops offscreen and in hidden tabs.
