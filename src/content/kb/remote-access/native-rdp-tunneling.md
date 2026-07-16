---
title: Native RDP Tunneling
category: remote-access
order: 3
updated: 2026-07-16
tags: [rdp, tunnel, remote-desktop, windows, tcp]
---

Beacon's Tier 3 remote access tunnels a raw TCP/RDP connection through the Cloudflare Durable Object relay, letting you use the standard Windows Remote Desktop client (mstsc.exe or the Microsoft Remote Desktop app) without VPN, port forwarding, or any additional software beyond what Windows ships with.

For an overview of all remote access tiers, see [Connecting via RustDesk](/kb/remote-access/connecting-via-rustdesk/).

## How the RDP tunnel works

When you start an RDP tunnel session, the Beacon dashboard opens a WebSocket to the SessionRelay Durable Object. The agent on the target device also connects to the relay — both sides are outbound connections. The relay bridges the two WebSocket connections and forwards raw TCP bytes in both directions.

On the technician's side, Beacon exposes a local TCP listener (on a randomly assigned localhost port). Your RDP client connects to `localhost:[port]`, which the relay infrastructure forwards to port 3389 on the managed device. The device only ever sees an outbound WebSocket connection going out; it never receives an inbound connection.

## Prerequisites on the target device

RDP must be enabled on the Windows endpoint before tunneling will work:

```powershell
# Enable Remote Desktop
Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" `
  -Name "fDenyTSConnections" -Value 0

# Allow RDP through Windows Firewall
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

Or through the GUI: **System Properties → Remote → Allow remote connections to this computer**

The target device must be:
- Running Windows with Remote Desktop Services enabled
- Enrolled in Beacon with the agent online
- Reachable by the Beacon Worker (normal check-ins are sufficient)

RDP tunneling does not work on Linux or macOS endpoints — RDP is a Windows-only protocol.

## Starting an RDP tunnel session

1. Open **Devices → [Windows device] → Remote Access**
2. Click **Connect via RDP**
3. The dashboard initiates a `tcp_tunnel` session and displays a **localhost port** (e.g., `localhost:53421`)
4. Open your RDP client:
   - **mstsc.exe**: in the "Computer" field, enter `localhost:53421`
   - **Microsoft Remote Desktop app**: add a new PC with address `localhost:53421`
5. Connect and authenticate with Windows credentials on the target device

Keep the Beacon dashboard tab open for the duration of the session. Closing the tab terminates the relay tunnel.

## Multiple monitors

Standard RDP multi-monitor configuration works through the tunnel — pass `/multimon` to mstsc.exe or enable it in the Microsoft Remote Desktop app settings.

## Drive and clipboard redirection

RDP drive redirection (mapping local drives to the remote session) works through the tunnel. Enable it in your RDP client settings before connecting:
- **mstsc.exe**: Options → Local Resources → More → Drives → check the drives to share

Clipboard integration also works without additional configuration.

## Disconnecting

To end the session, disconnect from the RDP session normally (Start → Disconnect) or close your RDP client. Then close the tunnel in the Beacon dashboard — the relay WebSocket and the local port listener are released.

See also: [Connecting via RustDesk](/kb/remote-access/connecting-via-rustdesk/), [RustDesk Native Client Setup](/kb/remote-access/rustdesk-native-client/)
