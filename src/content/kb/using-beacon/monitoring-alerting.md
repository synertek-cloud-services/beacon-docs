---
title: Monitoring & Alerting
category: using-beacon
order: 2
updated: 2026-07-16
tags: [monitoring, alerting, policies, monitors, thresholds]
---

Beacon's monitoring system is built on **Policies** — named collections of check rules called **Monitors**. When a monitor's condition is met for the required duration, an alert is raised. When the condition clears, the alert can auto-resolve or remain open for manual review.

This article covers the operational side: configuring alert thresholds, understanding alert states, and managing active alerts. For a conceptual overview of Policies vs. Jobs, see [Understanding Jobs vs. Policies](/kb/using-beacon/jobs-vs-policies/).

## Alert states

Each alert moves through a defined lifecycle:

| State | Description |
|---|---|
| **Active** | Condition is currently met; alert is open |
| **Acknowledged** | A technician has seen the alert; still open |
| **Resolved** | Condition has cleared (auto) or manually closed |
| **Suppressed** | Alert fired but was muted (outside business hours, maintenance window) |

Alerts are listed in **Dashboard → Alerts**, filterable by state, priority, company, and device.

## Setting thresholds on monitors

Each monitor has a **Condition** (what triggers it) and a **Sustained minutes** value (how long the condition must persist before the alert fires). The sustained duration acts as a debounce — it prevents noise from brief metric spikes.

Recommended starting thresholds for common check types:

| Check type | Condition | Sustained | Notes |
|---|---|---|---|
| `cpu_usage` | ≥ 90% | 10m | Alert on sustained load, not brief spikes |
| `memory_usage` | ≥ 90% | 10m | Short spikes are normal; watch for prolonged high usage |
| `disk_space` | free < 10 GB | 5m | Low debounce; disk doesn't usually fluctuate |
| `offline` | no check-in for 30m | — | No debounce (the threshold itself is the offline window) |
| `av_status` | not detected | 5m | Critical priority |

Thresholds are configured per-monitor when creating or editing a policy at **Dashboard → Policies → [policy] → Edit**.

## Alert priority

Monitors are assigned a priority level that controls how alerts are presented and routed:

| Priority | Color | Use for |
|---|---|---|
| Critical | Red | Immediate action required (antivirus missing, storage full) |
| High | Amber | Significant degradation (device offline, disk low) |
| Moderate | Yellow | Worth investigating soon (memory pressure, slow ping) |
| Low | Gray | Informational (software version changed) |

Priority does not affect how quickly alerts fire — that's controlled by `sustained_minutes`. Priority affects alert visibility in the dashboard and which notification channels receive the alert.

## Acknowledging alerts

Acknowledging an alert signals that someone is aware of the issue. It does not change the device's state or mute future alerts for the same condition.

To acknowledge: **Alerts → [alert] → Acknowledge** (or the Acknowledge button in the alert banner on the device page)

Acknowledged alerts are still listed in the Alerts view. Unacknowledged high/critical alerts are shown prominently in the dashboard header.

## Auto-resolve

When **Auto-resolve** is enabled on a monitor, the alert automatically closes when the condition is no longer true. The resolved alert moves to the Alerts history.

Without auto-resolve, alerts must be manually closed even after the condition clears. This is appropriate for alerts that require human confirmation (e.g., a `software` change alert — you need to verify whether the installation was intentional).

## Maintenance windows

During planned maintenance, you can suppress alerts for a device or company to avoid noise from expected disruptions. Maintenance windows are configured at **Dashboard → [Company or Device] → Maintenance → Schedule Window**.

During a maintenance window, monitors still run — conditions are evaluated — but no alerts are raised. This means once the window ends, if a condition is still true, a fresh alert fires.

See also: [Alert Rules](/kb/alerting-policies/alert-rules/), [Notification Channels](/kb/alerting-policies/notification-channels/)
