---
title: Web Remote
category: remote-access
order: 2
updated: 2026-11-26
tags: [web-remote, remote-desktop, screen-share]
---

Web Remote is Beacon's zero-install, browser-based remote-desktop viewer. It opens in a new browser tab and gives a technician mouse, keyboard, and screen access to a Windows endpoint with nothing to install on either side beyond the Beacon agent already running there.

Under the hood, Web Remote runs its own screen-capture/input-injection helper process on the endpoint and reuses the same outbound session-relay architecture as Remote Shell (`session_type: screen_share`) — the endpoint makes an outbound connection to the relay, so no inbound port is ever opened.

## Start a session

Open a device that is online and approved, then choose **Web Remote**. The session opens in a new tab. A device showing the **Instant push** badge normally connects within a few seconds. A device that is only polling picks up the session request at its next check-in, so the first connection can take up to about a minute. See [Instant push](/kb/getting-started/architecture-overview/#instant-push).

Web Remote can connect to:

- An already-signed-in user's desktop, including an RDP session.
- A machine sitting at its Windows sign-in screen with nobody signed in yet (see [Sessions and displays](/kb/remote-access/web-remote-sessions-and-displays/)).

A server-class device first asks which session you want; a workstation or laptop connects directly. See [Sessions and displays](/kb/remote-access/web-remote-sessions-and-displays/).

If the target company or device requires it, the person at the machine is shown an Accept/Decline prompt before the session connects — see [Web Remote consent](/kb/remote-access/web-remote-consent/).

## Toolbar

- **Keyboard** — a dropdown of key combinations that don't reach a remote session normally: Ctrl+Alt+Delete (see below), Ctrl+Shift+Esc (Task Manager), Alt+Tab, Alt+F4, and Windows-key combos.
- **Paste** — types your local clipboard's text into the remote session. See [File transfer and clipboard](/kb/remote-access/web-remote-file-transfer/).
- **Fullscreen** — makes the viewer fill your screen. Web Remote always scales the whole remote screen to fit the window; it does not change the remote machine's resolution.
- **Elevate** — escalates the session to SYSTEM so you can see and interact with UAC prompts. See [Elevate](/kb/remote-access/web-remote-elevate/).
- **Disconnect** — ends the session. It does not power off or restart the remote machine.

## Ctrl+Alt+Delete

Windows deliberately ignores a Ctrl+Alt+Delete that software types, so a normal keystroke can never wake a sign-in or lock screen. The **Ctrl+Alt+Delete** item in the Keyboard menu instead asks the agent service to raise the sequence through the Windows `SendSAS` API.

- **Console only.** It works on the machine's console session, which is the sign-in and lock screen you reach by choosing the console. It is not supported from inside an RDP session.
- **It sets one Windows policy.** Windows only honors `SendSAS` when the *Software SAS Generation* policy allows services, and that is not set by default. The first time anyone uses the button on a device, the agent sets `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System\SoftwareSASGeneration` to `1` (services). A value that already allows services, including one set by Group Policy, is left alone. Devices where nobody uses the button are never changed.

## If the screen is blank or unavailable

- **"The remote screen isn't available right now."** (agent 0.4.9 and later) A notice appears at the top of the viewer about two to three seconds after capture stops working. The usual cause is an **RDP session whose client window is minimized or disconnected**: Windows stops drawing a session when its RDP client is minimized, and refuses screen capture and mouse and keyboard input for it. Restore the RDP window and the screen comes back on its own within a second or two, with no reconnect. This applies to RDP sessions on physical machines as well as virtual machines and Windows 365. Beacon cannot see or control such a session while Windows is not drawing it.
- **Gray or black on a server or virtual machine that only has a virtual display.** Agents 0.4.3 and later fall back to a different capture method (DXGI Desktop Duplication) when ordinary capture fails, which covers machines whose only display is a Remote Display Adapter. An older agent shows a gray screen. Update the agent.
- **Zoomed in, cropped, or clicks land in the wrong place** on a machine with display scaling above 100%, such as an RDP session from a scaled laptop. Fixed in agent 0.4.5. Update the agent.
- **The screen shows but typing and clicking do nothing in one window.** If that window was started with **Run as administrator**, Windows silently blocks input to it from a normal session. Use [Elevate](/kb/remote-access/web-remote-elevate/), or close the elevated window.

## Scope and limits

Web Remote is Windows-only. It does not currently support:

- Syncing the remote clipboard back to your local one (copy is one-way: local → remote only).
- Non-Windows targets (Linux, macOS).
- Full non-US keyboard layout, dead-key, or IME input — the key-injection path covers standard US-layout typing and the shortcut dropdown above.

## Beta support

Core Web Remote (connect, control, disconnect), multi-monitor switching, the sign-in-screen console connection, Ctrl+Alt+Delete, and RDP sessions are confirmed on real hardware: Windows 11 laptops and VMs and Windows Server 2022, including virtual-display machines. Elevate is confirmed for an administrator console user; a standard (non-administrator) console user, file transfer, and the end-user consent prompt on screen have not yet been exercised on real hardware. See [Troubleshooting](/kb/troubleshooting/best-practices/) if a session won't connect.
