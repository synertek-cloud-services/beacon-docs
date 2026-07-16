---
title: What is Beacon?
category: getting-started
order: 1
updated: 2026-07-16
tags: [overview, introduction, open-source]
---

Beacon is an open-source Remote Monitoring and Management (RMM) platform built for managed service providers and IT administrators who want full control over their infrastructure. Unlike commercial RMM tools, Beacon is self-hosted, transparent, and auditable — you own your data, your stack, and your deployment.

## Core components

Beacon consists of three parts that work together:

- **Beacon Agent** — a lightweight Go binary installed on each managed endpoint. Checks in every 60 seconds, reports device health metrics, and accepts commands dispatched from the control plane.
- **Beacon Worker** — a Cloudflare Worker (built with Hono) backed by a D1 (SQLite) database. Handles agent enrollments, check-ins, command dispatch, alerting logic, and the REST API. Deployed to Cloudflare's global edge network.
- **Beacon Dashboard** — a Vue 3 single-page application that administrators use to monitor devices, manage companies, run jobs, and configure policies.

All agent-to-Worker communication is outbound HTTPS — managed endpoints require no inbound firewall rules.

## What Beacon does

- **Device monitoring** — track online/offline status, disk space, CPU, memory, antivirus health, and more via policy-based monitors
- **Remote access** — browser-based remote shell, RustDesk graphical remote desktop, and native RDP tunneling — all through a Cloudflare Durable Object relay
- **Script execution** — run one-off or scheduled scripts (Jobs) across any set of devices using reusable Components from your library
- **Multi-tenant** — manage multiple client organizations (Companies) from a single Beacon instance, with per-tenant isolation and enrollment tokens
- **Alerting** — configurable alert priorities, notification channels, and auto-resolve rules

## What Beacon is not (yet)

Beacon is actively developed and intentionally focused. Features in planning or early development include: patch management, asset/inventory reporting, billing integration, and a mobile dashboard. See the [GitHub repository](https://github.com/synertek-cloud-services/beacon) for the current roadmap.

## Next steps

- [Architecture Overview](/kb/getting-started/architecture-overview/) — how the three components fit together
- [Quick Start](/kb/getting-started/quick-start/) — get Beacon running in under 30 minutes
- [Installing the Beacon Agent](/kb/installation/agent-installation/) — deploy your first managed endpoint
