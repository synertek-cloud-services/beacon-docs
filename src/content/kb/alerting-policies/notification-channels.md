---
title: Notification Channels
category: alerting-policies
order: 2
updated: 2026-07-16
tags: [notifications, email, slack, webhook, alerting]
---

When a Beacon alert fires, it can notify your team through one or more notification channels. Channels are configured globally and then assigned to policies (or individual monitors) to control which alerts go where.

## Supported channel types

| Channel | Description |
|---|---|
| **Email** | Sends an alert email to one or more addresses |
| **Slack** | Posts to a Slack channel via incoming webhook |
| **Webhook** | POSTs a JSON payload to any HTTP endpoint |
| **Dashboard only** | No external notification; alert visible in dashboard only (default) |

## Configuring a channel

Channels are managed at **Dashboard → Settings → Notification Channels**.

### Email

1. **Settings → Notification Channels → New Channel → Email**
2. Enter one or more recipient addresses (comma-separated)
3. Optionally set a subject prefix (e.g. `[Beacon]`)
4. Click **Save**

Beacon sends email through Cloudflare Email Workers (configured at the Worker deployment level). If email is not configured in your Worker deployment, email channels will silently fail. See your Beacon deployment documentation for setting up email routing.

### Slack

1. In Slack, create an [Incoming Webhook](https://api.slack.com/messaging/webhooks) for your workspace
2. **Settings → Notification Channels → New Channel → Slack**
3. Paste the webhook URL and optionally customize the channel and bot name
4. Click **Save and Test** to send a test message

### Webhook

The webhook channel POSTs a JSON body to your endpoint on every alert state change:

```json
{
  "event": "alert.created",
  "alert_id": "alrt_abc123",
  "priority": "high",
  "device_name": "DESKTOP-ABC01",
  "company": "Acme Corp",
  "check_type": "disk_space",
  "message": "Drive C: has 7.2 GB free (below 10 GB threshold)",
  "triggered_at": "2026-07-16T14:23:00Z"
}
```

Events: `alert.created`, `alert.acknowledged`, `alert.resolved`.

See [Webhooks & API](/kb/integrations/webhooks-api/) for the full payload schema and authentication options.

## Assigning channels to policies

After creating a channel, assign it to a policy to enable notifications for that policy's alerts:

1. **Dashboard → Policies → [policy] → Edit**
2. Under **Notifications**, select one or more channels
3. Optionally filter by priority (e.g. only notify via PagerDuty for Critical)
4. Save

Channels can be assigned at the policy level (all monitors in the policy share it) or overridden per monitor.

## Escalation

See [Escalation](/kb/alerting-policies/escalation/) for configuring escalation rules that route to a different channel when an alert isn't acknowledged within a specified time.
