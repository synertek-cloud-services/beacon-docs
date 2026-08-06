---
title: RDP Tunneling Availability
category: remote-access
order: 3
updated: 2026-08-05
tags: [rdp, limitations, beta]
---

Beacon does not offer RDP or generic TCP tunneling in the current beta. It does not open a local listener for `mstsc`, relay port 3389, or manage Windows Remote Desktop configuration.

Use [Remote Shell](/kb/remote-access/connecting-via-rustdesk/) for Beacon-managed remote operation. If RDP is required, provision it separately through your organization’s approved VPN, bastion, and access-control design.
