---
title: Users, Roles, and Authentication
category: administration
order: 2
updated: 2026-08-05
tags: [users, rbac, sso]
---

Beacon has three global roles. Enforcement happens in the Worker API, not just in the dashboard.

| Role | Use |
| --- | --- |
| `readonly` | Observe devices, alerts, and operational history without making changes. |
| `technician` | Perform day-to-day operational actions such as running permitted jobs and handling devices/alerts. |
| `admin` | Manage users, global configuration, policies, components, security-sensitive settings, and all administration. |

Create local users under **Settings → Users**. An admin can configure Microsoft Entra ID SSO under **Settings → SSO**; its client secret is encrypted with `CONFIG_ENCRYPTION_KEY` and becomes unreadable if that key is lost or replaced.

## Emergency access

`ADMIN_SECRET` is a break-glass bootstrap and recovery credential. On a new installation, use **Emergency administrator access** only to create the first normal `admin` user, then sign out and use normal authentication. Keep the secret in approved secure storage—not browser bookmarks, scripts, or deployment logs.

Use separate named accounts, grant the lowest role appropriate to each user, and review the Activity Log when investigating configuration or operational changes.
