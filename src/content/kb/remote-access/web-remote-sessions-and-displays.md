---
title: "Web Remote: Sessions and Displays"
category: remote-access
order: 5
updated: 2026-08-26
tags: [web-remote, multi-monitor, rds, avd]
---

Two Web Remote features deal with which screen you're actually looking at: switching between a device's multiple monitors, and — on server-class Windows hosts — picking which of several active sessions to connect to at all.

## Multiple monitors

If the target device reports more than one monitor, a **Displays** dropdown appears in the Web Remote toolbar. Switching monitors happens in place on your existing connection — there's no reconnect and no new session, just a resize to the newly selected screen.

## Targeting a specific session (RDS / AVD)

An ordinary client device only ever has one active desktop session, so Web Remote always connects to it directly. A server-class Windows device that supports multiple concurrent logged-in sessions — Remote Desktop Services, Azure Virtual Desktop, Windows 365 — is different: several people, or several published sessions, can be active on it at once.

On these devices, Web Remote lets you pick which session to connect to, console or a specific named RDS/AVD session, instead of assuming the console. This is also what makes it possible to reach AVD and Windows 365 hosts at all, since those don't have a console session in the traditional sense.

## Connecting when nobody is signed in

If a Windows device is sitting at its sign-in screen with no user logged in, Web Remote can still connect: it falls back to running under the agent's own SYSTEM identity so you can see and interact with the login screen itself — useful for troubleshooting a machine that isn't reaching a working desktop. No [end-user consent](/kb/remote-access/web-remote-consent/) prompt applies in this case, since there's no one present to ask.

## Beta support

Multi-monitor in-place switching is confirmed on real hardware. The nobody-signed-in fallback has not yet been confirmed on real hardware (cross-compile-verified only).

See [Web Remote](/kb/remote-access/web-remote/) for the rest of the feature.
