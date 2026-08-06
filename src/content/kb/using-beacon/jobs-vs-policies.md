---
title: Jobs and Policies
category: using-beacon
order: 1
updated: 2026-08-05
tags: [jobs, policies, monitoring, automation]
---

Policies continuously evaluate monitored conditions. Jobs execute one or more Components once—immediately or at one future scheduled time. Use a Policy to detect a condition and a Job to take a deliberate action.

| | Policy | Job |
| --- | --- | --- |
| Purpose | Monitor health and create/resolve alerts | Run Components on targets |
| Timing | Check-in, agent probe, audit, or scheduled backend evaluation | Quick now or one scheduled future dispatch |
| Targeting | May mix Companies, devices, and Device Groups | One target kind per job; target resolution is at dispatch |
| Result | Alert state | Per-command output and completion state |

## Policies

A Policy contains monitors. Its targets can combine Companies, devices, and Device Groups; no targets means unrestricted. OS and device-class filters are separate constraints. Beacon prefetches target data during evaluation, so do not expect policy scope labels alone to determine matching.

Monitors cover disk, CPU, memory, offline state, antivirus, file size, ping, process, Windows service, and software-change checks. Support differs by platform: Windows and Linux monitoring are not identical, and macOS is unvalidated. Set a sustained condition to suppress brief metric spikes. Software-change alerts are audit-driven and never auto-resolve.

## Jobs and Components

Components are reusable scripts from **Components**. ComStore Components are read-only; clone one before changing it. Component target OS is enforced when a job is dispatched. Components may prompt for variables, and scripts receive the resolved values in their process environment.

Jobs normally run as the system/root identity. Running as the logged-in user is restricted to the supported Windows/PowerShell scenario and fails clearly when no suitable console session exists. Review command stdout/stderr on the Job detail page before relying on the agent log for command-specific diagnostics.

Scheduled jobs are one-time, not recurring. Their targets are resolved when they dispatch, so new members can be included and overlapping Device Group membership is deduplicated. Recurring job schedules are deferred in the beta.

## Choosing the right tool

- Alert when a disk is low or a device is offline: create a **Policy** monitor.
- Restart a service, collect a report, or remediate an alert: run a **Quick Job**.
- Run a maintenance task at a known window: create a one-time **Scheduled Job**.

See [Scripting and Components](/kb/using-beacon/scripting/) and [Alert Rules](/kb/alerting-policies/alert-rules/).
