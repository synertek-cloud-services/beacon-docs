---
title: "Web Remote: Sessions and Displays"
category: remote-access
order: 5
updated: 2026-11-26
tags: [web-remote, multi-monitor, rds, avd]
---

Two Web Remote features deal with which screen you're actually looking at: switching between a device's multiple monitors, and — on server-class Windows hosts — picking which of several active sessions to connect to at all.

## Multiple monitors

If the target device reports more than one monitor, a **Displays** dropdown appears in the Web Remote toolbar. Switching monitors happens in place on your existing connection — there's no reconnect and no new session, just a resize to the newly selected screen.

## Targeting a specific session (RDS / AVD)

A workstation or laptop normally has one active desktop session, so Web Remote connects to it directly with no question asked. That includes Windows 365 Cloud PCs, which Beacon classifies as workstations. A **server-class** device, such as Windows Server or a Remote Desktop Services host, can have several people signed in at once, so Web Remote asks first. (A device's class is detected by the agent and can be overridden per device, so a multi-session host classified as a workstation can be switched to server to get the picker. See [Device class](/kb/resources/glossary/#device-class).)

The **Choose Session** dialog lists:

- **Each signed-in session**, labelled with its user and session number, and marked "(Disconnected)" if the user has closed their RDP window without signing out. A signed-in session is preselected.
- **The console.** If someone is signed in at the console it shows their name. If nobody is, it appears as **Console (sign-in screen)**, which connects to the machine's own screen, the Windows sign-in or lock screen. Picking it connects to the console even when an RDP session is active; it does not fall back to the RDP session.

If the device has no signed-in session at all, there is nothing to choose and Web Remote connects straight to the console's sign-in screen. Showing the signed-out console in this list needs agent 0.4.6 or later; older agents list only signed-in sessions.

## Connecting when nobody is signed in

If a Windows device is sitting at its sign-in screen with no user logged in, Web Remote can still connect: it falls back to running under the agent's own SYSTEM identity so you can see and interact with the login screen itself — useful for troubleshooting a machine that isn't reaching a working desktop. No [end-user consent](/kb/remote-access/web-remote-consent/) prompt applies in this case, since there's no one present to ask.

Use the **Ctrl+Alt+Delete** item in the Keyboard menu to get past a "Press Ctrl+Alt+Delete" screen. See [Web Remote](/kb/remote-access/web-remote/#ctrlaltdelete).

## RDP sessions that are minimized or disconnected

A session reached over RDP is only drawn while its RDP client window is visible. If the user minimizes it or closes it without signing out, Web Remote shows a "screen isn't available" notice until they bring it back. See [If the screen is blank or unavailable](/kb/remote-access/web-remote/#if-the-screen-is-blank-or-unavailable).

## Beta support

Multi-monitor in-place switching is confirmed on real hardware. The nobody-signed-in sign-in-screen connection, the session picker, and choosing the console while an RDP session is active are confirmed on Windows Server 2022. Multi-session AVD hosts have not been exercised.

See [Web Remote](/kb/remote-access/web-remote/) for the rest of the feature.
