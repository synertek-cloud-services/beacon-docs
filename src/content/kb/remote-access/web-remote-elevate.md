---
title: "Web Remote: Elevate"
category: remote-access
order: 4
updated: 2026-08-26
tags: [web-remote, elevate, uac, system]
---

A normal Web Remote session sees the screen the way the signed-in user sees it — which means a Windows UAC prompt (the "secure desktop") is invisible and unclickable, the same way it would be over most remote-desktop tools. **Elevate** solves this by escalating the session to the same SYSTEM identity the Beacon agent service already runs as, which is the one identity Windows allows to see and interact with the secure desktop.

## Using Elevate

Click **Elevate** on the Web Remote toolbar and confirm in the dialog that appears. The dialog shows whether elevation looks likely to succeed on this device, based on information collected the last time the endpoint reported in.

Elevate opens as a new, independent session in the background and only swaps in once it's confirmed connected — so if elevation fails for any reason, your original session is untouched and still usable. If [consent](/kb/remote-access/web-remote-consent/) is required for this device, the end-user prompt fires again for the elevated session, the same as it did for the original one.

## What you get

Elevate doesn't open any separate window or tool menu — you keep looking at the same desktop you were already on, now with SYSTEM-level access to it. The concrete difference is that you can see and click a UAC secure-desktop prompt: administer normally through the OS's own UI (right-click the Start button or taskbar for Task Manager/Device Manager/Disk Management/etc., as you would sitting at the machine), and when something you do triggers a UAC prompt, it's now visible and clickable instead of freezing the session.

## What Elevate can't do

If the person actually sitting at the machine independently triggers their own UAC prompt — something you didn't initiate — it still can't reliably be seen or clicked from Web Remote. This is a UI-level caution rather than something enforced in the product: the secure-desktop-following capture exists for the elevated session, but it's built around actions the technician takes, not ones the end user takes on their own.

## Beta support

Elevate is confirmed working on real hardware for an administrator console user. A standard (non-administrator) console user is expected to behave identically — elevation depends on the agent's own SYSTEM identity, not the signed-in user's privilege level — but this has not yet been exercised on real hardware.

See [Web Remote](/kb/remote-access/web-remote/) for the rest of the feature.
