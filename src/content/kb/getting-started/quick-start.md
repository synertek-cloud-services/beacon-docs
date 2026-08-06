---
title: Self-hosting Quick Start
category: getting-started
order: 3
updated: 2026-08-05
tags: [quick-start, self-hosting, cloudflare]
---

This is a concise path to a disposable validation deployment. For production, follow the complete [self-hosting guide](https://github.com/synertek-cloud-services/beacon/blob/main/docs/SELF_HOSTING.md), including backups, a host-controlled agent channel, and endpoint acceptance testing.

## Prerequisites

You need a Cloudflare account with Workers, D1, Durable Objects, R2, and Pages, plus Node.js 22, pnpm 10, Git, GNU Make, and Wrangler. Go 1.22+ is required to build agents. Plan separate public origins for the Worker API and dashboard.

## Deploy the control plane

```bash
git clone https://github.com/synertek-cloud-services/beacon.git
cd beacon
pnpm --dir worker install --frozen-lockfile
pnpm --dir dashboard install --frozen-lockfile
pnpm --dir worker exec wrangler login
```

Create a D1 database and private R2 bucket, then copy `worker/wrangler.toml.example` to the ignored `worker/wrangler.toml`. Set its account, database, bucket, `ALLOWED_ORIGIN`, `WORKER_URL`, Pages preview suffix, and routes. Generate and securely store `ADMIN_SECRET` and the 32-byte hexadecimal `CONFIG_ENCRYPTION_KEY`.

```bash
make migrate-remote
cd worker
pnpm run type-check
npx wrangler deploy --secrets-file .deploy.secrets
```

Build the dashboard with `VITE_API_URL` set to the Worker origin, then deploy `dashboard/dist` to Cloudflare Pages. Open it, use **Emergency administrator access** once to create a normal `admin` user, and then stop using emergency access for daily work.

## Enroll one supported endpoint

Create a Company and an enrollment token in the dashboard. Use a single-purpose token and revoke it after the intended rollout; the current installer retains it in the service configuration.

From an elevated shell, install a Windows or Linux agent:

```powershell
.\beacon-agent-windows-amd64.exe install --server-url https://beacon-api.example.com --enroll-token TOKEN
```

```bash
sudo ./beacon-agent-linux-amd64 install --server-url https://beacon-api.example.com --enroll-token TOKEN
```

Approve the device if its Company does not auto-approve new enrollments, then wait for Last Seen and Last Audit to advance. Do not use this beta guide to deploy macOS endpoints.
