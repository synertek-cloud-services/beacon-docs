---
title: Frequently Asked Questions
category: resources
order: 2
updated: 2026-08-05
tags: [faq, beta, self-hosting]
---

Common questions about licensing, platform support, and how Beacon operates day to day.

## Is Beacon free to use?

Beacon is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). It has no per-endpoint license fee, but self-hosters operate and pay for their own Cloudflare infrastructure and supporting services.

## Which platforms are supported?

Windows and systemd-based Linux have supported beta installation, enrollment, core metrics, inventory, and basic monitoring. Capability support is not identical. macOS is unvalidated and should not be deployed as a supported beta endpoint. Read the [platform matrix](https://github.com/synertek-cloud-services/beacon/blob/main/docs/BETA_PLATFORM_SUPPORT.md) for every workflow.

## Does Beacon require inbound firewall rules?

No. The agent checks in over outbound HTTPS. Remote Shell also attaches outbound to the session relay. This does not remove the need for your normal outbound proxy, DNS, TLS-inspection, and firewall validation.

## Does Beacon provide remote desktop or RDP tunneling?

No. The beta provides Remote Shell. It has no RustDesk integration, graphical remote-control feature, RDP tunnel, or generic TCP tunnel.

## Can I integrate with an external tool through an API?

The dashboard’s Worker API is not a supported public API surface in this beta. Use configured alert webhooks for notification integrations; do not automate against internal dashboard endpoints.

## Where are logs and data stored?

The agent log is `%PROGRAMDATA%\Beacon\agent.log` on Windows and `/etc/beacon/agent.log` on Linux. Beacon control-plane data is stored in the self-hoster’s Cloudflare D1 database; branding logos are private R2 objects. Follow the project’s [backup and recovery runbook](https://github.com/synertek-cloud-services/beacon/blob/main/docs/BACKUP_RECOVERY.md) rather than relying on ad-hoc exports.
