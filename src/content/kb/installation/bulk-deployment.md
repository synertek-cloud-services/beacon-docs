---
title: Bulk Deployment
category: installation
order: 2
updated: 2026-08-05
tags: [deployment, windows, linux, security]
---

Use your existing software-deployment system to distribute the signed agent binary and execute its `install` subcommand as an administrator or root. Beacon does not currently ship a dedicated Intune, GPO, or Ansible integration.

## Rollout controls

1. Create a Company-specific enrollment token for the rollout.
2. Test on one endpoint and verify enrollment, approval, check-in, audit, and a harmless Quick Job.
3. Deploy to a small ring before the full target set.
4. Revoke the enrollment token after the campaign. The current service installer retains it in launch configuration.

Do not put a token in a public script, general-purpose repository, console transcript, or long-lived configuration management inventory. Limit who can read the deployment payload.

## Windows command

Run the release binary from an elevated deployment context:

```powershell
beacon-agent-windows-amd64.exe install --server-url https://beacon-api.example.com --enroll-token TOKEN
```

Use the `BeaconAgent` service or the existence of `%PROGRAMDATA%\Beacon\credential.json` as a deployment signal; test it with a pilot first. Do not use old examples that manually create a service or rely on `--enroll-only`—those are not current agent commands.

## Linux command

On systemd hosts, run as root:

```bash
/path/to/beacon-agent-linux-amd64 install --server-url https://beacon-api.example.com --enroll-token TOKEN
```

The agent is installed as `beacon-agent`. Validate with `systemctl status beacon-agent` and `/etc/beacon/agent.log`.

## After deployment

Filter the Devices page by Company, approve devices where needed, and check that Last Seen and Last Audit progress. If a system enrolled under the wrong Company, uninstall it, remove its local identity through the supported uninstall command, and deploy with the correct token.
