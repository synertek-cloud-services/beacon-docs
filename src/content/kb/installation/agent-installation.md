---
title: Installing the Beacon Agent
category: installation
order: 1
updated: 2026-08-05
tags: [installation, agent, windows, linux, beta]
---

Install the agent with its `install` subcommand from an elevated shell. It copies itself to the platform location, creates the service, and starts it. This is the supported beta installation path for Windows and systemd-based Linux.

> macOS installation is unvalidated in this beta. Do not deploy macOS endpoints from this guide.

## Before installing

Create a Company and enrollment token in the dashboard. Use the Worker API origin—not the dashboard origin—for `--server-url`. The agent only needs outbound HTTPS. Create a dedicated token for each deployment campaign and revoke it when deployment ends, because the service configuration retains the enrollment token.

Download a signed release binary from [GitHub Releases](https://github.com/synertek-cloud-services/beacon/releases), or publish and use a host-controlled signed channel as described in the [self-hosting guide](https://github.com/synertek-cloud-services/beacon/blob/main/docs/SELF_HOSTING.md#10-publish-the-host-controlled-agent-channel).

## Windows

Open an elevated PowerShell and run:

```powershell
.\beacon-agent-windows-amd64.exe install `
  --server-url https://beacon-api.example.com `
  --enroll-token TOKEN_FROM_DASHBOARD
```

The installer creates and starts the `BeaconAgent` Windows service. The agent binary is installed under `C:\Program Files\Beacon`; credentials and `agent.log` are stored in `%PROGRAMDATA%\Beacon`.

## Linux (systemd)

Make the downloaded binary executable, then install as root:

```bash
chmod +x ./beacon-agent-linux-amd64
sudo ./beacon-agent-linux-amd64 install \
  --server-url https://beacon-api.example.com \
  --enroll-token TOKEN_FROM_DASHBOARD
```

The installer creates and starts the `beacon-agent` systemd service. It supports systemd-based distributions; other init systems are not supported by the beta installer. Credentials and `agent.log` are stored in `/etc/beacon`.

## Verify enrollment

If the Company requires approval, approve the pending device in the dashboard. A successful device checks in about once per minute. Confirm **Last Seen**, agent version, and **Last Audit** on the device detail page.

Useful endpoint checks:

```bash
sudo systemctl status beacon-agent
sudo tail -f /etc/beacon/agent.log
```

```powershell
Get-Service BeaconAgent
Get-Content "$env:PROGRAMDATA\Beacon\agent.log" -Wait
```

See [Troubleshooting](/kb/troubleshooting/best-practices/) if the endpoint does not appear.
