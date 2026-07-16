---
title: Quick Start
category: getting-started
order: 3
updated: 2026-07-16
tags: [quick-start, setup, deploy, cloudflare]
---

Get a Beacon instance running end-to-end in under 30 minutes. This guide covers deploying the Worker control plane, running the dashboard, and enrolling your first device.

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works)
- [Node.js](https://nodejs.org) 20+ and [pnpm](https://pnpm.io)
- [Go](https://go.dev/dl/) 1.22+ (only needed if building the agent from source)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/): `pnpm add -g wrangler`

## Step 1 — Clone the repository

```bash
git clone https://github.com/synertek-cloud-services/beacon.git
cd beacon
pnpm install
```

## Step 2 — Create the D1 database

```bash
# Create the database in Cloudflare
wrangler d1 create beacon-db

# Copy the database ID from the output and paste it into wrangler.toml
# under [[d1_databases]]

# Apply the schema
wrangler d1 execute beacon-db --file=worker/schema.sql
```

## Step 3 — Configure Worker secrets

```bash
# Generate a secure random string for API token signing
wrangler secret put SIGNING_SECRET

# Set the dashboard origin (for CORS)
wrangler secret put DASHBOARD_ORIGIN
# e.g.: https://rmm.yourdomain.com
```

## Step 4 — Deploy the Worker

```bash
cd worker
wrangler deploy
```

The Worker is now live at `https://beacon-worker.<your-account>.workers.dev` (or your custom domain if configured).

## Step 5 — Build and run the dashboard

```bash
cd ../dashboard
pnpm dev
```

Open `http://localhost:5173`. On first load you'll be prompted to enter your Worker URL and create an admin account.

## Step 6 — Enroll your first device

1. In the dashboard, go to **Companies** and create a new company
2. Open the company and click **Generate Enrollment Token**
3. Copy the enrollment token
4. On the target endpoint, download the Beacon agent binary for your platform from the [Releases page](https://github.com/synertek-cloud-services/beacon/releases)
5. Run enrollment:

```bash
./beacon-agent --worker-url https://beacon-worker.<account>.workers.dev \
               --enroll-token ent_<your-token>
```

The device appears in the Beacon dashboard under **Devices** within 60–90 seconds.

## Next steps

- [Installing as a system service](/kb/installation/agent-installation/#installing-as-a-system-service) — keep the agent running across reboots
- [Tenant & Site Setup](/kb/administration/tenant-site-setup/) — organize devices into companies and sites
- [Understanding Jobs vs. Policies](/kb/using-beacon/jobs-vs-policies/) — set up monitoring and automate remediation
