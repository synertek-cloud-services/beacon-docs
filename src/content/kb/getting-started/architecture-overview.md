---
title: Architecture Overview
category: getting-started
order: 2
updated: 2026-07-16
tags: [architecture, cloudflare, workers, d1, durable-objects]
---

Beacon uses a three-tier architecture: a Go agent on managed endpoints, a Cloudflare Worker control plane, and a Vue 3 dashboard. All three tiers communicate over standard HTTPS — no VPN, no self-hosted server infrastructure beyond the Worker deployment.

## Control plane (Beacon Worker)

The Beacon Worker is a Cloudflare Worker application built with the [Hono](https://hono.dev) framework. It runs on Cloudflare's global edge network and handles all agent and dashboard interactions.

**Storage:**
- **D1 database** — SQLite at the edge; stores devices, companies, jobs, policies, alerts, sessions, and audit data
- **KV namespaces** — used for fast agent credential lookups and enrollment token validation

**Durable Objects:**
- **SessionRelay** — manages remote access sessions (remote shell, RustDesk, RDP tunnel). Each session is a WebSocket relay that connects the agent (outbound) with the technician (inbound), with no inbound connection required on the endpoint side.

**Key API routes:**
- `POST /v1/enroll` — agent enrollment
- `POST /v1/checkin` — agent check-in (60s heartbeat + metric submission + command receipt)
- `GET /v1/devices` — device list (dashboard)
- `POST /v1/jobs` — create a job (dashboard)
- `GET /v1/sessions/:id/relay` — WebSocket relay for remote sessions

## Agent (endpoint side)

The Beacon Agent is a single Go binary with no runtime dependencies. On startup it reads its stored credential (written on first enrollment) and begins the check-in loop.

**Check-in cycle (every 60 seconds):**
1. Collect metrics (CPU, memory, disk, antivirus, platform info)
2. POST to `/v1/checkin` — sends metrics, receives pending commands
3. Execute any dispatched commands (run script, open session, trigger audit)
4. Report command results on the next check-in

Commands dispatched by the Worker are returned inline in the check-in response — there is no persistent connection between check-ins. This design means firewalls see only standard HTTPS traffic with a 60-second polling interval.

## Dashboard (Vue 3 SPA)

The Beacon Dashboard is a Vue 3 application hosted as a static site. Technicians and administrators interact with it through a browser — it calls the Worker REST API directly using an API token obtained at login.

The dashboard does not communicate with agents directly; all command dispatch flows through the Worker. This means dashboard access permissions are enforced entirely by the Worker API.

## Data flow example: running a script job

```
Technician (Dashboard)
  → POST /v1/jobs           (Worker API: creates job, queues commands)
  → Worker stores pending commands in D1

Agent (on endpoint, next 60s check-in)
  → POST /v1/checkin        (Worker returns pending command list)
  → Agent executes script   (local execution, no inbound connection)
  → Agent collects stdout/stderr/exit-code

Agent (following check-in)
  → POST /v1/checkin        (Worker receives command result)
  → Worker updates D1

Technician (Dashboard, polling)
  → GET /v1/jobs/:id        (Worker returns updated results)
```

## Data flow example: remote shell session

```
Technician
  → POST /v1/sessions       (Worker creates session, queues open_session command)
  → GET /v1/sessions/:id/relay  (WebSocket to SessionRelay Durable Object — waits)

Agent (next check-in)
  → POST /v1/checkin        (receives open_session command)
  → WSS to SessionRelay DO  (outbound from endpoint — no inbound needed)

SessionRelay DO
  → Bridges both WebSocket connections
  → Forwards bytes between technician and agent in both directions
```

## Security model

- **Agent credentials** are per-device Ed25519 key pairs generated at enrollment. The Worker validates the device credential on every check-in.
- **Enrollment tokens** are per-tenant and single-use by default. They are invalidated after the first successful enrollment or after their configured TTL.
- **Dashboard authentication** uses short-lived API tokens issued by the Worker. Role enforcement (admin vs. technician vs. read-only) is applied at the Worker API layer.
- **Self-update signatures** — agent update binaries are signed with an Ed25519 key held by the Beacon release pipeline. The agent verifies this signature before applying any update.

See also: [Installing the Beacon Agent](/kb/installation/agent-installation/), [Connecting via RustDesk](/kb/remote-access/connecting-via-rustdesk/)
