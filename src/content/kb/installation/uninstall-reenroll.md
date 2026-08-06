---
title: Uninstall and Re-enroll
category: installation
order: 3
updated: 2026-08-05
tags: [uninstall, enrollment, migration]
---

Use the agent’s supported uninstall command from an elevated shell. It removes the service, installed files, and local credential data, so a later installation is a fresh enrollment.

## Local uninstall

```powershell
& 'C:\Program Files\Beacon\beacon-agent.exe' uninstall
```

```bash
sudo /usr/local/bin/beacon-agent uninstall
```

On Windows, inspect `C:\Windows\Temp\beacon-uninstall.log` if cleanup fails. On Linux, verify that `beacon-agent` is no longer active with `systemctl status beacon-agent`.

## Remote uninstall

The device page can queue a remote uninstall for an online, checking-in endpoint. The agent handles its own removal after receiving the command. Because dispatch follows the check-in cycle, allow at least one minute before treating the command as stuck.

## Re-enroll under another Company

Uninstall first, then create a new token for the destination Company and run `install` again. A re-enrolled endpoint is a new device record; its old history does not move between Companies. Delete or otherwise retire the old dashboard record only after confirming the new endpoint is healthy.

Do not manually delete only the binary or service. A leftover `credential.json` can cause an unexpected identity reuse; the supported uninstall path removes it.
