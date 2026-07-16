---
title: Tenant & Site Setup
category: administration
order: 1
updated: 2026-07-16
tags: [tenants, companies, sites, administration, multi-tenant]
---

Beacon's multi-tenant model organizes managed devices into **Companies** (top-level tenants), each with their own enrollment tokens, policies, alerts, and user assignments. Within a company, **Sites** provide a second tier of grouping — useful for organizations with multiple physical locations or logical segments.

## Companies

A Company in Beacon represents a single managed organization or client. Each company is isolated — devices enrolled under one company are not visible to users scoped to a different company.

### Creating a company

1. In the dashboard, navigate to **Companies**
2. Click **New Company**
3. Enter the company name and an optional description
4. Click **Create**

The company is created with no devices and no policies. You can immediately generate an enrollment token and start deploying agents.

### Enrollment tokens

Each company has one or more enrollment tokens. An enrollment token authorizes an agent to enroll under that company — it does not authorize any other access.

To generate a token: **Companies → [company] → Enrollment Tokens → Generate Token**

Tokens can be configured with:
- **TTL** — expiration time (default: 30 days)
- **Auto-approve** — whether enrolled devices are immediately active (default: on)
- **Max uses** — limit how many devices can use this token (optional)

Once a device enrolls, its token slot is consumed. Generating a new token is required for subsequent enrollment batches.

### Company-scoped policies

Policies applied at the company level override global policies for that company's devices. See [Understanding Jobs vs. Policies](/kb/using-beacon/jobs-vs-policies/#policy-scope) for the override rules.

## Sites

Sites are sub-groupings within a company. Common use cases:

- Physical locations (Main Office, Branch, Warehouse)
- Network segments (On-Premises, Remote Workers)
- Device classes (Servers, Workstations)

Sites are optional — devices not assigned to a site are in the company's default ungrouped pool.

### Managing sites

Sites are managed from **Companies → [company] → Sites**. You can create, rename, and delete sites here. Deleting a site does not delete its devices — they move back to the ungrouped pool.

To move a device to a site: **Devices → [device] → Edit → Site**

### Targeting jobs by site

When creating a Job, you can target all devices in one or more sites instead of selecting individual devices. See [Jobs vs. Policies](/kb/using-beacon/jobs-vs-policies/#targets) for targeting rules.

## User assignments

Administrators can restrict dashboard users to specific companies, so a technician for Client A cannot see Client B's devices. User role and company assignment is managed from **Settings → Users**.

See [User Roles & Permissions](/kb/administration/user-roles-permissions/) for the full role matrix.
