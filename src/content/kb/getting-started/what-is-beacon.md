---
title: What is Beacon?
category: getting-started
order: 1
updated: 2026-08-05
tags: [overview, beta, open-source]
---

Beacon is an AGPL-3.0, self-hosted Remote Monitoring and Management (RMM) platform. It is built for teams that want to operate their own control plane without a per-endpoint license fee.

Beacon is a **technical beta**. Windows and Linux are the current practical deployment targets; macOS code exists but is unvalidated and is not a supported beta deployment path. Treat the [beta support matrix](https://github.com/synertek-cloud-services/beacon/blob/main/docs/BETA_PLATFORM_SUPPORT.md) as the product contract before enrolling a fleet.

## What Beacon provides

- An outbound-only endpoint agent for enrollment, check-ins, inventory, command execution, and remote sessions.
- Companies, contacts, locations, Device Groups, and device custom fields for organizing a multi-company environment.
- Policy monitors for disk, CPU, memory, offline state, antivirus, file size, ping, process, Windows service, and software changes.
- Alerting with in-dashboard state, monitor-level notification controls, email providers, and webhooks.
- Reusable Components, Quick Jobs, scheduled one-time jobs, variables and secrets, and command history.
- Remote Shell through an outbound relay; Windows patch scanning, approval, policy scheduling, and reboot handling.
- Local users, Microsoft Entra ID SSO, `readonly` / `technician` / `admin` roles, activity logging, branding, and dashboards.

## Important beta boundaries

Beacon does not claim equal capability on every platform. Linux Remote Shell is supported, while Windows Remote Shell is unvalidated. Windows patch management is Windows-only. Several monitor and notification workflows are experimental. macOS is broadly unvalidated. There is no RustDesk integration or native RDP tunneling in this beta.

## Next steps

- [Architecture overview](/kb/getting-started/architecture-overview/)
- [Self-host a Beacon instance](/kb/getting-started/quick-start/)
- [Install the agent](/kb/installation/agent-installation/)
