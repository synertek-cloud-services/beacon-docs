---
title: Escalation
category: alerting-policies
order: 3
updated: 2026-07-16
tags: [escalation, notifications, alerting, on-call]
---

Escalation rules automatically route an alert to a higher-priority notification channel when it goes unacknowledged for too long. This prevents critical alerts from being missed if the initial notification is overlooked.

## How escalation works

When an alert fires and is not acknowledged within a configured window, Beacon triggers an escalation:

1. Alert fires → sends notification to the **primary channel**
2. If not acknowledged within **escalation delay** → sends notification to the **escalation channel**
3. Repeat (optional) at configurable intervals until the alert is acknowledged or resolved

Escalation only fires when the alert remains in **Active** state. Acknowledging the alert stops escalation immediately.

## Configuring escalation

Escalation is configured per-policy at **Dashboard → Policies → [policy] → Escalation**.

| Setting | Description |
|---|---|
| **Enabled** | Toggle escalation on/off for this policy |
| **Delay (minutes)** | How long to wait after the initial notification before escalating |
| **Escalation channel** | Which notification channel to use for escalations |
| **Repeat interval (minutes)** | Re-notify on the escalation channel this often until acknowledged (optional) |
| **Priority filter** | Only escalate alerts at or above this priority (e.g. High and Critical only) |

## Example configuration

A common setup for a managed services team:

- **Primary channel**: Slack `#alerts` — all alerts land here
- **Escalation delay**: 15 minutes — enough time for someone to see the Slack message during business hours
- **Escalation channel**: Email to on-call pager address — ensures someone is paged if Slack goes unnoticed
- **Repeat interval**: 30 minutes — re-page every 30 minutes until acknowledged
- **Priority filter**: Critical and High only — Moderate and Low alerts do not escalate

## Escalation for off-hours coverage

For 24/7 coverage, consider a two-tier escalation with different channels for business hours vs. after hours. Beacon does not currently have a built-in business hours schedule for escalation routing — a workaround is to use a webhook channel and let your alerting platform (PagerDuty, OpsGenie) handle on-call scheduling.

See [Webhooks & API](/kb/integrations/webhooks-api/) for the webhook payload format.

See also: [Alert Rules](/kb/alerting-policies/alert-rules/), [Notification Channels](/kb/alerting-policies/notification-channels/)
