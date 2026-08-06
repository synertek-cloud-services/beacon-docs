---
title: Alert Response and Escalation
category: alerting-policies
order: 3
updated: 2026-08-05
tags: [alerts, operations, escalation]
---

Beacon tracks alert state in the dashboard and can notify configured email/webhook destinations when a monitor is opted in. It does not provide a built-in multi-stage escalation engine in the current beta.

Define escalation in your operations process or webhook receiver: classify alerts by monitor priority, assign an owner, record acknowledgement and remediation, and decide whether resolution should close an external ticket. Use sustained conditions to reduce noise before building escalation around notification delivery.

An alert normally resolves when its monitor observes recovery, subject to the monitor’s behavior. Software-change monitors are event-based and do not auto-resolve. Use the dashboard and Activity Log as the source of operational history; do not assume a webhook alone is a durable audit trail.
