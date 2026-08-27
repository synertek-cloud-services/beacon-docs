---
title: Companies, Locations, and Device Groups
category: administration
order: 1
updated: 2026-08-26
tags: [companies, locations, device-groups]
---

Companies are Beacon’s top-level organizational boundary. Create a Company before enrolling agents; its enrollment token places every enrolled device in that Company. A Company can also hold contacts, locations, variables, patch exclusions, and defaults such as whether new devices require approval.

## Set up a Company

From **Companies**, create the Company, then click into it to reach its detail page. Add contacts and locations as needed, select the enrollment/approval behavior, and create a single-purpose enrollment token. Copy a raw token when it is shown—Beacon stores only its hash and cannot reveal it later.

## Company detail page

A Company's detail page organizes everything about it into tabs: **Contacts**, **Locations**, **Tokens**, **Variables**, and **Discovery**. Editing lives in the page's own topbar, separate from the create flow on the list page. A "View Devices" button jumps straight to that company's filtered device list.

- **Variables** holds per-company key/value configuration, referenceable from Component scripts as `CV_<KEY>` — see [Scripting and Components](/kb/using-beacon/scripting/). A variable can be marked secret, in which case its value is write-only: Beacon reports whether it's set but never displays it again once saved.
- **Discovery** configures unmanaged-network host scanning for this company — see [Network Discovery](/kb/administration/network-discovery/).

Use **Device Groups** for manually curated, global collections of endpoints. They are not dynamic filters and are distinct from Company locations. A Device Group can be used alongside individual devices and Companies when targeting policies; job targets are deliberately single-kind exclusive.

## Targeting policy versus jobs

Policies may combine Companies, individual devices, and Device Groups; these target kinds are ORed, while OS and device-class filters remain additional AND conditions. A policy with no targets is unrestricted.

Jobs target one kind at a time: a Company/location-style scope, selected devices, or a Device Group according to the dashboard form. Scheduled job targets are resolved at dispatch time, and overlapping group membership is deduplicated.

Avoid treating legacy “site” language as a current product term. Use **Company**, **Location**, and **Device Group** in operating procedures.
