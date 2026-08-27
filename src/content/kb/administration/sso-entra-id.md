---
title: Single Sign-On with Microsoft Entra ID
category: administration
order: 5
updated: 2026-08-27
tags: [sso, entra-id, authentication, azure-ad]
---

Beacon can authenticate dashboard users against Microsoft Entra ID instead of (or alongside) local email/password accounts, assigning each user's Beacon role from their Entra group membership. Microsoft Entra ID is the only SSO provider currently supported.

## 1. Register an application in Entra ID

In the Entra admin center, register a new application and record three values you'll need in Beacon: the **Directory (Tenant) ID**, the **Application (Client) ID**, and a **client secret** you create for it (Entra only shows the secret's value once — copy it immediately).

- **Redirect URI**: `<your Worker/API origin>/v1/auth/microsoft/callback` — this is your **Worker/API origin** (see [Self-hosting Quick Start](/kb/getting-started/quick-start/) if you're not sure which of your two URLs that is), never the dashboard URL.
- **API permissions** (Microsoft Graph) — add both of these and grant admin consent for both, since neither works without it:

| Permission | Type | Used for |
|---|---|---|
| `GroupMember.Read.All` | Delegated | Reading the signed-in user's group membership at login |
| `Group.Read.All` | Application | Letting Beacon search your Entra groups by name when you set up mappings below |

## 2. Configure the provider in Beacon

As an admin, go to **Settings → SSO**. Under Microsoft Entra ID, fill in:

- **Name** — a display label (e.g. "Microsoft 365")
- **Directory (Tenant) ID**
- **Application (Client) ID**
- **Client Secret**
- **Enabled**

Save. The secret is encrypted at rest and is never shown again once saved — if you edit this provider later, leave Client Secret blank to keep the existing value; entering a new one replaces it.

## 3. Map Entra groups to Beacon roles

Still on **Settings → SSO**, the **Group → Role Mappings** section is what actually decides who can sign in and with what role. Search for a group by name (Beacon queries Entra directly) and pick it, or enter its Group object ID by hand if search isn't turning it up, then assign it a Beacon role (`admin`, `technician`, or `readonly`).

A few behaviors worth knowing before you rely on this:

- **No matching group, no account.** A user who isn't in any mapped group is rejected at sign-in — Beacon never creates an account for them.
- **Multiple matching groups → highest role wins.** If someone is in more than one mapped group, they get the single highest-privilege role among them, not a merge of permissions.
- **Role is re-checked on every login, not just once.** Moving someone between Entra groups takes effect the next time they sign in — there's no separate step to sync or re-provision existing users.
- **Nested group membership counts.** Beacon checks a user's full transitive group membership, not just groups they're a direct member of, so a group-of-groups structure in Entra works as expected.

## Signing in

Once a provider is configured and enabled, the login page automatically offers a "Sign in with Microsoft" option instead of defaulting to local email/password. Local accounts and [Emergency administrator access](/kb/administration/user-roles-permissions/) both still work alongside SSO — configuring Entra ID doesn't lock you out of either.
