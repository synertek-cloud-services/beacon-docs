---
title: Scripting and Components
category: using-beacon
order: 3
updated: 2026-08-05
tags: [scripting, components, jobs]
---

Components are reusable command definitions. Create and maintain them under **Components**, then select them in a Quick Job or one-time Scheduled Job. The dashboard retains the command result—stdout, stderr, exit state, and timing—on the Job detail page.

## Build a safe Component

Choose the appropriate shell and target OS, use a descriptive name, and make inputs explicit through variables instead of embedding environment-specific values in a script. Beacon resolves device custom fields as `CF_<KEY>` and Company Variables as `CV_<KEY>` at dispatch; unset values are omitted rather than supplied as empty strings.

Keep secrets out of script bodies and source control. Use the supported secret/variable facilities, and restrict Components marked **Requires Admin to Run** to administrators. Test a component on a representative non-production endpoint before broad targeting.

ComStore is a read-only library. Clone a Component before modifying it. If a custom-field key is renamed, Beacon prevents the change when a literal `CF_<OLDKEY>` reference would be broken until the script is updated.

## Run and review

Quick Jobs are queued for the next agent check-in. Scheduled Jobs dispatch once at the selected time; they do not recur. The default execution identity is system/root. On Windows, a supported PowerShell job may explicitly run as the logged-in user, but it fails rather than silently falling back when no active console session exists.

Use the Job detail page for command output and failure investigation. See [Jobs and Policies](/kb/using-beacon/jobs-vs-policies/) for targeting and timing behavior.
