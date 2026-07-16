---
title: Alert Rules
category: alerting-policies
order: 1
updated: 2026-07-16
tags: [alerting, policies, monitors, rules, thresholds]
---

Alert rules in Beacon are defined as **monitors** within a **policy**. Each monitor specifies what to check, when to consider it a problem, how long the problem must persist before alerting, and how to route and close the resulting alert.

This is the reference for the full monitor schema. For conceptual background and choosing between policies and jobs, see [Understanding Jobs vs. Policies](/kb/using-beacon/jobs-vs-policies/).

## Monitor schema

| Field | Type | Description |
|---|---|---|
| `check_type` | enum | The metric or condition to evaluate (see [Check types](/kb/using-beacon/jobs-vs-policies/#check-types)) |
| `condition` | object | The threshold expression (type-specific) |
| `sustained_minutes` | integer | Minutes the condition must persist before alerting (debounce). `0` = alert immediately |
| `priority` | enum | `critical`, `high`, `moderate`, `low` |
| `auto_resolve` | boolean | Close the alert automatically when the condition clears |
| `auto_resolve_after_minutes` | integer | Force-close after N minutes even if the condition hasn't cleared (optional) |
| `message` | string | Custom alert message shown in the dashboard (optional; defaults to a system-generated description) |

## Condition format by check type

### `cpu_usage` / `memory_usage`

```json
{ "operator": "gte", "value": 90 }
```

Operators: `gte` (≥), `gt` (>), `lte` (≤), `lt` (<)
Value: integer 0–100 (percent)

### `disk_space`

```json
{
  "drive": "any",
  "metric": "free_gb",
  "operator": "lte",
  "value": 10
}
```

`drive`: `"any"` (any drive triggers) or a specific letter/path (e.g. `"C"`, `"/"`).
`metric`: `"free_gb"`, `"used_gb"`, `"free_percent"`, `"used_percent"`.

### `av_status`

```json
{ "states": ["not_detected", "not_running"] }
```

Any of the listed states triggers the monitor. States: `not_detected`, `not_running`, `not_up_to_date`.

### `offline`

```json
{ "threshold_minutes": 30 }
```

Fires when no check-in is received for `threshold_minutes`. Does not use `sustained_minutes` (the offline threshold itself is the debounce).

### `process`

```json
{
  "name": "TeamViewer_Service.exe",
  "condition": "not_running"
}
```

Conditions: `not_running`, `running`, `cpu_gte`, `memory_gte`.

### `service` (Windows only)

```json
{
  "name": "Spooler",
  "condition": "stopped"
}
```

Conditions: `stopped`, `running`, `cpu_gte`, `memory_gte`.

### `ping`

```json
{
  "target": "8.8.8.8",
  "condition": "unreachable"
}
```

Conditions: `unreachable`, `loss_gte` (percent), `latency_gte` (milliseconds).

### `file_size`

```json
{
  "path": "C:\\Logs\\app.log",
  "metric": "size_mb",
  "operator": "gte",
  "value": 500
}
```

### `software`

```json
{
  "event": "installed",
  "name_contains": "TeamViewer"
}
```

Events: `installed`, `uninstalled`, `version_changed`. Software monitors trigger on inventory audit events and never auto-resolve.

## Policy scope and override rules

Global policies apply to all devices. Company-scoped policies apply only to devices enrolled in that company. When a device matches both a global policy and a company policy with the same `check_type`, the company policy's monitors replace the global policy's monitors for that check type entirely — no merging.

This lets you apply tighter or looser thresholds for specific clients without modifying global defaults.

See also: [Monitoring & Alerting](/kb/using-beacon/monitoring-alerting/), [Notification Channels](/kb/alerting-policies/notification-channels/)
