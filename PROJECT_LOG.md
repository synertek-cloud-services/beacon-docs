# Project Log

## Session 2 — 2026-07-16

### What was completed

**Deployment to Cloudflare Pages**
- Created CF Pages project `beacon-docs` under `jeremys@synertekcs.com` account (ID: `8fefd04d62780c1624579795cb08f891`)
- Set up GitHub Actions CI/CD via `.github/workflows/deploy.yml` using `cloudflare/wrangler-action@v3`
- Added `CLOUDFLARE_API_TOKEN` secret to GitHub repo (token scoped to synertekcs.com account, Cloudflare Pages:Edit)
- Custom domain `beacon.synertekcs.com` configured in CF dashboard (wrangler v4 removed `pages domain` subcommand)
- Site is live and deploying on every push to `main`

**Bug fixes**
1. Astro 5 slug extension leak — `entry.id` includes `.md`, stripped with `.replace(/\.mdx?$/, '')` everywhere URLs are built
2. Pagefind Rollup bundling error — `/pagefind/pagefind-ui.js` added to `vite.build.rollupOptions.external`
3. Category card dead links — cards were linking to `/kb/{slug}/` (non-existent static pages); CF Pages was falling back to `index.html` for all unknown paths, so clicking a card showed the landing page again. Fixed by linking to the first article in each category
4. Missing 404 page — added `src/pages/404.astro` so CF Pages serves a real 404 instead of silently returning `index.html`
5. Quick Start Step 5 — was telling users to run `pnpm dev`; corrected to `pnpm build` + `wrangler pages deploy`

**Content written** (Session 1 + 2)
- 3 full articles: agent-installation, jobs-vs-policies, connecting-via-rustdesk
- 21 substantive stubs across all 9 categories
- All 24 articles are in the build and indexed by Pagefind

### Key technical decisions

| Decision | Reason |
|---|---|
| No CF Pages adapter in Astro | Pure static output; no SSR/edge functions needed |
| `account_id` omitted from `wrangler.toml` | Wrangler v4 rejects it for Pages projects; `accountId` goes in the workflow instead |
| Category cards link to first article, not category index | Category index pages would require server-side routing or a redirect map; first-article link is simpler and works with static output |
| 404.astro required | Without it CF Pages falls back to `index.html` (200) for all unknown paths, breaking navigation |
| Pagefind external in Rollup | Pagefind index is generated after `astro build`; the JS file doesn't exist at bundle time |

---

## Next steps

### 1. Expand stub articles into full content
21 of 24 articles are stubs. Priority order:
- `getting-started/what-is-beacon.md` — top of the funnel
- `getting-started/architecture-overview.md` — needed before other sections make sense
- `administration/tenant-site-setup.md` — second most common onboarding step
- `using-beacon/monitoring-alerting.md` — core product feature
- `troubleshooting/best-practices.md` — high SEO value

### 2. Add a browser shell / live terminal article
The remote access section mentions a "browser shell" (Cloudflare Durable Objects relay) but there's no article for it. Needs: `remote-access/browser-shell.md` + sidebar entry.

### 3. Polish search UI
Pagefind is functional but the modal/overlay styling hasn't been tuned to match the dark theme exactly. The default Pagefind UI CSS overrides may conflict with `--bg`/`--surface` variables. Test at `/kb/installation/agent-installation/` and adjust `SearchBar.astro` overrides as needed.
