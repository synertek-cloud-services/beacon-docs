---
title: Glossary
category: resources
order: 1
updated: 2026-07-16
tags: [glossary, reference, terminology]
---

Reference for Beacon-specific terms and common RMM concepts.

## Agent

The lightweight Go binary installed on each managed endpoint. Responsible for check-ins, metric collection, command execution, and relay connections. See [Installing the Beacon Agent](/kb/installation/agent-installation/).

## Alert

A notification raised when a monitor's condition is met for the required sustained duration. Alerts have a priority (critical/high/moderate/low) and a lifecycle (active → acknowledged → resolved). See [Monitoring & Alerting](/kb/using-beacon/monitoring-alerting/).

## Check-in

The periodic (every 60 seconds) HTTPS POST the agent makes to the Beacon Worker. Each check-in delivers device metrics and receives any pending commands.

## Check type

The specific metric or condition a monitor evaluates. Beacon supports 10 check types: `cpu_usage`, `memory_usage`, `disk_space`, `av_status`, `offline`, `process`, `service`, `ping`, `file_size`, `software`. See [Alert Rules](/kb/alerting-policies/alert-rules/).

## Company

A top-level tenant in Beacon representing a managed organization or client. Each company has its own enrollment tokens, devices, alerts, and policy scope. See [Tenant & Site Setup](/kb/administration/tenant-site-setup/).

## Component

A reusable script unit in the Components library. Components have a shell type (PowerShell, bash, etc.), a script body, optional input variables, and optional post-conditions. Used as the building blocks of Jobs. See [Scripting & Ad-hoc Execution](/kb/using-beacon/scripting/).

## ComStore

The built-in read-only component library that ships with Beacon. ComStore components can be cloned and customized.

## Credential directory

The platform-specific directory where the agent stores its per-device credential file and agent log. Location: `%PROGRAMDATA%\Beacon\` (Windows) or `/etc/beacon/` (Linux/macOS).

## Durable Object

A Cloudflare infrastructure primitive used by Beacon for the SessionRelay. Each active remote session is managed by a Durable Object instance that bridges the agent WebSocket and the technician WebSocket.

## Enrollment

The process by which a new agent registers with the Beacon Worker and receives its per-device credential. Requires an enrollment token and the Worker URL. See [Installing the Beacon Agent](/kb/installation/agent-installation/).

## Enrollment token

A per-tenant credential that authorizes a new agent to enroll under a specific company. Generated from Dashboard → Companies → [company] → Enrollment Token.

## Job

A one-time or scheduled execution of one or more components against a set of target devices. Jobs are either Quick (immediate) or Scheduled. See [Understanding Jobs vs. Policies](/kb/using-beacon/jobs-vs-policies/).

## Monitor

A single check rule within a Policy. Defines the check type, condition, sustained_minutes, priority, and auto-resolve behavior.

## Policy

A named set of monitors applied to a scope of devices (global or company). The always-on monitoring layer. See [Understanding Jobs vs. Policies](/kb/using-beacon/jobs-vs-policies/).

## Post-condition

A pattern match rule on a component's stdout/stderr output that marks a command as "Warning" without treating it as a failure.

## SessionRelay

The Cloudflare Durable Object responsible for bridging remote access sessions. Both the agent (endpoint side) and the technician (dashboard/client side) connect outbound to the relay, which forwards bytes between them.

## Site

A sub-grouping within a Company (e.g. a physical location or network segment). Optional; devices not assigned to a site are in the company's ungrouped pool. See [Tenant & Site Setup](/kb/administration/tenant-site-setup/).

## Sustained minutes

The debounce duration on a monitor — how long a condition must be continuously true before an alert fires. Prevents alerts from noisy brief metric spikes.

## Worker

The Cloudflare Worker application that serves as Beacon's control plane. Handles agent enrollments, check-ins, command dispatch, alerting, the REST API, and session relay management.
