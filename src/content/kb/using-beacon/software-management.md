---
title: Software Management (winget)
category: using-beacon
order: 4
updated: 2026-08-26
tags: [software, winget, updates]
---

Software Management updates third-party applications, complementing Beacon's separate Patch Management feature, which only covers Windows Update itself. Rather than a hand-rolled application catalog, Beacon leans on Windows Package Manager (`winget`), which already maintains its own database of installers and silent-update behavior. Windows-only.

## Updating software

From a device's kebab menu on Device Detail, choose **Update Software (winget)**. There's no confirmation dialog — this is treated as a non-destructive action. The agent runs `winget upgrade` against the endpoint and the raw output is surfaced verbatim in that device's Command History, the same place Job and direct-command output appears.

This is a simple opt-in sweep, not a policy: there's no scheduling, targeting, or allowlist yet. You trigger it per device, when you want it.

Because winget's own machine-readable output isn't reliable enough to parse consistently across versions, Beacon doesn't attempt structured per-package success/failure reporting — read the Command History output directly. The endpoint needs `winget` already present to do anything.

## Uninstalling software

The Software section on Device Detail can show an **Uninstall** action next to an installed application. It only appears when the application can be uninstalled silently — either it has a `QuietUninstallString`, or its `UninstallString` runs `msiexec` in a way Beacon can reliably append `/qn /norestart` to. Anything else gets no button at all: uninstall runs in a SYSTEM context with no visible desktop, so an installer that needs someone to click through a wizard would have nowhere to show its prompts and no way to complete.

## Beta support

The dashboard-to-agent dispatch pipeline for winget updates is confirmed; actual `winget upgrade` execution has not yet been verified against real Windows hardware. Software Uninstall is confirmed for MSI-based and quiet-uninstall-capable applications.
