---
title: Web Remote
category: remote-access
order: 2
updated: 2026-09-02
tags: [web-remote, remote-desktop, screen-share]
---

Web Remote is Beacon's zero-install, browser-based remote-desktop viewer. It opens in a new browser tab and gives a technician mouse, keyboard, and screen access to a Windows endpoint with nothing to install on either side beyond the Beacon agent already running there.

Under the hood, Web Remote runs its own screen-capture/input-injection helper process on the endpoint and reuses the same outbound session-relay architecture as Remote Shell (`session_type: screen_share`) — the endpoint makes an outbound connection to the relay, so no inbound port is ever opened.

## Start a session

Open a device that is online and approved, then choose **Web Remote**. The session opens in a new tab. Initial connection can take up to a minute, since the agent only picks up the session request at its next check-in (sooner if [Fast Poll](/kb/getting-started/architecture-overview/#fast-poll) is already active). If you know ahead of time that you're about to open a session — for example, you're still on the phone with the client — click the **Fast Poll** button on the device's page first, so the device is already checking in every 15 seconds by the time you connect.

Web Remote can connect to:

- An already-signed-in user's desktop.
- A machine sitting at its Windows sign-in screen with nobody signed in yet (see [Sessions and displays](/kb/remote-access/web-remote-sessions-and-displays/)).

If the target company or device requires it, the person at the machine is shown an Accept/Decline prompt before the session connects — see [Web Remote consent](/kb/remote-access/web-remote-consent/).

## Toolbar

- **Keyboard** — a dropdown of key combinations that don't reach a remote session normally, including Ctrl+Shift+Esc (Task Manager), Alt+Tab, Alt+F4, and Windows-key combos.
- **Paste** — types your local clipboard's text into the remote session. See [File transfer and clipboard](/kb/remote-access/web-remote-file-transfer/).
- **Fullscreen** — scales the remote screen to fit your browser window.
- **Elevate** — escalates the session to SYSTEM so you can see and interact with UAC prompts. See [Elevate](/kb/remote-access/web-remote-elevate/).
- **Disconnect** — ends the session. It does not power off or restart the remote machine.

## Scope and limits

Web Remote is Windows-only. It does not currently support:

- Syncing the remote clipboard back to your local one (copy is one-way: local → remote only).
- Non-Windows targets (Linux, macOS).
- Full non-US keyboard layout, dead-key, or IME input — the key-injection path covers standard US-layout typing and the shortcut dropdown above.

## Beta support

Core Web Remote (connect, control, disconnect) and multi-monitor switching are confirmed on real Windows hardware. Elevate is confirmed for an administrator console user; a standard (non-administrator) console user and file transfer are cross-compile-verified only, not yet exercised on real hardware. See [Troubleshooting](/kb/troubleshooting/best-practices/) if a session won't connect.
