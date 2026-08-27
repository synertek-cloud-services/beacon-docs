---
title: Web Remote Consent
category: remote-access
order: 3
updated: 2026-08-26
tags: [web-remote, privacy, consent]
---

Beacon can require the person sitting at a device to explicitly allow a Web Remote session before it connects. This is off by default for existing and new companies — an admin opts a company in, and it can be overridden per device.

## Configuring it

- **Company default** — on a Company's settings, check **Require end-user consent for Web Remote**. This applies to every device in that company unless overridden.
- **Per-device override** — on a device's detail page, the **Web Remote Consent** setting is a three-way choice: **Inherit** (use the company default), **Require**, or **Don't Require**.

Consent only applies to Web Remote (`screen_share`) sessions. Remote Shell is not covered — it's a different risk and visibility profile, already governed by dashboard role-based access and the Activity Log.

## What the end user sees

When consent is required, a Yes/No prompt appears on the target machine as soon as the technician starts the session, asking whether to allow remote access. It does not name the requesting technician. If there's no response within 30 seconds, it's treated as declined.

## What the technician sees

The Web Remote tab shows its normal "Connecting…" state while waiting on the response. If the user declines, the tab shows **"The user declined remote access."** If nobody responds in time, it shows **"No response — the remote-access prompt timed out."** Elevate re-triggers the same prompt, since elevating opens a new, independent session in the background.

## What consent does not cover

- **Nobody signed in** — if a device is sitting at its Windows sign-in screen with no one logged in, Web Remote can still connect without a prompt. There's no one present to ask, and nothing on-screen to protect.
- **Remembering a choice** — every session re-prompts. There is no "don't ask again for this technician/device" option.

See [Web Remote](/kb/remote-access/web-remote/) for the rest of the feature.
