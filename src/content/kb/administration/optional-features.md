---
title: Optional Features
category: administration
order: 6
updated: 2026-11-26
tags: [features, settings, cloudflare, free-tier]
---

Beacon is designed to run a small fleet on Cloudflare's free plans. Five features do extra work on every check-in or scheduled run, so a fresh install starts with them **off**. Turn on only what you need under **Settings → Features** (administrators only).

Nothing is locked or paywalled. If you turn on several of them on a larger fleet, you may find you need Cloudflare's Workers Paid plan, which is about $5 per month.

## What each switch controls

| Feature | What it does when on | What "off" means |
| --- | --- | --- |
| **Network Discovery** | A probe device scans a company's network on a schedule. | The company Discovery tab and routes return a "feature off" notice, and scheduled scans are not dispatched. |
| **Application Components** | Installer files (for example MSI) stored in R2 and deployed to devices. | You cannot upload a file, set installer settings, clone an application component, or run a Job that includes one. Script components are unaffected. |
| **Webhooks** | Each alert makes one outbound request per webhook endpoint. | The webhook settings are unavailable and no webhook is sent. Email notifications are separate and keep working. |
| **Windows and Microsoft Update management** | A Patch Policy can take over a device's Windows Update settings; a scheduled job keeps every managed device in sync. | You cannot turn management on for a policy. Management that was already on is still reverted when coverage is lost, so no device is ever left with Windows' own updating disabled and nothing patching it. |
| **Agent-measured monitors** | Ping, process, service, and file-size monitors, each measured by the agent and added to that device's check-ins. | You cannot create those monitor types, and devices are neither assigned nor evaluated against existing ones. Monitors the cron evaluates from check-in data (CPU, memory, disk, antivirus, offline) are always available. |

## Defaults and upgrades

A **fresh install** starts with all five off. An install that **already had devices when it upgraded** keeps everything on, so nothing changes under you.

Features that cost no extra Cloudflare budget are not switches: single sign-on, branding, and shared dashboards are always available.

## Hosted Beacon

A host that runs Beacon for other people can set the plain-text Worker variable `FEATURES_ALL=true`. Every feature is then on and the switches are locked. The setting is read as a variable, not a secret.

See [Architecture Overview](/kb/getting-started/architecture-overview/) for how instant push keeps idle check-ins cheap, and the [self-hosting guide](https://github.com/synertek-cloud-services/beacon/blob/main/docs/SELF_HOSTING.md) for the Cloudflare plan details.
