---
title: Software Management (winget)
category: using-beacon
order: 4
updated: 2026-11-26
tags: [software, winget, updates]
---

Software Management updates third-party applications, complementing Beacon's separate Patch Management feature, which only covers Windows Update itself. Rather than a hand-rolled application catalog, Beacon leans on Windows Package Manager (`winget`), which already maintains its own database of installers and silent-update behavior. Windows-only.

## Updating software

From a device's kebab menu on Device Detail, choose **Update Software (winget)**. There's no confirmation dialog — this is treated as a non-destructive action. The agent runs `winget upgrade` against the endpoint and the raw output is surfaced verbatim in that device's Command History, the same place Job and direct-command output appears.

This is a simple opt-in sweep, not a policy: there's no scheduling, targeting, or allowlist yet. You trigger it per device, when you want it.

Because winget's own machine-readable output isn't reliable enough to parse consistently across versions, Beacon doesn't attempt structured per-package success/failure reporting — read the Command History output directly. The endpoint needs `winget` (the Microsoft App Installer package) already present to do anything. Beacon runs it as SYSTEM. On a fresh Windows install with no system-wide Visual C++ runtime, winget needs its own runtime package folder on the search path, which agent 0.4.10 and later arrange; older agents fail with exit code `0xc0000135` on such a machine.

## Uninstalling software

The Software section on Device Detail can show an **Uninstall** action next to an installed application. It only appears when the application can be uninstalled silently — either it has a `QuietUninstallString`, or its `UninstallString` runs `msiexec` in a way Beacon can reliably append `/qn /norestart` to. Anything else gets no button at all: uninstall runs in a SYSTEM context with no visible desktop, so an installer that needs someone to click through a wizard would have nowhere to show its prompts and no way to complete.

## Beta support

`winget upgrade` is confirmed on real Windows hardware: a Windows 11 machine upgraded 7-Zip from 22.01 to 26.06 through Beacon (agent 0.4.10), and a Windows 365 Cloud PC upgraded real packages earlier. Software Uninstall is confirmed for MSI-based and quiet-uninstall-capable applications.
