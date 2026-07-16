---
title: User Roles & Permissions
category: administration
order: 2
updated: 2026-07-16
tags: [users, roles, permissions, access-control, rbac]
---

Beacon uses a role-based access control (RBAC) model with three built-in roles. Each dashboard user is assigned a role and optionally scoped to one or more companies.

## Built-in roles

| Role | Description |
|---|---|
| **Administrator** | Full access: manage users, companies, policies, and all devices |
| **Technician** | Operate on devices: view alerts, run jobs, open remote sessions, acknowledge alerts |
| **Read-Only** | View devices, alerts, and job history; cannot execute any actions |

### Administrator

Administrators have access to all dashboard features including:
- Creating and managing companies and sites
- Managing user accounts and role assignments
- Creating and editing global and company-scoped policies
- Deploying and running jobs across all devices
- Accessing the API token management panel

> An Administrator account is created during initial Beacon setup. You should create at least one additional administrator account before restricting the initial account — if you lose access to the only admin account, recovery requires direct D1 database access.

### Technician

Technicians are the day-to-day operators. They can:
- View all assigned devices and their health metrics
- Acknowledge and close alerts
- Run Jobs (immediate or scheduled) on assigned devices
- Open remote shell, RustDesk, and RDP tunnel sessions
- View job history and command output

Technicians cannot create or modify policies, add users, or access company/site configuration.

### Read-Only

Read-Only users have visibility into device state and history but cannot take any action:
- View devices and their current metrics
- View active and historical alerts (cannot acknowledge or close)
- View job history and command output (cannot run new jobs)
- Cannot open remote sessions of any kind

Useful for stakeholders who need operational visibility without the ability to make changes.

## Company scoping

By default, Administrator accounts see all companies. Technician and Read-Only accounts are scoped to specific companies:

1. **Settings → Users → [user] → Edit**
2. Under **Company Access**, select "All Companies" or choose specific companies
3. Save

A Technician scoped to "Acme Corp" will only see devices, alerts, and jobs associated with Acme Corp — other tenants are entirely invisible to them.

## Managing users

User management is available to Administrators at **Settings → Users**.

- **Invite user** — sends an email invitation with a one-time setup link
- **Deactivate** — immediately revokes dashboard access without deleting the account or its history
- **Change role** — takes effect on the user's next page load (existing sessions are not immediately invalidated)

## API tokens

Dashboard users can generate personal API tokens for programmatic access at **Settings → API Tokens**. Tokens inherit the user's role and company scope. Administrators can also generate service account tokens with restricted scopes for integrations.

See [Webhooks & API](/kb/integrations/webhooks-api/) for the API reference.
