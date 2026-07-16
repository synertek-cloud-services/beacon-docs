---
title: Agent Self-Update & Rollback
category: administration
order: 3
updated: 2026-07-16
tags: [agent, update, self-update, rollback, version]
---

The Beacon agent updates itself automatically. Once enrolled, it checks for new versions every 24 hours and applies updates without any administrator intervention. This article explains the update flow, how to control update behavior, and what happens when an update fails.

## How self-update works

1. **Version check** — on startup, and then every 24 hours (with a random 5-minute stagger to spread load), the agent calls the Worker's `/v1/agent/latest` endpoint to check for a newer version
2. **Download** — if a new version is available, the agent downloads the binary for its platform from the configured release URL
3. **Signature verification** — the downloaded binary is verified against an Ed25519 signature published alongside each release. If verification fails, the update is aborted and the current version continues running
4. **Atomic replacement** — the new binary replaces the current binary using an atomic filesystem rename (or equivalent on Windows). This prevents a partially-written binary from being executed
5. **Restart** — the agent terminates itself cleanly; the service manager (systemd, SCM, launchd) restarts it automatically
6. **Confirmation** — after restart, the agent checks an update state file. If the post-update version matches the expected version, the update is marked `confirmed`. If there's a version mismatch, a rollback is triggered

## Update state machine

The agent maintains an update state in its credential directory:

| State | Meaning |
|---|---|
| `idle` | No update in progress |
| `pending` | Update downloaded and verified, awaiting restart |
| `confirming` | First check-in after update restart |
| `confirmed` | Update applied successfully |
| `rolled_back` | Update failed; previous version restored |

The update state is reported in the check-in payload and visible on the device detail page in the dashboard.

## Rollback behavior

If the agent restarts after an update and the running version does not match the expected updated version, it triggers a rollback:

1. The agent restores the previous binary (kept alongside the current one until the update is confirmed)
2. It writes `rolled_back` to the update state file
3. It reports the rollback in the next check-in
4. An alert is raised in the dashboard: **Agent update rollback on [device]**

The previous binary is kept for 48 hours after a confirmed update, then deleted.

## Controlling update behavior

### Pause updates for a device

Updates can be paused for a specific device from **Devices → [device] → Settings → Pause Updates**. The device will not apply updates while paused but will still report its current version.

### Pin to a specific version

Version pinning is not yet available in the dashboard UI. For now, preventing updates can be achieved by blocking the agent's access to the version check endpoint at the firewall level, or by setting the Worker's `AGENT_UPDATE_CHANNEL` variable to `stable-pinned`.

### Check update status across the fleet

**Dashboard → Devices**, then filter by **Agent Version** to see which devices are running older versions. Devices in `rolled_back` state will be flagged with an alert.

## Note on suspended/sleeping devices

Go's internal timers do not advance while a machine is suspended. If a laptop or desktop goes through a long sleep cycle (e.g., powered off overnight), the 24-hour update timer may not fire until the next restart. To force an immediate update check:

```bash
# Linux
sudo systemctl restart beacon-agent

# Windows (PowerShell)
Restart-Service BeaconAgent

# macOS
sudo launchctl stop com.beacon.agent && sudo launchctl start com.beacon.agent
```
