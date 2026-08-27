# Project Log

## Session 3 — 2026-08-26

### What was completed

**Content sync with 3 weeks of Beacon product changes** (Beacon's own CLAUDE.md/PROJECT_LOG.md showed PRs #125–#193 landed since these docs were last touched on 2026-08-06)
- Rewrote the entire `remote-access` category: 3 of its 4 existing articles flatly denied that Web Remote/consent/graphical remote access existed, when Web Remote had grown into Beacon's flagship remote-control feature (consent, Elevate/SYSTEM access, multi-monitor, RDS/AVD session targeting, file transfer, clipboard paste)
- New: `remote-access/web-remote.md`, `web-remote-consent.md`, `web-remote-elevate.md`, `web-remote-sessions-and-displays.md`, `web-remote-file-transfer.md` (7 articles in the category total, up from 4)
- New: `using-beacon/software-management.md` (winget updates + uninstall), `using-beacon/reports.md` (CSV exports), `administration/network-discovery.md`, `using-beacon/patch-management.md` (approval pipeline, Patch Policy, Hyper-V/Server-class exclusion, AU/Microsoft Update takeover, drift detection — previously undocumented entirely)
- Updated: `administration/tenant-site-setup.md` (dedicated Company detail page + tabs), `alerting-policies/notification-channels.md` (flapping-monitor auto-mute), `integrations/autotask-psa.md` (PSA-ready alert-email header/subject contract), `using-beacon/reports.md` and `troubleshooting/best-practices.md` (linked to the new Patch Management article)

**CI fix**
- `.github/workflows/deploy.yml` interpolated the raw commit message directly into `wrangler-action`'s `command:` field. A multi-line commit message had its extra lines executed as bogus follow-on wrangler commands, failing the Action job *after* the real deploy had already succeeded (misleading red X on a working deploy). Fixed by extracting just the subject line (`git log -1 --pretty=%s`) into a step output first.

**Domain correction**
- `CLAUDE.md` and this file still referenced `beacon.synertekcs.com`, but the site moved to `docs.runbeacon.net` on 2026-08-06 (`astro.config.mjs`'s `site` field, commit `abce350`) — the meta-docs were never updated to match. Fixed both.

**User read-through pass** (same session, continued into 2026-08-27) — the user read the freshly-updated site end to end and flagged issues one at a time; each was fixed and deployed individually rather than batched:
- `getting-started/quick-start.md` rewritten for clarity — the self-hosting split into two separate public origins (Worker/API vs. dashboard) was only mentioned once, abstractly, in Prerequisites; readers had no way to tell which URL a given step meant. Added an upfront two-URL table every later step refers back to, replaced the abstract "set ALLOWED_ORIGIN, WORKER_URL, ..." field-name list with a concrete value-mapping table, and added the previously-missing dashboard build/deploy command block (every other step already had one). Caught and fixed a real path bug of my own introduction along the way (`../dashboard/dist` vs. the validated `dashboard/dist` relative to `--cwd ..`).
- Boolean-logic jargon ("ORed", "AND conditions") in `administration/tenant-site-setup.md` and `using-beacon/patch-management.md` replaced with plain language ("matches any one of them" / "also has to satisfy").
- `remote-access/web-remote-elevate.md` claimed Elevate opens a second PowerShell window with an admin-tools menu. User flagged this from memory as removed; traced via `git log -S` in the `beacon` repo to PR #140, which deleted `launchElevatedShell` entirely — the same PR `beacon`'s own CLAUDE.md credited with "rebuilding" Elevate, whose text had simply never been updated to drop the dead description. Also found and fixed two further dead claims in the same CLAUDE.md section (a pre-flight "can this device elevate" signal, `ActiveUserCanElevate()`/`console_user_can_elevate`, and a `hasElevationCredentials` check — both dropped in the same PR). Fixed in both repos: `beacon-docs`' article and `beacon`'s CLAUDE.md/PROJECT_LOG.md (that repo's own entry has the fuller technical account).
- Two real site bugs found incidentally while investigating a "double hr at the top" report: (1) `EditLink.astro` appended `.md` to `article.id`, which already includes `.md` per this repo's own documented Astro 5 gotcha — every single article's "Edit this page on GitHub" link was silently broken (`....md.md`), not just the new ones. (2) The "double hr" itself was `.prose h2`'s `border-top` rule landing directly under the article header's own `border-bottom` on any page whose first element was an H2 with no lead-in paragraph — fixed by adding a one-line intro to the three affected pages (`web-remote-sessions-and-displays.md`, `web-remote-file-transfer.md`, `resources/faq.md`) rather than special-casing the CSS.
- New `administration/sso-entra-id.md` — Entra ID SSO had zero setup documentation beyond one sentence pointing at Settings → SSO with no mention of app registration, redirect URI, or the two required Graph permissions. Led to building `beacon/scripts/setup-entra-sso.mjs` (device-code sign-in + Graph API calls to automate the Entra app registration, permissions, service principal, and secret — see that repo's own log for the design tradeoffs) and updating this article to document both the scripted and manual paths.

### Key decisions

| Decision | Reason |
|---|---|
| Renamed remote-access files instead of patching in place | `connecting-via-rustdesk.md`/`rustdesk-native-client.md`/`consent-privacy-mode.md` no longer described their own content accurately, and nothing else in the repo linked to those specific slugs |
| Kept Remote Shell and Web Remote as separate features/articles | Genuinely different capabilities in the product (text shell vs. graphical desktop) that only share the session-relay transport |
| Fixed missing-intro-paragraph pages instead of changing the `.prose h2` CSS rule | The border-top-per-H2 rule is intentional (it's the site's standard section divider) and correct everywhere else; the three affected pages were the outlier, not the rule |

---

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

### 1. Polish search UI
Pagefind is functional but the modal/overlay styling hasn't been tuned to match the dark theme exactly. The default Pagefind UI CSS overrides may conflict with `--bg`/`--surface` variables. Test at `/kb/installation/agent-installation/` and adjust `SearchBar.astro` overrides as needed.
