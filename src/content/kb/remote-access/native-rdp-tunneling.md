---
title: RDP and Direct TCP Access
category: remote-access
order: 7
updated: 2026-08-26
tags: [rdp, limitations]
---

Beacon does not expose an RDP tunnel or a generic TCP-tunneling button in the dashboard. It does not open a local listener for `mstsc`, relay port 3389, or manage Windows Remote Desktop configuration.

For interactive, graphical control of a Windows endpoint through Beacon, use [Web Remote](/kb/remote-access/web-remote/) — it covers the same underlying need (see and control a remote screen) without RDP.

If you specifically need native RDP or another TCP-based protocol against a managed endpoint, provision it separately through your organization's approved VPN, bastion, or access-control design.
