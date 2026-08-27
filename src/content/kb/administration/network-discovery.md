---
title: Network Discovery
category: administration
order: 4
updated: 2026-08-26
tags: [discovery, network, snmp, ssh]
---

Network Discovery finds live hosts on a company's network — including ones with no Beacon agent installed — by having one existing Beacon device act as a probe. It's visibility, not management: discovered devices are not enrolled, monitored, or targetable by Jobs or Policies.

## Setting up a scan

On a Company's **Discovery** tab, choose a **probe device** (must already be approved, online-capable, and not a laptop — a laptop is assumed to move between networks, which would make its scan results meaningless), set one or more CIDR ranges to sweep, and set a scan interval (defaults to every 6 hours). Each CIDR range is capped at a `/20` to bound scan time. **Scan Now** triggers an immediate off-cycle scan.

A scan is a ping sweep cross-referenced against the probe device's own ARP table, plus a best-effort reverse DNS lookup — no credentials required for this base layer.

## Credentialed fingerprinting (optional)

Turn on SNMP and/or SSH fingerprinting to get more than an IP/MAC/hostname for a discovered host. Credentials aren't entered on the Discovery tab itself — they come from that company's [Company Variables](/kb/using-beacon/scripting/) under fixed keys:

| Protocol | Variable keys |
|---|---|
| SNMP (v1/v2c) | `CV_SNMP_COMMUNITY` |
| SSH (password auth only) | `CV_SSH_USERNAME`, `CV_SSH_PASSWORD` |

If a protocol is enabled but its Company Variables aren't set, that protocol is silently skipped for the scan rather than failing it. Credentialed fingerprinting only runs against hosts the base sweep already found alive, and only probes ports 22 (SSH) and 161 (SNMP) — nothing else.

## Reviewing results

The **Discovered Devices** table lists IP, MAC, hostname, open ports, whatever fingerprint SNMP/SSH returned, first/last seen, and times seen. A field that a later scan doesn't find data for is left as-is, not blanked out.

- **Dismiss** quiets a device you've recognized (e.g. a printer, a switch) without deleting its history.
- **Delete** removes it entirely; it reappears if a future scan finds it again.

There's no automatic correlation between a discovered device and an already-enrolled Beacon device, and discovery doesn't create any new alert channel — it's a standalone inventory view.

## Out of scope

WinRM, SSH key-based authentication, custom OID or command configuration, ports other than 22/161, and automatic vendor/model parsing of raw SNMP output are not supported.
