---
title: Frequently Asked Questions
category: resources
order: 2
updated: 2026-07-16
tags: [faq, questions, reference]
---

## General

### Is Beacon free to use?

Yes. Beacon is open-source (MIT license) and free to self-host. You'll need a Cloudflare account for the Worker and D1 database — both are available on Cloudflare's free tier for small deployments. There is no per-device licensing fee.

### How many devices can Beacon manage?

Beacon's architecture scales with Cloudflare Workers — there is no hard device limit in the application. Practical limits are determined by your Cloudflare plan's D1 read/write limits and Worker CPU time. The free tier is suitable for testing and small deployments; larger fleets should use the Cloudflare Workers Paid plan.

### What operating systems does the Beacon agent support?

Windows (x64), Linux (x64), and macOS (Apple Silicon and Intel). The agent is a Go binary and can be cross-compiled for other platforms, but these three are the officially tested and released targets.

### Does Beacon require inbound firewall rules?

No. All communication is initiated outbound from the agent to the Cloudflare Worker. Remote access sessions also use outbound connections from the endpoint to the Cloudflare relay. You do not need to open any inbound ports on managed devices.

## Agents & Check-ins

### Why is a device showing as offline even though it seems online?

The offline threshold in Beacon's default policy is 30 minutes without a check-in. Check the agent log on the device — if the service is running but check-ins are failing, there may be a connectivity issue to the Worker URL or a credential problem. See [Troubleshooting Best Practices](/kb/troubleshooting/best-practices/).

### Can I change the check-in interval from 60 seconds?

The 60-second check-in interval is currently hardcoded in the agent. A configurable interval is on the roadmap. More frequent check-ins would require a Cloudflare paid plan for production deployments due to Worker request limits.

### What happens to commands if the agent is offline?

Commands are queued in D1. When the agent comes back online and checks in, it receives any pending commands (up to the expiration time configured on the job). A job created while a device is offline will still dispatch when the device reconnects, as long as the job hasn't expired.

## Remote Access

### Do managed devices need RustDesk pre-installed for remote access?

Only for Tier 2 (graphical remote desktop). Tier 1 (browser-based shell) works with no additional software on the endpoint. Tier 3 (RDP tunnel) requires Windows Remote Desktop to be enabled, but no additional software beyond what Windows ships with.

### Can multiple technicians connect to the same device simultaneously?

Tier 1 (shell): currently limited to one active shell session per device. Tier 2 (RustDesk) and Tier 3 (RDP): subject to the standard limitations of RustDesk and Windows RDP respectively (Windows Home editions allow only one RDP session at a time).

## Alerting & Policies

### Can a device have multiple policies applied?

A device can be covered by a global policy and a company-scoped policy simultaneously. However, when both cover the same check type, the company policy's monitors replace the global policy's monitors for that check type entirely — they do not merge. See [Understanding Jobs vs. Policies](/kb/using-beacon/jobs-vs-policies/#policy-scope).

### Why isn't my alert auto-resolving?

The most common cause is that `auto_resolve` is not enabled on the monitor. Check the monitor configuration in the policy editor. Note: `software` monitors never auto-resolve by design — they require manual closure because a software change may need human review regardless of the current state.

### Can Beacon send alerts to PagerDuty?

Not natively, but you can bridge Beacon's webhook channel to PagerDuty's Events API using a Cloudflare Worker or similar intermediary. See [Webhooks & API](/kb/integrations/webhooks-api/).

## Self-hosting

### Where is data stored?

All Beacon data is stored in a Cloudflare D1 database (SQLite). The database is tied to your Cloudflare account and region. There is no separate database server to manage.

### Can I run Beacon on my own servers instead of Cloudflare?

The Worker is designed specifically for the Cloudflare Workers runtime (Hono + D1 + Durable Objects). Running it on your own servers would require significant changes to replace D1 with a standard database and re-implement the Durable Object relay. This is not currently a supported path.

### How do I back up my Beacon data?

Use Cloudflare's D1 export feature: `wrangler d1 export beacon-db --output backup.sql`. Schedule regular exports via a Cloudflare cron trigger or an external cron job. See the Cloudflare D1 documentation for point-in-time restore options.
