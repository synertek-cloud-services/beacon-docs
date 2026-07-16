---
title: Connecting via RustDesk
category: remote-access
order: 1
updated: 2026-07-16
tags: [remote-access, rustdesk, rdp, tunnel, session]
---

Beacon provides three tiers of remote access, all built on the same underlying architecture: a **Cloudflare Durable Object relay** that the agent dials out to, eliminating inbound firewall rules entirely. A technician's browser or client application connects to the same relay — the two sides meet in the middle without the endpoint ever accepting an inbound connection.

## How the relay works

When a technician initiates any remote session:

1. The dashboard calls `POST /v1/sessions` to create a session record
2. The Worker queues an `open_session` command for the target device
3. On its next check-in (within ~60 seconds), the agent receives the command, dials the relay WebSocket, and waits
4. The technician's client (browser or native app) connects to the same relay URL
5. The Durable Object forwards bytes between both sides

This architecture means:
- No VPN required
- No inbound port forwarding or firewall holes on the endpoint
- Sessions work from any network — including double-NAT, hotel WiFi, or mobile data

---

## Tier 1 — Browser-based remote shell

The simplest remote access option requires nothing beyond the Beacon dashboard in a browser.

**Open a shell session:**
1. Navigate to a device's detail page (**Devices → [hostname]**)
2. Click the **Remote Shell** button in the top action bar
3. A terminal emulator (xterm.js) opens in a modal window
4. Type "Connecting…" — the shell session activates within 60 seconds once the agent picks up the `open_session` command

The shell spawns a persistent PTY-backed process on the endpoint:
- **Linux/macOS:** uses `$SHELL`, falling back to `/bin/bash` then `/bin/sh`
- **Windows:** uses `powershell.exe`

The session is fully interactive — tab completion, cursor movement, and multi-line commands all work. The terminal resizes dynamically as you resize the modal.

**Limitations of Tier 1:**
- Text only — no GUI, no file transfer, no clipboard integration beyond copy-paste
- One shell session per device at a time (current limitation, multiple sessions work at the relay level)
- Suitable for: log inspection, service restarts, ad-hoc scripting, configuration changes

---

## Tier 2 — RustDesk native client (full remote desktop)

For full graphical remote desktop access, Beacon proxies [RustDesk](https://rustdesk.com) connections through the same Durable Object relay. RustDesk is a free, open-source remote desktop application that runs on Windows, macOS, Linux, iOS, and Android.

### Installing RustDesk on endpoints

The RustDesk client must be installed on managed endpoints for graphical remote desktop to work. You can deploy it via a Beacon [scripted job](/kb/using-beacon/scripting/):

```powershell
# Windows — download and install RustDesk silently
$url = "https://github.com/rustdesk/rustdesk/releases/latest/download/rustdesk-windows-x86_64.exe"
Invoke-WebRequest -Uri $url -OutFile "$env:TEMP\rustdesk.exe"
Start-Process "$env:TEMP\rustdesk.exe" -ArgumentList "--silent-install" -Wait
```

### Connecting via RustDesk

1. Open **Devices → [hostname] → Remote Access** in the dashboard
2. Click **Connect with RustDesk**
3. The dashboard generates a one-time connection credential and displays the RustDesk ID and relay configuration
4. Open your local RustDesk client and enter the device ID
5. The session routes through Beacon's relay — no direct connection to the endpoint is attempted

**When to use Tier 2 over Tier 1:**
- GUI applications need to be operated (browsers, GUI configuration tools, legacy apps)
- File transfer is needed (RustDesk has a built-in file manager)
- Clipboard integration is required
- Extended remote sessions where a full desktop context is more productive

---

## Tier 3 — Native RDP tunneling

For Windows environments where the administrator prefers standard Microsoft Remote Desktop Protocol, Beacon can tunnel a raw TCP/RDP connection through the relay without any additional software beyond the standard Windows RDP client.

Beacon's `tcp_tunnel` session type is a byte-agnostic relay — it forwards raw TCP bytes between the technician and the endpoint. Combined with the agent's outbound dial behavior, this creates an RDP session that works through any NAT or firewall.

### Connecting via RDP tunnel

1. Open **Devices → [hostname] → Remote Access** in the dashboard
2. Click **Connect via RDP**
3. The dashboard initiates a `tcp_tunnel` session and provides a **localhost port** on your machine
4. Open your RDP client and connect to `localhost:[port]`
5. Authenticate with normal Windows credentials on the endpoint

The tunnel remains open as long as your browser tab is open. Closing the tab terminates the relay session.

**When to use Tier 3 over Tier 2:**
- The organization already uses standard Windows RDP tooling (mstsc, Microsoft Remote Desktop app)
- RustDesk is not approved for the client environment
- Familiarity with RDP's specific feature set (drive redirection, printer redirection, multi-monitor) is needed
- Compliance or audit requirements specify RDP as the remote access protocol

**Limitations:**
- Requires RDP to be enabled on the target Windows endpoint (`Enable-PSRemoting` or System Properties → Remote)
- Does not work on Linux/macOS endpoints (RDP is Windows-only)
- The tunnel port on localhost is ephemeral — each session gets a new port

---

## Privacy and consent

All remote sessions are authenticated through Beacon's standard authorization system — a user must hold at least the **Technician** role to initiate a session.

> Beacon does not currently implement an end-user consent prompt (where the person at the endpoint must approve before a session starts). All sessions are silent from the endpoint user's perspective — the agent accepts `open_session` commands based on admin authorization alone.

This behavior matches most commercial RMM platforms' default mode. A consent/notification UI is on the [roadmap](/kb/remote-access/consent-privacy-mode/).

## Session history

Active and recently closed sessions are visible in the Beacon Worker's D1 database (`sessions` table). A session history UI in the dashboard is planned for a future release.

## Troubleshooting

**"Connecting…" spinner never resolves (Tier 1)**
- Confirm the device is online (check its Last Seen timestamp)
- The agent picks up the `open_session` command on its next check-in cycle — wait up to 60 seconds
- Check `agent.log` on the endpoint for any `session` errors
- Verify the Worker's `WORKER_URL` variable matches the actual Worker origin (mismatches cause the agent to dial the wrong relay)

**RustDesk connection drops immediately (Tier 2)**
- Confirm RustDesk is installed and running on the endpoint
- Check that the RustDesk version on the endpoint and client are compatible

**RDP tunnel port unreachable (Tier 3)**
- Confirm RDP is enabled on the Windows endpoint
- Check Windows Firewall: port 3389 must be open to localhost (the tunnel terminates locally)
- The tab must remain open — closing it drops the tunnel
