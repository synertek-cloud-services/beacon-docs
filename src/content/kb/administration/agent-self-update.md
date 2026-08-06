---
title: Agent Updates and Rollback
category: administration
order: 3
updated: 2026-08-05
tags: [agent, updates, signing]
---

Beacon agents use a signed update channel. Before replacing the installed binary, an agent verifies the release with the Ed25519 public key it trusts. An operator self-hosting Beacon should publish a host-controlled channel and protect its signing key; an agent cannot safely switch trust to a new key through an update signed only by that new key.

After a successful swap, the service restarts and the agent must check in with the expected version before its confirmation deadline. If it cannot confirm, it rolls back to the prior binary. Check `agent.log` and the sibling `update-state.json` when an update is rejected or fails to confirm.

## Operational guidance

- Publish binaries before registering them in Beacon, and independently verify the hosted asset and signature.
- Test a new version on representative endpoints before broad release.
- Ensure Windows service recovery actions remain intact; self-update depends on them to restart the service.
- A device that does not update may be using a different signing key or may not have checked in. Inspect its log before changing the release configuration.

Do not block update endpoints or use undocumented variables as a substitute for release management. See the [self-hosting release procedure](https://github.com/synertek-cloud-services/beacon/blob/main/docs/SELF_HOSTING.md#10-publish-the-host-controlled-agent-channel).
