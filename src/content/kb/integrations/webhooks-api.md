---
title: Webhooks & API
category: integrations
order: 1
updated: 2026-07-16
tags: [api, webhooks, integration, automation, rest]
---

Beacon exposes a REST API for all operations available in the dashboard. Webhooks allow external systems to receive push notifications when alert states change, devices check in, or jobs complete.

## Authentication

All API requests require a Bearer token:

```http
Authorization: Bearer <your-api-token>
```

Generate API tokens at **Dashboard → Settings → API Tokens**. Tokens inherit the role and company scope of the user that creates them. Service account tokens with restricted scopes can be created by Administrators.

## Base URL

```
https://<your-worker-domain>/v1
```

## Devices

```http
GET  /v1/devices           # List all devices (paginated)
GET  /v1/devices/:id       # Get device details and current metrics
POST /v1/devices/:id/archive  # Archive a device
```

## Jobs

```http
GET  /v1/jobs              # List jobs
POST /v1/jobs              # Create a job
GET  /v1/jobs/:id          # Get job details and command results
```

**Create job payload:**

```json
{
  "name": "Flush DNS",
  "type": "quick",
  "target": { "type": "all" },
  "components": [
    {
      "component_id": "comp_abc123",
      "variables": { "VAR_NAME": "value" }
    }
  ]
}
```

## Alerts

```http
GET  /v1/alerts            # List alerts (filter: ?status=active&priority=high)
GET  /v1/alerts/:id        # Get alert details
POST /v1/alerts/:id/acknowledge  # Acknowledge an alert
POST /v1/alerts/:id/resolve      # Manually resolve an alert
```

## Webhooks

Outgoing webhooks are configured at **Dashboard → Settings → Notification Channels → New Channel → Webhook**. Beacon sends a POST to your endpoint on alert state changes.

### Webhook payload

```json
{
  "event": "alert.created",
  "alert": {
    "id": "alrt_abc123",
    "priority": "high",
    "status": "active",
    "check_type": "disk_space",
    "message": "Drive C: has 7.2 GB free (below 10 GB threshold)",
    "triggered_at": "2026-07-16T14:23:00Z",
    "device": {
      "id": "dev_xyz789",
      "name": "DESKTOP-ABC01",
      "company": "Acme Corp",
      "site": "Main Office"
    }
  }
}
```

### Webhook events

| Event | Fires when |
|---|---|
| `alert.created` | A new alert is raised |
| `alert.acknowledged` | A technician acknowledges the alert |
| `alert.resolved` | Alert is resolved (auto or manual) |
| `device.online` | Device checks in after being offline |
| `device.offline` | Device triggers an offline alert |
| `job.completed` | A job finishes (all commands done) |

### Webhook security

Beacon signs each webhook POST with an HMAC-SHA256 signature in the `X-Beacon-Signature` header. Verify it:

```python
import hmac, hashlib

def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

Configure your webhook secret at **Settings → Notification Channels → [channel] → Signing Secret**.

See also: [Notification Channels](/kb/alerting-policies/notification-channels/), [Autotask PSA](/kb/integrations/autotask-psa/)
