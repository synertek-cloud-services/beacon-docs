---
title: Bulk Deployment
category: installation
order: 2
updated: 2026-07-16
tags: [deployment, bulk, scripting, gpo, intune, ansible]
---

For deploying the Beacon agent to more than a handful of devices, manual installation doesn't scale. This article covers common automated deployment methods: PowerShell/Group Policy for Windows fleets, Ansible for Linux/macOS, and Intune for Microsoft-managed environments.

## Before you begin

All bulk deployment methods need the same two values that manual enrollment requires:

- **Worker URL** — your Beacon Worker endpoint (e.g. `https://rmm-api.cloud.synertekcs.com`)
- **Enrollment token** — a per-tenant token from **Dashboard → Companies → [company] → Enrollment Token**

Generate a separate enrollment token for each company (tenant) you're deploying to. Tokens are single-use-per-device by default — one token can enroll many devices, but each device only uses it once.

## Windows — PowerShell deploy script

The following script downloads the agent, performs enrollment, and installs it as a Windows service. Run it as SYSTEM or a local Administrator:

```powershell
param(
  [string]$WorkerUrl  = "https://rmm-api.cloud.synertekcs.com",
  [string]$EnrollToken
)

$InstallDir = "C:\Program Files\Beacon"
$BinaryUrl  = "https://github.com/synertek-cloud-services/beacon/releases/latest/download/beacon-agent-windows-amd64.exe"
$Binary     = "$InstallDir\beacon-agent.exe"

New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
Invoke-WebRequest -Uri $BinaryUrl -OutFile $Binary -UseBasicParsing

# Enroll (writes credential to %PROGRAMDATA%\Beacon\)
& $Binary --worker-url $WorkerUrl --enroll-token $EnrollToken --enroll-only

# Install and start service
sc.exe create BeaconAgent binPath= "`"$Binary`"" start= auto DisplayName= "Beacon RMM Agent"
sc.exe start BeaconAgent
```

Deploy this with Group Policy (Computer Configuration → Scripts → Startup), SCCM, or any other software distribution system.

## Windows — Group Policy (GPO)

1. Upload `beacon-agent-windows-amd64.exe` and the deploy script to a network share accessible to target machines
2. In Group Policy Management, create a new GPO and link it to the target OU
3. Under **Computer Configuration → Policies → Windows Settings → Scripts → Startup**, add the PowerShell script
4. Pass `-WorkerUrl` and `-EnrollToken` as script parameters

Devices will enroll on their next Group Policy refresh or restart.

## Linux — Ansible

```yaml
- name: Deploy Beacon Agent
  hosts: all
  become: true
  vars:
    worker_url: "https://rmm-api.cloud.synertekcs.com"
    enroll_token: "ent_abc123xyz"
    agent_version: "latest"

  tasks:
    - name: Download beacon agent
      get_url:
        url: "https://github.com/synertek-cloud-services/beacon/releases/latest/download/beacon-agent-linux-amd64"
        dest: /usr/local/bin/beacon-agent
        mode: '0755'

    - name: Enroll agent
      command: /usr/local/bin/beacon-agent --worker-url {{ worker_url }} --enroll-token {{ enroll_token }} --enroll-only
      args:
        creates: /etc/beacon/credential.json

    - name: Install systemd service
      copy:
        dest: /etc/systemd/system/beacon-agent.service
        content: |
          [Unit]
          Description=Beacon RMM Agent
          After=network-online.target
          [Service]
          ExecStart=/usr/local/bin/beacon-agent
          Restart=always
          RestartSec=10
          [Install]
          WantedBy=multi-user.target

    - name: Enable and start beacon-agent
      systemd:
        name: beacon-agent
        enabled: true
        state: started
        daemon_reload: true
```

The `creates:` guard on the enroll task prevents re-enrollment if the playbook is re-run on an already-enrolled device.

## Microsoft Intune (Windows)

1. Package the install script as a Win32 app (`.intunewin` format using the [Win32 Content Prep Tool](https://github.com/microsoft/Microsoft-Win32-Content-Prep-Tool))
2. In the Intune admin center, add a new Win32 app:
   - **Install command:** `powershell.exe -ExecutionPolicy Bypass -File deploy-beacon.ps1 -WorkerUrl "https://..." -EnrollToken "ent_..."`
   - **Detection rule:** File exists at `C:\Program Files\Beacon\beacon-agent.exe`
3. Assign to the target device group

## Verifying bulk enrollment

After deployment, check **Dashboard → Devices** — enrolled devices appear as they complete their first check-in. Filter by "Company" to confirm devices landed in the correct tenant.

Devices that enrolled with an incorrect token or the wrong Worker URL will not appear. Check the agent log on a sample device (`Get-Content "$env:PROGRAMDATA\Beacon\agent.log"`) for enrollment error details.

See also: [Agent Installation](/kb/installation/agent-installation/), [Uninstall & Re-enroll](/kb/installation/uninstall-reenroll/)
