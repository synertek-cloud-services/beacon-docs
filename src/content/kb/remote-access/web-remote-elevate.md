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

Once elevated, a second window is already open and waiting: a full elevated PowerShell session with a quick-launch menu of common administrative destinations — Task Manager, Control Panel, Services, Device Manager, Event Viewer, Disk Management, Programs and Features, Network Connections, System Properties, and File Explorer. Pick a number to launch one, or re-open the menu at any time.

You can also now see and click any UAC secure-desktop prompt that appears in the session — including one triggered by something you do inside the elevated window itself.

## What Elevate can't do

If the person actually sitting at the machine independently triggers their own UAC prompt (outside anything you started), that prompt still can't be seen or clicked from Web Remote — secure-desktop visibility only exists for the elevated session itself. The same is true if you manually right-click "Run as Administrator" on something outside the provided elevated window.

## Beta support

Elevate is confirmed working on real hardware for an administrator console user. A standard (non-administrator) console user is expected to behave identically — elevation depends on the agent's own SYSTEM identity, not the signed-in user's privilege level — but this has not yet been exercised on real hardware.

See [Web Remote](/kb/remote-access/web-remote/) for the rest of the feature.
