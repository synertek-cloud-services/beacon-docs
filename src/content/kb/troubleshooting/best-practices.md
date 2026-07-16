---
title: Troubleshooting Best Practices
category: troubleshooting
order: 1
updated: 2026-07-16
tags: [troubleshooting, debugging, agent-log, diagnostics]
---

When something isn't working in Beacon, a systematic approach saves time. This article outlines the most useful diagnostic steps and the tools available at each layer.

## Start with the agent log

The agent log is the first place to look for any issue involving a specific endpoint. It records every check-in attempt, command dispatch, session open, update attempt, and error.

```bash
# Linux (systemd service)
journalctl -u beacon-agent -f --since "1 hour ago"

# Linux (direct log file)
tail -f /var/log/beacon-agent.log

# Windows (PowerShell)
Get-Content "$env:PROGRAMDATA\Beacon\agent.log" -Wait -Tail 50

# macOS
tail -f /var/log/beacon-agent.log
```

Common log entries and what they mean:

| Log entry | Likely cause |
|---|---|
| `enrollment failed: 401` | Enrollment token is invalid or expired |
| `enrollment failed: 403` | Token belongs to a different tenant |
| `check-in failed: connection refused` | Worker URL is unreachable |
| `check-in failed: 401` | Device credential is corrupted; re-enroll |
| `session open failed: websocket: bad handshake` | SessionRelay Durable Object unavailable |
| `update verification failed` | Downloaded binary failed Ed25519 signature check |

## Device not appearing in dashboard

Work through this checklist in order:

1. **Is the agent running?** Check the service status: `systemctl status beacon-agent` (Linux) or `Get-Service BeaconAgent` (Windows). If stopped, check the log for the exit reason.
2. **Can the agent reach the Worker?** From the endpoint, try: `curl https://<worker-url>/health`. A `200 OK` means the Worker is reachable.
3. **Is the enrollment token valid?** Generate a new token in the dashboard and re-run enrollment with it.
4. **Is auto-approve enabled?** If not, check **Dashboard → Devices → Pending** — the device may be awaiting manual approval.
5. **Firewall blocking outbound HTTPS?** The agent needs port 443 outbound to Cloudflare's IP ranges. Most corporate firewalls allow this by default.

## Agent is online but commands aren't dispatching

Commands are delivered in the check-in response and executed between check-ins. If a job shows Pending for more than 2 minutes:

1. Confirm the device is actively checking in — the Last Seen timestamp should be within the last 90 seconds
2. Check the agent log for any command execution errors
3. Verify the command's target matches the device (check company scope and device ID)
4. For shell sessions: ensure the relay WebSocket in the dashboard is still connected (the tab must remain open)

## Alerts firing unexpectedly

If alerts are firing for conditions that seem fine:

1. Check the **sustained_minutes** setting on the monitor — if set to 0, alerts fire immediately on any threshold breach, including brief spikes
2. For CPU alerts: a spike during a scheduled task (Windows Update, antivirus scan) can trigger a brief threshold breach
3. For disk alerts: ensure the threshold accounts for OS-reserved space (Windows reserves a portion of disk space that doesn't show as free)

## Alert not auto-resolving

If an alert condition has cleared but the alert is still open:

1. Confirm **auto_resolve** is enabled on the monitor (**Policies → [policy] → [monitor] → Edit**)
2. For sampled metrics (CPU, memory, disk): auto-resolve fires on the next check-in after the condition clears
3. For `software` monitors: these never auto-resolve by design — they require manual closure

## Worker errors (HTTP 5xx)

If the dashboard or agent is seeing 5xx responses from the Worker:

1. Check the Cloudflare dashboard for Worker error logs (**Workers & Pages → [worker] → Logs**)
2. Common cause: D1 database errors from a failed migration. Check the migration state in the Worker logs.
3. If the Worker was recently redeployed, a cold start may be causing latency spikes — these typically resolve within a minute

## Useful diagnostic commands

```bash
# Check agent version
beacon-agent --version

# Test connectivity to Worker
curl -s https://<worker-url>/health | jq .

# Show last 20 check-in timestamps (Linux, from journalctl)
journalctl -u beacon-agent | grep "check-in ok" | tail -20

# Windows: list service status and process
Get-Service BeaconAgent
Get-Process beacon-agent -ErrorAction SilentlyContinue
```
