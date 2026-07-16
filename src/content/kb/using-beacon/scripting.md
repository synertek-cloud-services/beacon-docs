---
title: Scripting & Ad-hoc Execution
category: using-beacon
order: 3
updated: 2026-07-16
tags: [scripting, jobs, components, powershell, bash, automation]
---

Beacon's scripting system is built around **Components** — reusable script units stored in a library — and **Jobs**, which execute one or more components against a set of target devices. This article covers building components and running ad-hoc scripts.

For the conceptual difference between Jobs and Policies, see [Understanding Jobs vs. Policies](/kb/using-beacon/jobs-vs-policies/).

## Components library

The Components library is available at **Dashboard → Components**. It has two sections:

- **My Components** — components you or your team have created; editable and runnable
- **ComStore** — built-in read-only components provided by Beacon (flush DNS, list installed software, get event log, etc.). You can clone any ComStore component to create an editable copy.

### Creating a component

1. **Dashboard → Components → New Component**
2. Fill in:
   - **Name** — display name in the library and job creation UI
   - **Kind** — Script or Application
   - **Shell** — PowerShell, bash, sh, cmd, zsh
   - **Script body** — the script content
3. Optionally add **Input Variables** (see below)
4. Optionally add **Post-conditions** (see below)
5. Click **Save**

### Input variables

Variables let you parameterize components so the same script can be reused with different inputs at job creation time. Beacon passes variables to the script as environment variables.

Variable types:
- **String** — free text
- **Boolean** — true/false; passed as `"true"` or `"false"`
- **Date** — ISO 8601 date; passed as a formatted string
- **Selection** — dropdown with predefined options; passed as the selected value string

When creating a job that uses a component with variables, Beacon prompts for each variable's value before dispatching.

**Example — parameterized disk cleanup component (PowerShell):**

```powershell
# Variables: TARGET_DRIVE (String, default "C")
$drive = $env:TARGET_DRIVE
$path = "${drive}:\Windows\Temp\*"
$before = (Get-Item $path | Measure-Object Length -Sum).Sum / 1MB
Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
$after = (Get-Item $path -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum / 1MB
Write-Output "Freed: $([math]::Round($before - $after, 1)) MB from $drive:\Windows\Temp"
```

### Post-conditions

Post-conditions let you flag a command as "Warning" even when it exits successfully (exit code 0). They match against stdout or stderr using a substring or regex pattern.

Example: a script that checks for pending Windows updates might output "No updates found" on exit 0 — you can add a post-condition to mark runs where "REBOOT_REQUIRED" appears in stdout as Warning.

Post-conditions do **not** affect exit codes or mark runs as failures. A Warning is a soft signal that something noteworthy happened without constituting an error.

## Running an ad-hoc script

To run a script immediately against one or more devices:

1. **Dashboard → Jobs → New Job**
2. **Type** — select "Quick (immediate)"
3. **Target** — All Devices, Sites, or specific devices
4. **Components** — select one or more components; fill in any variable prompts
5. **Name** — give the job a descriptive name for the history view
6. Click **Run Now**

Commands are dispatched on each target device's next check-in (within 60 seconds). Results appear in the job detail page as they come in.

## Scheduling a script

Scheduled jobs work the same as quick jobs except you set a future **run time**:

1. **Dashboard → Jobs → New Job**
2. **Type** — select "Scheduled"
3. **Scheduled at** — choose date and time (uses your dashboard's local timezone)
4. Complete the rest of the form as with a quick job

The device set is resolved at dispatch time (when the scheduled time arrives), not when the job is created. Newly enrolled devices can be picked up by a scheduled job if they're enrolled before the scheduled time.

## Viewing script results

Every job has a detail page at **Jobs → [job name]** showing:

- A summary flow (Pending / Running / Success / Warning / Failure counts)
- A per-device list of commands with expandable stdout/stderr output
- Timing information (queued at, started at, completed at)

Script output is stored in D1 and retained for 90 days.

See also: [Understanding Jobs vs. Policies](/kb/using-beacon/jobs-vs-policies/), [Alert Rules](/kb/alerting-policies/alert-rules/)
