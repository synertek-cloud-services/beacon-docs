---
title: Understanding Jobs vs. Policies
category: using-beacon
order: 1
updated: 2026-07-16
tags: [jobs, policies, monitoring, automation, scripting]
---

Beacon uses two distinct systems for automated work: **Policies** for continuous monitoring and alerting, and **Jobs** for on-demand or scheduled script execution. Understanding where each fits avoids the common mistake of using one where the other belongs.

## The short version

| | Policies | Jobs |
|---|---|---|
| **Purpose** | Watch for conditions, fire alerts | Execute scripts on devices |
| **Trigger** | Continuous (check-in cycle or cron) | On demand or at a scheduled time |
| **Outcome** | Alert raised / resolved | Command output (pass / fail / warning) |
| **Scope** | Applied to device classes or companies | Targeted at specific devices or sites |
| **Persistence** | Always active until disabled | One-shot (quick) or single scheduled run |

Think of Policies as your always-on monitoring layer, and Jobs as your scripted intervention layer.

---

## Policies

A Policy is a named set of **monitors** — individual check rules that evaluate device health. Policies are applied to devices based on scope and targeting rules, not on demand.

### Policy scope

- **Global** — applies to all devices, or filtered by OS and device class
- **Company** — applies only to devices enrolled under a specific tenant

When a device has both a global policy and a company-scoped policy with monitors of the same check type, the **company policy wins entirely** for that check type. This lets you override default global thresholds for specific clients without merging rules from both.

### Monitors

Each monitor on a policy defines:

- **Check type** — what to measure (see below)
- **Condition** — when to consider the check failed (e.g. CPU ≥ 95%)
- **Sustained minutes** — how long the condition must persist before an alert fires (debounce)
- **Priority** — critical / high / moderate / low
- **Auto-resolve** — whether to automatically close the alert when the condition clears

### Check types

Beacon supports ten check types across four evaluation shapes:

**Sampled every check-in (~60s):**

| Type | What it checks |
|---|---|
| `disk_space` | Free/used GB or percent on any or a specific drive |
| `cpu_usage` | CPU utilization percent |
| `memory_usage` | RAM utilization percent |
| `av_status` | Antivirus state (not detected / not running / not up to date) |

**Evaluated by cron (every 2 min), not tied to check-ins:**

| Type | What it checks |
|---|---|
| `offline` | Device hasn't checked in within a threshold; or (inverted) device is now back online |

**Agent-measured — dispatched in the check-in response, reported on the next check-in:**

| Type | What it checks |
|---|---|
| `file_size` | File or directory size above/below a threshold |
| `ping` | Reachability, packet loss, or latency to a target |
| `process` | Process running/stopped, or its CPU/memory usage |
| `service` | Windows service state or resource usage |

**Evaluated from inventory audits (event-driven, not continuous):**

| Type | What it checks |
|---|---|
| `software` | Software installed, uninstalled, or version changed — never auto-resolves |

### Seeded global policies

A fresh Beacon instance ships with five default global policies:

- **Antivirus Health** — not detected (critical/5m), not running (high/10m), not up to date (moderate/60m)
- **Disk Space** — any drive under 10 GB free (high/5m, auto-resolves in 2h)
- **Device Offline** — no check-in for 30 minutes (high, auto-resolves in 30m)
- **Memory Usage** — ≥ 90% RAM (high/10m, auto-resolves in 30m)
- **CPU Usage** — two-tier: ≥ 95% early warning (high/15m) and ≥ 100% critical (critical/5m)

You can clone, edit, or disable any of these from **Dashboard → Policies**.

---

## Jobs

A Job is a one-time or scheduled execution of one or more **Components** (scripts or applications from your library) against a set of target devices.

### Quick jobs vs. scheduled jobs

**Quick (immediate):** The target device set is resolved the moment you create the job. Commands are dispatched on the next check-in (within 60 seconds). Use quick jobs for:
- Ad-hoc troubleshooting (flush DNS, clear temp files, restart a service)
- On-demand inventory snapshots
- Response to an active alert

**Scheduled:** You specify a future `scheduled_at` time and optional expiration. The device set is resolved **at dispatch time**, not when the job is created — so a job targeted at "All Devices" today will pick up any newly enrolled devices when it actually runs tomorrow. Use scheduled jobs for:
- Maintenance windows (reboot all devices at 2am)
- Recurring cleanup routines (temp files, log rotation)

> Beacon's scheduler supports exactly **one future run** per job, not repeating schedules. For recurring tasks, use your OS scheduler to trigger a quick job via the API, or re-create the scheduled job after each run.

### Components

Components are the reusable script library. Each component has:
- **Kind** — Script or Application
- **Shell** — PowerShell, bash, cmd, etc.
- **Script body** — the actual script content
- **Input variables** — typed parameters (String, Boolean, Date, Selection) that are prompted at job creation time and passed to the script as environment variables
- **Post-conditions** — stdout/stderr patterns that, if matched, mark the command as "Warning" without failing it

Components can be scoped globally or restricted to specific sites. The **ComStore** tab in the Components library contains read-only built-in examples (flush DNS, list software, etc.) that you can clone and customize.

### Targets

A job can be targeted at:
- **All Devices** — every enrolled, approved device
- **Sites** — all devices belonging to one or more companies
- **Specific Devices** — a hand-picked list

When combining site and device targets, Beacon uses the site selection exclusively (adding a site clears any individual device selections, and vice versa).

### Viewing results

Each job gets a detail page (**Jobs → [job name]**) showing:
- A flow diagram: Pending → Running → Successes / Warnings / Failures
- A per-device command breakdown with inline stdout/stderr expansion

A "Warning" result means the command exited successfully but a post-condition pattern matched. A "Failure" means a non-zero exit code.

---

## Choosing between Jobs and Policies

| Scenario | Use |
|---|---|
| Alert me if any device goes offline for more than 30 minutes | **Policy** (offline monitor) |
| Restart the print spooler on a specific machine right now | **Job** (quick job, run_service_restart component) |
| Alert if disk space drops below 10 GB on any drive | **Policy** (disk_space monitor) |
| Clear temp files on all devices every Sunday night | **Job** (scheduled job, cleanup component) |
| Alert if a specific process stops running | **Policy** (process monitor) |
| Run a full software inventory audit now | **Job** (quick job, run_audit command) |
| Alert if antivirus is not detected | **Policy** (av_status monitor) |

If the scenario involves **watching for a condition over time**, use a Policy. If it involves **doing something once or on a schedule**, use a Job.

For monitoring that also triggers a remediation script when it fires, use both: a Policy to detect the condition, and a Job dispatched in response to the alert (manual or, in a future release, automatic via alert webhooks).

See also:
- [Monitoring & Alerting](/kb/using-beacon/monitoring-alerting/) — configuring alert thresholds and priorities
- [Scripting & Ad-hoc Execution](/kb/using-beacon/scripting/) — building and managing Components
- [Alert Rules](/kb/alerting-policies/alert-rules/) — the full policy/monitor schema reference
