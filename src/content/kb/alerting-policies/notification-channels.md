---
title: Alert Notifications
category: alerting-policies
order: 2
updated: 2026-08-26
tags: [alerts, email, webhooks]
---

Beacon alert delivery is configured globally, then opted into per monitor. The beta supports an email provider and webhook endpoints; both notification paths are experimental and should be tested before being used for critical response.

## Email

An administrator configures the active provider in **Settings → Email** and adds notification recipient addresses. A recipient does not need a Beacon user account. Enable **Email notification** on the monitor that should send alerts.

## Webhooks

An administrator adds HTTPS webhook endpoints in **Settings → Webhooks**. Enable **Webhook notification** on each monitor that should deliver there. Treat the endpoint as an integration receiver: make processing idempotent, capture failures in its own logs, and do not expose customer data in error reports.

The current beta intentionally does not have per-monitor additional recipient lists or a general notification-channel routing system. See [Webhooks and Integration Boundaries](/kb/integrations/webhooks-api/) for limits on external automation.

## Automatic muting for flapping monitors

If a specific device+monitor pair trips and clears repeatedly in a short window (more than 10 times within 15 minutes), Beacon automatically mutes further email/webhook notifications for that pair. This only mutes the notification channel — the alert itself, its dashboard visibility, and normal evaluation are unaffected. A self-expiring **Muted** badge appears on Global Alerts, Alert Detail, and Device Detail while it's active, and it clears on its own once the flapping stops; there's no manual unmute.

Manually resolving an alert is never muted by this — a technician's deliberate action always goes through. If a monitor keeps re-tripping the mute repeatedly, expect roughly one meta-notification every 15 minutes rather than a full resend of every individual flap.
