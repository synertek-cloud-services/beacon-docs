---
title: Installing the Beacon Agent
category: installation
order: 1
updated: 2026-07-16
tags: [installation, agent, windows, linux, macos, service]
---

The Beacon agent is a lightweight Go binary that runs on each managed endpoint. Once installed, it enrolls against your Beacon Worker API, checks in every 60 seconds with device metrics, and accepts commands (remote shell sessions, script jobs, audit requests) dispatched from the dashboard.

## Prerequisites

Before installing the agent you need:

- A running Beacon Worker API (self-hosted or Synertek-managed)
- A **per-tenant enrollment token** — created from **Dashboard → Companies → [company name] → Enrollment Token**
- The Worker's enrollment endpoint URL — by default `https://<your-worker>.workers.dev` or your custom domain (e.g. `https://rmm-api.cloud.synertekcs.com`)

The agent requires no inbound firewall rules. All communication is outbound HTTPS from the endpoint to the Cloudflare Worker.

## Download the agent binary

### Option A — Download a pre-built release

Go to the [Beacon releases page](https://github.com/synertek-cloud-services/beacon/releases) and download the binary for your platform:

| Platform | File |
|---|---|
| Windows x64 | `beacon-agent-windows-amd64.exe` |
| Linux x64 | `beacon-agent-linux-amd64` |
| macOS Apple Silicon | `beacon-agent-darwin-arm64` |

Each release asset is Ed25519-signed. The agent verifies this signature automatically before applying self-updates — you do not need to verify the download manually for first-time installation.

### Option B — Build from source

```bash
# Clone the repository
git clone https://github.com/synertek-cloud-services/beacon.git
cd beacon

# Build for your current platform
make build-agent-linux    # or build-agent-windows / build-agent-darwin

# Output: dist/beacon-agent-linux-amd64
```

Requires Go 1.22 or later.

## First run (enrollment)

The agent enrolls itself on first run using the enrollment token and Worker URL you supply via flags:

```bash
# Linux / macOS
./beacon-agent-linux-amd64 \
  --worker-url https://rmm-api.cloud.synertekcs.com \
  --enroll-token ent_abc123xyz

# Windows (PowerShell)
.\beacon-agent-windows-amd64.exe `
  --worker-url https://rmm-api.cloud.synertekcs.com `
  --enroll-token ent_abc123xyz
```

On first run the agent:
1. Calls `POST /v1/enroll` with the token and basic device metadata
2. Receives a **per-device credential** that it stores in a local credential directory
3. Begins checking in every 60 seconds

If your tenant is configured for **manual device approval**, the device will appear in the dashboard as "Pending" until an administrator approves it. With **auto-approve** enabled, the device goes straight to "Online" on the first successful check-in.

## Installing as a system service

Running the agent as a one-off process is useful for testing, but for production you should install it as a service so it starts at boot and restarts on failure.

### Linux (systemd)

Create `/etc/systemd/system/beacon-agent.service`:

```ini
[Unit]
Description=Beacon RMM Agent
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/beacon-agent
Restart=always
RestartSec=10
StandardOutput=append:/var/log/beacon-agent.log
StandardError=append:/var/log/beacon-agent.log

[Install]
WantedBy=multi-user.target
```

Then enable and start:

```bash
sudo cp beacon-agent-linux-amd64 /usr/local/bin/beacon-agent
sudo chmod +x /usr/local/bin/beacon-agent
sudo systemctl enable --now beacon-agent
```

> **First-run enrollment on Linux:** Run the agent once manually with `--worker-url` and `--enroll-token` before installing the service, so the credential file is written. After enrollment succeeds, install the service — it picks up the saved credential automatically on subsequent starts.

### Windows (service via sc.exe)

```powershell
# Copy the binary to a permanent location
Copy-Item .\beacon-agent-windows-amd64.exe C:\Program Files\Beacon\beacon-agent.exe

# Register as a service
sc.exe create BeaconAgent `
  binPath= '"C:\Program Files\Beacon\beacon-agent.exe"' `
  start= auto `
  DisplayName= "Beacon RMM Agent"

sc.exe start BeaconAgent
```

Run the agent once manually for enrollment before registering the service, same as Linux.

### macOS (launchd)

Create `/Library/LaunchDaemons/com.beacon.agent.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>         <string>com.beacon.agent</string>
  <key>ProgramArguments</key>
  <array><string>/usr/local/bin/beacon-agent</string></array>
  <key>RunAtLoad</key>     <true/>
  <key>KeepAlive</key>     <true/>
  <key>StandardOutPath</key> <string>/var/log/beacon-agent.log</string>
  <key>StandardErrorPath</key> <string>/var/log/beacon-agent.log</string>
</dict>
</plist>
```

```bash
sudo cp beacon-agent-darwin-arm64 /usr/local/bin/beacon-agent
sudo chmod +x /usr/local/bin/beacon-agent
sudo launchctl load /Library/LaunchDaemons/com.beacon.agent.plist
```

## Verifying the installation

After the agent is running, open the Beacon dashboard and navigate to **Devices**. The enrolled endpoint should appear within 60–90 seconds (one check-in cycle plus any network latency).

The device card shows:
- **Status dot** — green (online) once the first check-in is received
- **Agent version** — confirm it matches the binary you installed
- **Last seen** — updates every 60 seconds

## Checking the agent log

The agent writes a persistent log to its credential directory (`agent.log`). This is the first place to look if the device isn't appearing in the dashboard:

```bash
# Linux
journalctl -u beacon-agent -f
# or: tail -f /var/log/beacon-agent.log

# Windows (PowerShell)
Get-Content "$env:PROGRAMDATA\Beacon\agent.log" -Wait

# macOS
tail -f /var/log/beacon-agent.log
```

Common issues surfaced in the log:
- `enrollment failed: 401` — the enrollment token is invalid or expired; generate a new one in the dashboard
- `enrollment failed: 403` — the token belongs to a different tenant; confirm you're using the right token for this company
- `check-in failed: connection refused` — the Worker URL is unreachable from this endpoint

## Self-update behavior

Once enrolled, the agent checks for a new version every 24 hours (with an initial 5-minute stagger after startup). When a new version is available:

1. The agent downloads and verifies the Ed25519 signature of the new binary
2. It replaces itself and restarts
3. A `confirmed` update state is written so the next process start knows the update succeeded

> **Note for WSL2 / laptop users:** Go's internal timer does not advance while the machine is suspended. If a device goes through a long sleep cycle, the self-update check may not fire until the agent process is restarted. Run `systemctl restart beacon-agent` to force an immediate check.

See [Agent Self-Update & Rollback](/kb/administration/agent-self-update/) for the full self-update flow.
