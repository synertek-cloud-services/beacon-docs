---
title: Self-hosting Quick Start
category: getting-started
order: 3
updated: 2026-08-27
tags: [quick-start, self-hosting, cloudflare]
---

This is a concise path to a disposable validation deployment. For production, follow the complete [self-hosting guide](https://github.com/synertek-cloud-services/beacon/blob/main/docs/SELF_HOSTING.md), including backups, a host-controlled agent channel, and endpoint acceptance testing.

## Decide these names and origins first

Everything below refers back to these values, so pick them before running any commands. Substitute your own; the examples below are used consistently through the rest of this guide.

| Value | Example |
|---|---|
| Worker name | `beacon` |
| D1 database name | `beacon` |
| Private R2 logo bucket | `beacon-logos` |
| Private R2 application-file bucket | `beacon-component-files` |
| **Worker/API origin** | `https://beacon-api.example.com` |
| Pages project | `beacon-dashboard` |
| **Dashboard origin** | `https://beacon.example.com` |

The two bolded rows are two *separate* public URLs — this is the most common setup mistake, so it's worth being explicit: the **Worker/API origin** is the backend that agents check in to and the dashboard calls behind the scenes; nobody opens it in a browser. The **dashboard origin** is the actual web app you and your technicians sign in to. Wherever a step below says "Worker origin" or "API origin," it means the first one, never the dashboard URL.

## Prerequisites

You need a Cloudflare account with Workers, D1, Durable Objects, R2, and Pages, plus Node.js 22, pnpm 10, Git, GNU Make, and Wrangler. Go 1.22+ is required to build agents.

## Deploy the control plane

```bash
git clone https://github.com/synertek-cloud-services/beacon.git
cd beacon
pnpm --dir worker install --frozen-lockfile
pnpm --dir dashboard install --frozen-lockfile
pnpm --dir worker exec wrangler login
```

Create the D1 database and both R2 buckets from the table above:

```bash
cd worker
npx wrangler d1 create beacon
npx wrangler r2 bucket create beacon-logos
npx wrangler r2 bucket create beacon-component-files
```

Copy `worker/wrangler.toml.example` to the ignored `worker/wrangler.toml` and fill in:

| Field | Set it to |
|---|---|
| `account_id` | Your Cloudflare account ID |
| `database_name` / `database_id` | `beacon` / the UUID the `d1 create` command above printed |
| both R2 `bucket_name` values | `beacon-logos` and `beacon-component-files` |
| `ALLOWED_ORIGIN` | Your **dashboard origin** |
| `WORKER_URL` | Your **Worker/API origin** |
| `PAGES_PREVIEW_SUFFIX` | `.beacon-dashboard.pages.dev` (`.<Pages project>.pages.dev`) |
| the custom-domain route | Your **Worker/API origin** |

Then generate and securely store two secrets — `ADMIN_SECRET` and a 32-byte hexadecimal `CONFIG_ENCRYPTION_KEY`. `openssl rand -hex 32` produces a valid value for either one. Put both into `worker/.deploy.secrets` (dotenv format: `ADMIN_SECRET=...` / `CONFIG_ENCRYPTION_KEY=...`).

```bash
cd ..
make migrate-remote
cd worker
pnpm run type-check
npx wrangler deploy --secrets-file .deploy.secrets
```

This deploys the Worker to your **Worker/API origin**. Confirm it's up: `curl --fail https://beacon-api.example.com/health` should return without error.

Now build the dashboard, pointing it at that same Worker/API origin so it knows where its backend lives, and deploy it to Pages:

```bash
cd ..
cp dashboard/.env.production.example dashboard/.env.production
# edit dashboard/.env.production: set VITE_API_URL to your Worker/API origin, e.g. https://beacon-api.example.com
pnpm --dir dashboard run build
cd worker
npx wrangler pages project create beacon-dashboard --production-branch main
npx wrangler pages deploy --cwd .. dashboard/dist --project-name beacon-dashboard --branch main
```

`--cwd ..` runs this from the repository root so Wrangler doesn't pick up the Worker's own `wrangler.toml` by mistake; `dashboard/dist` is resolved against that same root, not against the `worker/` directory you're sitting in.

Opening the resulting **dashboard origin** in a browser is how you'll use Beacon day to day. Once it's up, use **Emergency administrator access** once to create a normal `admin` user, then stop using emergency access for daily work.

## Enroll one supported endpoint

Create a Company and an enrollment token in the dashboard. Use a single-purpose token and revoke it after the intended rollout; the current installer retains it in the service configuration.

From an elevated shell, install a Windows or Linux agent, pointing `--server-url` at your **Worker/API origin** — not the dashboard URL you sign in to:

```powershell
.\beacon-agent-windows-amd64.exe install --server-url https://beacon-api.example.com --enroll-token TOKEN
```

```bash
sudo ./beacon-agent-linux-amd64 install --server-url https://beacon-api.example.com --enroll-token TOKEN
```

Approve the device if its Company does not auto-approve new enrollments, then wait for Last Seen and Last Audit to advance in the dashboard. Do not use this beta guide to deploy macOS endpoints.
