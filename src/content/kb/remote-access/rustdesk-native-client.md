---
title: RustDesk Native Client Setup
category: remote-access
order: 2
updated: 2026-07-16
tags: [rustdesk, remote-desktop, native-client, installation]
---

Beacon's Tier 2 remote access (full graphical remote desktop) uses RustDesk as the client-side application. This article covers installing and configuring the RustDesk native client on both technician workstations and managed endpoints.

For an overview of all three remote access tiers and how the relay works, see [Connecting via RustDesk](/kb/remote-access/connecting-via-rustdesk/).

## Installing RustDesk on technician machines

Download the RustDesk client for your platform from [rustdesk.com/download](https://rustdesk.com/download) or the [GitHub releases page](https://github.com/rustdesk/rustdesk/releases).

| Platform | Installer |
|---|---|
| Windows | `rustdesk-windows-x86_64.exe` |
| macOS (Intel) | `rustdesk-macos-x86_64.dmg` |
| macOS (Apple Silicon) | `rustdesk-macos-aarch64.dmg` |
| Linux (Debian/Ubuntu) | `rustdesk-linux-x86_64.deb` |
| Linux (RPM) | `rustdesk-linux-x86_64.rpm` |

No special configuration is needed on the technician's RustDesk client — Beacon passes the relay server details at connection time via a one-time connection credential.

## Deploying RustDesk to managed endpoints

RustDesk must be installed on managed endpoints before Tier 2 sessions can be initiated. Use a Beacon [Job](/kb/using-beacon/scripting/) to deploy it:

### Windows — PowerShell deployment component

```powershell
$version = "1.3.9"  # Pin to a tested version; update periodically
$url = "https://github.com/rustdesk/rustdesk/releases/download/$version/rustdesk-$version-x86_64.exe"
$installer = "$env:TEMP\rustdesk-install.exe"

Invoke-WebRequest -Uri $url -OutFile $installer -UseBasicParsing
Start-Process $installer -ArgumentList "--silent-install" -Wait
Remove-Item $installer

Write-Output "RustDesk $version installed"
```

### Linux — bash deployment component

```bash
VERSION="1.3.9"
ARCH="x86_64"
URL="https://github.com/rustdesk/rustdesk/releases/download/${VERSION}/rustdesk-${VERSION}-${ARCH}.deb"
DEB="/tmp/rustdesk.deb"

curl -sL "$URL" -o "$DEB"
dpkg -i "$DEB" && rm "$DEB"
systemctl enable --now rustdesk
echo "RustDesk ${VERSION} installed"
```

Create these as Components in the Components library, then run them as a Job targeting all devices (or a specific company) during a maintenance window.

## Verifying RustDesk is running on endpoints

After deployment, check the RustDesk service status:

```powershell
# Windows
Get-Service RustDesk | Select-Object Name, Status
```

```bash
# Linux
systemctl status rustdesk
```

A device ready for Tier 2 sessions will show RustDesk as **Running** in the system services.

## Pinning RustDesk versions

Beacon does not manage RustDesk versions directly. To maintain a consistent version across your fleet:

1. Create a Component that checks the installed RustDesk version and outputs the version string
2. Run it as a quick Job across all devices
3. Compare results in the job output to identify devices running older versions
4. Deploy the updated installer to outdated devices

See also: [Connecting via RustDesk](/kb/remote-access/connecting-via-rustdesk/), [Native RDP Tunneling](/kb/remote-access/native-rdp-tunneling/)
