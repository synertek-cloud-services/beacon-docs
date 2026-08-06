---
title: PSA Integration Pattern
category: integrations
order: 2
updated: 2026-08-05
tags: [psa, webhooks, integrations]
---

Beacon has no native Autotask, PSA, ticketing, or billing connector in the current beta. Use a webhook endpoint you control as an integration boundary if you need to create tickets in another system.

The receiving service should map an alert notification to a ticket, store its own correlation state, and tolerate retries or duplicates. Keep external-service credentials in that service’s secret store, not in Beacon scripts or webhook URLs. Whether a resolved alert should close, comment on, or leave a ticket open is a workflow decision for the receiving service.

Because webhooks are experimental and no public Beacon API is supported yet, validate the complete alert-to-ticket flow in a test Company before operational use. See [Webhooks and Integration Boundaries](/kb/integrations/webhooks-api/).
