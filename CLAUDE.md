# Beacon Docs — Claude Instructions

## Project overview

Static knowledge base site for the Beacon open-source RMM platform.
Live at: **https://beacon.synertekcs.com**
Repo: `https://github.com/synertek-cloud-services/beacon-docs`

## Rules

- Do NOT add `Co-Authored-By` or any AI-attribution lines to commits
- Never commit `.envrc` — it contains live Cloudflare credentials
- Do not embed tokens in git remote URLs (`https://user:TOKEN@...`) — blocked by safety classifier. Use `gh auth git-credential` instead

## Stack

| Concern | Choice |
|---|---|
| Framework | Astro 5, `output: 'static'` |
| Hosting | Cloudflare Pages (no adapter, pure static) |
| Search | Pagefind (post-build: `astro build && pagefind --site dist`) |
| CSS | Hand-written scoped styles — no Tailwind, no utility framework |
| Content | Astro Content Collections (`src/content/kb/**/*.md`) |
| Package manager | pnpm |
| Deploy | GitHub Actions → `cloudflare/wrangler-action@v3` |

## Project structure

```
src/
  content/
    config.ts               # Zod schema for 'kb' collection
    kb/
      getting-started/
      installation/
      administration/
      using-beacon/
      remote-access/
      alerting-policies/
      integrations/
      troubleshooting/
      resources/
  data/
    categories.ts           # CATEGORIES array — source of truth for nav order/labels/icons
  layouts/
    BaseLayout.astro        # <html>, <head>, imports global.css
    KBLayout.astro          # Sidebar + main column
    ArticleLayout.astro     # Article + TOC, wraps KBLayout
  components/
    Sidebar.astro           # Collapsible <details> category tree
    CategoryCard.astro      # Landing page cards
    SearchBar.astro         # Pagefind UI wrapper
    TOC.astro               # In-article anchor nav
    EditLink.astro          # "Edit on GitHub" footer link
  pages/
    index.astro             # Landing: hero + 9 category cards
    404.astro               # 404 page (required for CF Pages fallback)
    kb/[...slug].astro      # Dynamic route for all articles
  styles/
    theme.css               # ALL CSS custom properties — edit only this to repaint
    global.css              # Reset, typography, prose, code blocks
```

## Content collection schema

```typescript
// src/content/config.ts
z.object({
  title: z.string(),
  category: z.string(),         // must match a slug in CATEGORIES
  subcategory: z.string().optional(),
  order: z.number(),            // controls position within category (lower = higher)
  updated: z.coerce.date(),
  tags: z.array(z.string()).optional(),
})
```

## Critical Astro 5 patterns

**Slug generation — strip the file extension.**
Astro 5 content collection `entry.id` includes the `.md` extension (e.g. `installation/agent-installation.md`). Always strip it before building URLs:

```ts
article.id.replace(/\.mdx?$/, '')
// "installation/agent-installation.md" → "installation/agent-installation"
// URL: /kb/installation/agent-installation/
```

This must be applied in:
- `src/pages/kb/[...slug].astro` — `params: { slug: article.id.replace(/\.mdx?$/, '') }`
- `src/components/Sidebar.astro` — `href={/kb/${article.id.replace(/\.mdx?$/, '')}/}`
- `src/pages/index.astro` — when building `firstHref` for category cards

**Pagefind — external from Rollup.**
`/pagefind/pagefind-ui.js` doesn't exist at build time (Pagefind runs after Astro). It's marked external in `astro.config.mjs` to prevent Rollup from trying to bundle it:

```js
vite: {
  build: { rollupOptions: { external: ['/pagefind/pagefind-ui.js'] } }
}
```

## Category card links

Category cards on `index.astro` must NOT link to `/kb/{category-slug}/` — those pages don't exist. They link to the **first article in the category** (sorted by `order`):

```ts
const catArticles = allArticles
  .filter(a => a.data.category === cat.slug)
  .sort((a, b) => a.data.order - b.data.order);
const firstHref = catArticles[0]?.id
  ? `/kb/${catArticles[0].id.replace(/\.mdx?$/, '')}/`
  : null;
```

## Deployment

**Cloudflare account:** `jeremys@synertekcs.com` (ID: `8fefd04d62780c1624579795cb08f891`)
**CF Pages project name:** `beacon-docs`
**Custom domain:** `beacon.synertekcs.com` (set in CF dashboard)

**Local deploy (with direnv):**
`.envrc` sets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` for the synertekcs.com account.
```bash
pnpm run build
wrangler pages deploy dist --project-name=beacon-docs
```

**CI/CD:** `.github/workflows/deploy.yml` — triggers on push to `main`.
Uses `cloudflare/wrangler-action@v3` with `accountId: 8fefd04d62780c1624579795cb08f891`.
API token stored as GitHub secret `CLOUDFLARE_API_TOKEN`.

**`wrangler.toml` for Pages is minimal** — `account_id` is NOT supported for Pages projects:
```toml
name = "beacon-docs"
pages_build_output_dir = "dist"
```

## Known wrangler v4 gotchas

- `wrangler pages domain` subcommand was **removed** in v4 — manage custom domains in the CF dashboard
- `account_id` in `wrangler.toml` is rejected for Pages projects — use `accountId` in the workflow `with:` block instead

## Content status

3 full articles + 21 substantive stubs across all 9 categories. Stubs have real frontmatter and an intro paragraph — not lorem ipsum. Articles needing full content expansion are flagged with a `> **This article is a stub.**` callout block.

Full articles:
- `installation/agent-installation.md`
- `using-beacon/jobs-vs-policies.md`
- `remote-access/connecting-via-rustdesk.md`
