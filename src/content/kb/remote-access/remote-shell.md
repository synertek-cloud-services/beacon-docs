---
title: Use Remote Shell
category: remote-access
order: 1
updated: 2026-08-26
tags: [remote-shell, sessions, beta]
---

Beacon Remote Shell opens an interactive shell through the session relay. The technician's browser and the endpoint agent both make outbound WebSocket connections to a session-specific Durable Object, so the endpoint does not need an inbound management port.

Remote Shell is text-only. For graphical, mouse-and-keyboard control of a Windows desktop, use [Web Remote](/kb/remote-access/web-remote/) instead.

## Start a session

Open a device that is online and approved, then choose **Remote Shell**. Keep the browser tab open while using the session. The agent receives the session command at its next check-in, so initial connection can take up to a minute.

Beacon runs the shell with the agent's service identity. Treat it as a privileged administrative session and use the same change controls you apply to direct command execution.

## Beta support

Linux Remote Shell is confirmed supported on real hardware. Windows Remote Shell is unvalidated. macOS is unvalidated. A connection that remains at **Connecting…** beyond a check-in interval should be investigated with the agent log and browser console/network details.

## Session hygiene

Close the session from the dashboard when work is complete. Record material changes through your normal ticketing/change process, and do not expose session URLs or browser logs without removing their embedded session tokens.

See [Troubleshooting](/kb/troubleshooting/best-practices/) for connection diagnostics.
