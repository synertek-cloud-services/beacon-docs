---
title: Companies, Locations, and Device Groups
category: administration
order: 1
updated: 2026-08-05
tags: [companies, locations, device-groups]
---

Companies are Beacon’s top-level organizational boundary. Create a Company before enrolling agents; its enrollment token places every enrolled device in that Company. A Company can also hold contacts, locations, variables, patch exclusions, and defaults such as whether new devices require approval.

## Set up a Company

From **Companies**, create the Company, add contacts and locations as needed, select the enrollment/approval behavior, and create a single-purpose enrollment token. Copy a raw token when it is shown—Beacon stores only its hash and cannot reveal it later.

Use **Device Groups** for manually curated, global collections of endpoints. They are not dynamic filters and are distinct from Company locations. A Device Group can be used alongside individual devices and Companies when targeting policies; job targets are deliberately single-kind exclusive.

## Targeting policy versus jobs

Policies may combine Companies, individual devices, and Device Groups; these target kinds are ORed, while OS and device-class filters remain additional AND conditions. A policy with no targets is unrestricted.

Jobs target one kind at a time: a Company/location-style scope, selected devices, or a Device Group according to the dashboard form. Scheduled job targets are resolved at dispatch time, and overlapping group membership is deduplicated.

Avoid treating legacy “site” language as a current product term. Use **Company**, **Location**, and **Device Group** in operating procedures.
