---
title: Monitoring and Alerting
category: using-beacon
order: 2
updated: 2026-08-05
tags: [monitoring, alerts, policies]
---

Create Policies from monitor rules, then target them at the intended Companies, devices, or Device Groups. A condition must persist for its configured duration before it raises an alert; this is the main control for avoiding noisy alerts.

## Alert lifecycle

Alerts can be active, acknowledged, and resolved. Acknowledging records that an operator has seen the issue; it does not change the monitor condition. Where auto-resolution applies, Beacon resolves the alert when subsequent evaluation observes recovery. Software-change monitors are event-based and remain manual-review alerts.

## Operational guidance

- Start with conservative thresholds and test on a non-critical endpoint.
- Use a disk, CPU, memory, offline, or antivirus monitor for persistent health signals.
- Use file-size, ping, and process monitors with their beta support status in mind. Windows service monitoring is Windows-only.
- Enable email/webhook delivery on the individual monitor only after testing the receiver.
- Use Maintenance Policies for planned work where appropriate; monitoring behavior and notification expectations should be validated in your own environment.

The [platform matrix](https://github.com/synertek-cloud-services/beacon/blob/main/docs/BETA_PLATFORM_SUPPORT.md) is authoritative where this page and the dashboard could otherwise imply parity.
