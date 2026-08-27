---
title: PSA Integration Pattern
category: integrations
order: 2
updated: 2026-08-26
tags: [psa, webhooks, email, integrations]
---

Beacon has no native Autotask, PSA, ticketing, or billing connector in the current beta. Use a webhook endpoint you control as an integration boundary if you need to create tickets in another system.

The receiving service should map an alert notification to a ticket, store its own correlation state, and tolerate retries or duplicates. Keep external-service credentials in that service’s secret store, not in Beacon scripts or webhook URLs. Whether a resolved alert should close, comment on, or leave a ticket open is a workflow decision for the receiving service.

Because webhooks are experimental and no public Beacon API is supported yet, validate the complete alert-to-ticket flow in a test Company before operational use. See [Webhooks and Integration Boundaries](/kb/integrations/webhooks-api/).

## Email-based PSA correlation

If your PSA ingests tickets by parsing inbound email rather than a webhook, Beacon's alert emails are built to support that. The subject line keeps a stable prefix across an alert's whole open→resolved lifecycle — only a trailing `[Open]`/`[Resolved]` tag changes — so a PSA can correlate the two messages as one incident by subject alone. The body uses the same labeled fields in both states: Alert ID, Company, Device, Check Type, Priority, State, and Opened/Resolved At, plus a link back to the alert in Beacon.

Each alert email also carries `X-Beacon-Alert-Id`, `X-Beacon-Device-Id`, `X-Beacon-Company-Id`, `X-Beacon-Event`, `X-Beacon-Priority`, and `X-Beacon-Schema-Version` headers. Prefer parsing these over the subject/body text where your mail pipeline can read raw headers — they're meant to stay stable even if the human-readable wording changes later.
