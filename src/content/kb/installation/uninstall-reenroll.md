---
title: Uninstall & Re-enroll
category: installation
order: 3
updated: 2026-07-16
tags: [uninstall, re-enroll, migration, credential]
---

Sometimes you need to remove the Beacon agent from a device — hardware reuse, tenant migration, or a clean re-enrollment to pick up a new credential. This article covers removing the agent cleanly and re-enrolling a device under a new or existing tenant.

## Uninstalling the agent

Uninstalling involves stopping the service, removing the binary, and optionally deleting the credential files.

### Windows

```powershell
# Stop and remove the service
sc.exe stop BeaconAgent
sc.exe delete BeaconAgent

# Remove the binary
Remove-Item "C:\Program Files\Beacon\beacon-agent.exe" -Force

# Remove credential data (leave this if re-enrolling same device/tenant)
Remove-Item "$env:PROGRAMDATA\Beacon" -Recurse -Force
```

### Linux (systemd)

```bash
sudo systemctl stop beacon-agent
sudo systemctl disable beacon-agent
sudo rm /etc/systemd/system/beacon-agent.service
sudo systemctl daemon-reload
sudo rm /usr/local/bin/beacon-agent

# Remove credential data
sudo rm -rf /etc/beacon/
```

### macOS (launchd)

```bash
sudo launchctl unload /Library/LaunchDaemons/com.beacon.agent.plist
sudo rm /Library/LaunchDaemons/com.beacon.agent.plist
sudo rm /usr/local/bin/beacon-agent

# Remove credential data
sudo rm -rf /etc/beacon/
```

## Credential data location

The agent stores its per-device credential (and `agent.log`) in a platform-specific directory:

| Platform | Path |
|---|---|
| Windows | `%PROGRAMDATA%\Beacon\` |
| Linux | `/etc/beacon/` |
| macOS | `/etc/beacon/` |

**Deleting the credential directory removes the device's identity** — re-running the agent will perform a fresh enrollment (consuming a new enrollment token slot). If you want the device to appear in the dashboard as the same device, do not delete the credential directory.

## Re-enrolling an existing device

If you need to re-enroll without changing the device's identity (e.g., after updating the Worker URL), you can overwrite the credential by running the enrollment command again with `--re-enroll`:

```bash
./beacon-agent --worker-url https://new-worker.example.com \
               --enroll-token ent_newtokenhere \
               --re-enroll
```

This replaces the stored credential and Worker URL without deleting device history in the dashboard.

## Migrating a device to a different tenant

To move a device from one company to another:

1. Uninstall the agent and delete the credential directory (steps above)
2. Get an enrollment token for the destination tenant from **Dashboard → Companies → [new company] → Enrollment Token**
3. Re-install and enroll with the new token

The device will appear as a new device in the destination tenant. The old device record in the source tenant will go offline — you can archive or delete it from **Dashboard → Devices → [device] → Archive**.

## Removing a device from the dashboard only

If the agent has already been uninstalled (or the hardware is gone) but the device record still appears in the dashboard, you can clean it up without touching the endpoint:

1. **Dashboard → Devices → [device name]**
2. Click **Archive** (removes from active view but preserves history) or **Delete** (permanent)

Archived devices do not count against any device limits and do not generate offline alerts.
