---
title: Troubleshooting and Diagnostics
category: troubleshooting
order: 1
updated: 2026-11-26
tags: [troubleshooting, agent-log, beta]
---

Start with the affected endpoint’s agent log and the dashboard’s command history. Do not paste tokens, device credentials, session URLs, company data, or secret values into issues or shared diagnostics.

## Where to look

| Signal | Location |
| --- | --- |
| Agent log | `%PROGRAMDATA%\Beacon\agent.log` (Windows); `/etc/beacon/agent.log` (Linux) |
| Update state | `update-state.json` beside the agent log, only during/after an update |
| Job/direct command output | Job Detail, or Device Command History for direct commands |
| Activity record | **Global → Activity Log** |
| Dashboard failure | Browser DevTools Console and Network |
| Worker failure | Cloudflare Worker live logs (`wrangler tail`) while reproducing |

## Common checks

**Endpoint never appears:** confirm `BeaconAgent` / `beacon-agent` is running, inspect `agent.log`, verify the Worker origin is reachable, and make sure the enrollment token is valid. A device can remain pending until a technician approves it when Company auto-approval is off.

**Job is queued or sent:** the target may not have checked in yet. Allow one check-in (about a minute, or a few minutes for an instant-push device that is idle), confirm Last Seen, then inspect the Job’s stdout/stderr. A component requiring admin returns a clear 403 to non-admin users.

**Remote Shell stays connecting:** a device with the **Instant push** badge should attach within seconds; one that shows **Polling** waits for its next check-in. If it stays at Connecting beyond that, inspect the agent log for session attachment and collect sanitized browser network information. Linux and Windows are confirmed Remote Shell platforms.

**Web Remote shows a blank screen, a "screen isn't available" notice, or ignores input:** see [If the screen is blank or unavailable](/kb/remote-access/web-remote/#if-the-screen-is-blank-or-unavailable). The most common cause is a minimized or disconnected RDP window.

**Web Remote's screen is zoomed in or clicks land in the wrong place:** update the agent to 0.4.5 or later; older agents mis-measured screens with display scaling above 100%.

**Patch work is failing:** patch management is Windows-only. A Windows Update scan can legitimately take 10–90 seconds or longer; an install has a 15-minute timeout and known download/install edge cases. Check whether matching was based on update classification, not severity. See [Patch Management](/kb/using-beacon/patch-management/) for the full approval/install pipeline.

**The restart prompt seems unresponsive:** on agent versions before 0.3.0, a rare permission issue could leave a device's restart prompt stuck answering nothing no matter how many times Yes/No was clicked, sometimes surviving a manual reboot. Update the agent to 0.3.0 or later — the prompt now runs over a live connection with no file permission involved at all, so this can't recur.

For full symptom guidance and what to include in a report, see [Beta support and diagnostics](https://github.com/synertek-cloud-services/beacon/blob/main/docs/BETA_SUPPORT.md).
