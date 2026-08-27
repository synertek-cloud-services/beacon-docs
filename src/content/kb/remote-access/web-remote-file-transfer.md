---
title: "Web Remote: File Transfer and Clipboard"
category: remote-access
order: 6
updated: 2026-08-26
tags: [web-remote, file-transfer, clipboard]
---

The Web Remote toolbar can also move data between your machine and the remote session, beyond just seeing and controlling its screen: files in either direction, and pasted text one way.

## File transfer

The Web Remote toolbar can move files in both directions between your machine and the remote session:

- **Upload** sends a file straight to the signed-in user's Desktop on the remote machine. There's no destination picker — it always lands on the Desktop.
- **Download** opens a remote directory browser (pick a drive, then descend into folders) so you can locate and pull a file back to your own machine.

## Clipboard paste

The **Paste** toolbar button takes the text currently on your local clipboard and types it into the remote session as keystrokes — it does not write to the remote machine's actual clipboard. This means it works reliably regardless of what's on the remote clipboard, but it's text-only: images, files, and other non-text clipboard content can't be pasted this way. Newlines in the pasted text are preserved.

There is no remote-to-local direction: content copied on the remote machine does not sync back to your local clipboard.

## Beta support

File transfer has not yet been confirmed on real hardware (cross-compile-verified only). Clipboard paste is part of the core Web Remote path confirmed on real hardware.

See [Web Remote](/kb/remote-access/web-remote/) for the rest of the feature.
