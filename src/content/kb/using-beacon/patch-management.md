---
title: Patch Management
category: using-beacon
order: 6
updated: 2026-08-27
tags: [patches, windows-update, patch-policy]
---

Patch Management covers Windows Update visibility, approval, and installation — manually or on a recurring schedule through a Patch Policy. It's Windows-only.

## The pipeline

1. **Visibility** — Beacon scans each device for pending Windows Updates during its normal inventory audit. No admin rights are needed for the scan itself. Antivirus/Defender **definition (signature) updates are deliberately excluded** — they change many times a day through Defender's own update channel, independent of the classic Windows Update catalog, so gating them behind manual approval would only make protection worse. If **Global → Patches** looks emptier than expected on an otherwise healthy fleet, this is usually why — check a device's own AV status rather than expecting a signature update to show up here.
2. **Approval** — an update is approved or ignored once, fleet-wide, not per device. Approving "2026-08 Cumulative Update for Windows 11" approves it everywhere it's detected as pending, not just on the device you were looking at. An update with no decision yet is **pending**.
3. **Install** — an approved update installs either manually (from a device) or automatically through a Patch Policy. An update that isn't approved never installs, even if a Patch Policy's schedule fires — Beacon revalidates approval status again immediately before dispatch.

## Approving updates

**Global → Patches** lists every detected Windows Update fleet-wide with its current status. Approve or ignore from there; there's no per-device approval path.

## Installing updates

From a device's Patches section, install any of its approved-and-pending updates directly. Beacon reports success/failure per update and whether a reboot is required. If a reboot is needed, the signed-in user sees the normal tray Restart Now/Postpone prompt — installing manually does not force an immediate reboot.

The dashboard flags **Reboot Required** at the fleet level (a dashboard widget) and on the device itself, and clears it automatically the moment a lower uptime shows the device actually rebooted — from any cause, not only a Beacon-triggered install.

## Patch Policy

**Global → Patch Policies** automates the same pipeline: auto-approval by update classification plus a recurring install window, similar in shape to a Maintenance Policy.

- **Auto-approve classifications** — limited to **Security Updates** and **Update Rollups**. This is deliberately not a severity threshold: Microsoft only meaningfully populates severity on Security Updates, so a severity-based model couldn't ever auto-approve the other classifications regardless of how it was configured.
- **Auto Reboot** — off by default. When enabled, a device that reports a pending reboot after this policy's install skips the interactive prompt and reboots immediately instead of waiting on the user.
- **Include Drivers** — driver updates can be made visible and manually approved through the same pipeline, but are never eligible for auto-approval under any classification setting — a bad driver can break a machine in a way software usually can't.
- **Target Class** — a Server / Client OS pill, since server hosts need materially different handling (see below).
- **Targeting** — Companies, Devices, and Device Groups, combined the same way as [policy targeting](/kb/administration/tenant-site-setup/) elsewhere in Beacon: a device is covered if it matches any one of them.

A recurring install window won't re-fire mid-occurrence — once it's dispatched for a given window, it waits for the next one.

## Server, Hyper-V, and per-company exclusions

A device Beacon detects as a genuine Server-OS Hyper-V host is automatically excluded from unrestricted or Company-wide Patch Policy sweeps — an unattended reboot there can take down every VM it hosts, not just itself. The only way to patch a Hyper-V host is to target it (or its Device Group) explicitly; Company-level targeting does not bypass the exclusion, since it's just as much an unattended sweep. A device Beacon hasn't yet confirmed as Client-OS stays conservatively excluded until an audit resolves it — this only matters for machines that actually run the Hyper-V role or platform feature; an ordinary desktop is unaffected.

A company can also be excluded from Patch Management entirely (for one that manages Windows Update its own way, e.g. WSUS) — set on the Company's settings, and it overrides every Patch Policy with no per-policy exception.

## Managing Windows' own Automatic Updates

Two more settings on a Patch Policy, both opt-in and independent of each other:

- **Manage Windows' own Automatic Updates** — Beacon disables Windows' native AU client on covered devices so its own approval workflow is the only thing installing updates, instead of the two racing.
- **Manage Microsoft Update** — separately registers or unregisters the "Microsoft Update" service, which extends Windows Update to also cover Office and other Microsoft products.

Both are continuously reconciled: if coverage is ever lost for any reason — the policy is disabled or deleted, the device is retargeted, the company gets excluded — Beacon automatically reverts its changes to that device on the very next check, so a device is never left with its own Automatic Updates disabled and nothing actually covering it.

**Drift detection** — if something outside Beacon (a domain GPO refresh, a local admin) re-enables Windows' own Automatic Updates on a device Beacon is managing, an alert fires through the normal Two-Tier Policy alerting path, the same as a disk or CPU monitor. It clears automatically the instant management is reverted.

## Beta support

Patch Management is Windows-only end to end. A Windows Update scan can take anywhere from 10–90 seconds or longer, and an install has a 15-minute timeout with known download/install edge cases — see [Troubleshooting](/kb/troubleshooting/best-practices/) if a scan or install seems stuck. If an update never becomes eligible to auto-approve on a Patch Policy, check whether its classification is actually one of the two eligible ones — this is a classification match, not a severity threshold.

See [Reports](/kb/using-beacon/reports/) for exporting current patch compliance as a CSV.
