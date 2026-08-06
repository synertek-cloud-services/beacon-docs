---
title: Webhooks and Integration Boundaries
category: integrations
order: 1
updated: 2026-08-05
tags: [webhooks, email, integrations]
---

Beacon can deliver alert notifications through configured email and webhook endpoints. These settings are administrator-managed and notification delivery is experimental in the beta. Configure only endpoints your organization controls and review their logs when testing delivery.

## Configure webhooks

From **Settings**, add a webhook endpoint with its HTTPS URL and enabled state. Then enable **Webhook notification** on each monitor that should emit an alert notification. Notification is an explicit per-monitor choice; merely creating an endpoint does not subscribe every alert.

Webhook consumers should accept duplicate delivery safely, validate their own expected payload shape, use a short response time, and avoid storing raw device/customer data unnecessarily. A webhook is a notification mechanism—not an authenticated public API for controlling Beacon.

## Configure email

Configure one supported email provider under **Settings**, then add the standalone notification addresses that should receive alerts. Enable **Email notification** on the relevant monitor. Provider behavior, delivery, and failure visibility remain environment-dependent during beta; test with a non-critical monitor before relying on it for escalation.

## API availability

Beacon’s dashboard uses its Worker API internally, but this beta does not document or support a general external REST API, personal API tokens, service accounts, or a stable API compatibility contract. Do not build production automation against dashboard endpoints. Use the webhook notification surface, or an independently operated integration boundary, until a public API is released.
