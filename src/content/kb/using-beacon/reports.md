---
title: Reports
category: using-beacon
order: 5
updated: 2026-08-26
tags: [reports, csv, export]
---

**Reports** provides on-demand CSV exports for three areas: Device Inventory, Patch Compliance, and Alert History. This is an export tool, not a reporting engine — there's no scheduling, no email delivery, and no PDF output. If you need a report on a recurring basis, download it manually each time or build that automation against the CSV yourself.

## Using Reports

Open **Reports** from the main navigation. Each report type has its own **Download CSV** button and shares a single company filter above them — narrow to one company or leave it unfiltered for the whole fleet. There's no in-dashboard preview; the file downloads directly.

- **Device Inventory** — one row per device: identification, OS, class, and status fields.
- **Patch Compliance** — Windows Update state per device, useful for showing a client (or an auditor) what's approved, installed, and outstanding.
- **Alert History** — a record of alert activity over the current filter, useful for incident review or SLA reporting.

Software Inventory was considered for a fourth report type and deferred — it's the largest and sparsest of the candidates, with real per-device row-count concerns at scale.

See [Monitoring and Alerting](/kb/using-beacon/monitoring-alerting/) for how alert data is generated, and [Company setup](/kb/administration/tenant-site-setup/) for how the company filter maps to your organizational structure.
