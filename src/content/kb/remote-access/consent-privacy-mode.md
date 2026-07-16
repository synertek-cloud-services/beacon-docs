---
title: Consent & Privacy Mode
category: remote-access
order: 4
updated: 2026-07-16
tags: [consent, privacy, remote-access, compliance]
---

Beacon's remote access system currently operates in **silent mode** — the Beacon agent accepts `open_session` commands from authenticated technicians without prompting the person at the managed device. This matches the default behavior of most commercial RMM platforms and is appropriate for unattended devices (servers, kiosks, lab machines).

## Current behavior

When a technician initiates any remote session (shell, RustDesk, or RDP tunnel):

1. The dashboard creates a session record with the technician's user ID
2. The Worker queues an `open_session` command for the target agent
3. On the next check-in, the agent opens the relay connection without notifying the local user

There is no end-user consent prompt, no session indicator in the system tray, and no mechanism for the local user to deny or terminate a session from their side. Technician authentication and role enforcement in the Beacon Worker is the sole access control layer.

## Planned consent features

A consent and privacy mode is on the Beacon roadmap. The planned implementation includes:

- **Consent prompt** — before a session opens, a dialog appears on the managed device asking the local user to approve or deny the connection
- **Session notification** — a system tray indicator while a remote session is active, showing the technician's name and session type
- **Privacy mode** — allow the local user to temporarily block all remote sessions (for use cases where the endpoint is in a sensitive environment)
- **Session recording opt-in** — explicit notice to the local user that the session may be recorded

These features are targeted for a future release. Track progress on the [GitHub Issues page](https://github.com/synertek-cloud-services/beacon/issues).

## Compliance considerations

For environments where consent or session transparency is a regulatory requirement:

- Document your remote access policy and ensure managed device users are notified through employment agreements or acceptable-use policies
- Use Beacon's role-based access control to limit who can initiate remote sessions ([User Roles & Permissions](/kb/administration/user-roles-permissions/))
- Review active and recent sessions through the Worker's D1 `sessions` table (dashboard session history UI is also planned)
- Consider using [RDP tunneling](/kb/remote-access/native-rdp-tunneling/) with Windows-built-in consent prompts (Windows can be configured to require the local user to approve RDP connections via Session Host settings)

See also: [Connecting via RustDesk](/kb/remote-access/connecting-via-rustdesk/), [User Roles & Permissions](/kb/administration/user-roles-permissions/)
