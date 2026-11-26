---
title: Architecture Overview
category: getting-started
order: 2
updated: 2026-11-26
tags: [architecture, cloudflare, agent]
---

Beacon has three deployable parts: a Go endpoint agent, a Cloudflare Worker control plane, and a Vue dashboard. The Worker uses D1 for persistent data, Durable Objects for the remote-session relay, and R2 for private file storage (the branding logo, application installers, and Web Remote file transfers).

## Endpoint-to-control-plane flow

The agent enrolls with a company token and receives a per-device credential. It then checks in over HTTPS about once a minute (see [Instant push](#instant-push) for the connected case). A check-in reports metrics and prior command results; the Worker returns any queued commands and monitoring assignments. This pull model means endpoints do not listen for inbound management connections.

```text
Dashboard → Worker API → D1 command queue
                         ↓
Endpoint agent ← HTTPS check-in (about once a minute)
Endpoint agent → results and telemetry → Worker API
```

Remote Shell uses the same outbound model. A technician and the agent each connect to a session-specific Durable Object relay; the endpoint still has no inbound listener.

## Instant push

The check-in interval is about 60 seconds. Each agent adds up to 10% random jitter, so devices that start together drift apart instead of all arriving at the same moment.

Each agent also keeps one idle WebSocket open to a per-device Durable Object (`DeviceHub`). While that connection is up, the agent checks in every 4 minutes instead of every minute, and the Worker pushes a short "wake" message the moment something is queued for the device: a Web Remote or Remote Shell session, a direct device command, or a small Quick Job. The agent then checks in immediately. Sessions and commands therefore reach a connected device in seconds, and an idle fleet makes far fewer requests to the Worker, which is what lets a small fleet fit inside Cloudflare's free Workers plan.

The connection carries no data. Commands, results, and session requests still travel in the normal check-in; the wake message only says "check in now". If the connection drops, the agent falls back to polling every 60 seconds and reconnects with growing delays. A device's page shows an **Instant push** badge while the connection is up and **Polling** when it is not. Instant push needs the `DEVICE_HUB` Durable Object binding in the Worker (see the [self-hosting guide](https://github.com/synertek-cloud-services/beacon/blob/main/docs/SELF_HOSTING.md)); without it everything still works, just by polling.

Because a connected device checks in every 4 minutes, **Last Seen** on a healthy device can be a few minutes old. Use [offline-monitor](/kb/alerting-policies/alert-rules/) thresholds well above that; the seeded default is 30 minutes.

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
