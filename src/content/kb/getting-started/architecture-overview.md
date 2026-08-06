---
title: Architecture Overview
category: getting-started
order: 2
updated: 2026-08-05
tags: [architecture, cloudflare, agent]
---

Beacon has three deployable parts: a Go endpoint agent, a Cloudflare Worker control plane, and a Vue dashboard. The Worker uses D1 for persistent data, Durable Objects for the remote-session relay, and R2 for private branding-logo storage.

## Endpoint-to-control-plane flow

The agent enrolls with a company token and receives a per-device credential. It then checks in over HTTPS every 60 seconds. A check-in reports metrics and prior command results; the Worker returns any queued commands and monitoring assignments. This pull model means endpoints do not listen for inbound management connections.

```text
Dashboard → Worker API → D1 command queue
                         ↓
Endpoint agent ← HTTPS check-in (every 60 seconds)
Endpoint agent → results and telemetry → Worker API
```

Remote Shell uses the same outbound model. A technician and the agent each connect to a session-specific Durable Object relay; the endpoint still has no inbound listener.

## Responsibilities

| Part | Responsibility |
| --- | --- |
| Agent | Enrollment, metrics, inventory audits, jobs, monitor probes, patch actions, and session attachment. |
| Worker | Authentication and RBAC, command dispatch, policy evaluation, alerts, API routes, and session relay coordination. |
| Dashboard | Day-to-day operation: devices, jobs, policies, patches, settings, alerts, and reports. |

The Worker is deliberately Cloudflare-specific: D1, Durable Objects, R2, and Pages are part of the supported self-hosted architecture.

## Security model

Normal dashboard access uses a local or Microsoft Entra ID session with server-side role checks. `ADMIN_SECRET` is only a break-glass bootstrap/recovery credential. Agent releases are Ed25519-signed; a self-hosted operator should publish a channel signed with its own protected key before production enrollment.

See the [self-hosting guide](https://github.com/synertek-cloud-services/beacon/blob/main/docs/SELF_HOSTING.md) for the full deployment contract.
