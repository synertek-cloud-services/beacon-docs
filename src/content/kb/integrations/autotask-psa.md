---
title: Autotask PSA Integration
category: integrations
order: 2
updated: 2026-07-16
tags: [autotask, psa, ticketing, integration, datto]
---

Beacon can create and update Autotask PSA tickets when alerts fire, using the Beacon webhook system and the Autotask REST API. This article describes the integration architecture and how to set it up.

## Integration approach

Beacon does not have a native Autotask connector built in. The integration is built using:

1. **Beacon webhook** — delivers alert events to an intermediary
2. **Autotask REST API** — creates/updates service tickets
3. **Intermediary** — a Cloudflare Worker, AWS Lambda, or similar that maps Beacon alert payloads to Autotask ticket format

The intermediary pattern lets you customize field mapping (priority, queue, issue type, company mapping) without modifying Beacon itself.

## Setting up the webhook → Autotask bridge

### Step 1 — Autotask API credentials

In Autotask, create a dedicated API user (Resources → New Resource → Type: API User). Note the username and secret — these are the credentials your bridge will use to authenticate with the Autotask REST API.

### Step 2 — Deploy a webhook bridge

A minimal Cloudflare Worker bridge:

```javascript
export default {
  async fetch(request, env) {
    const payload = await request.json();
    if (payload.event !== 'alert.created') return new Response('ok');

    const ticket = {
      companyID: await lookupAutotaskCompany(payload.alert.device.company, env),
      title: `[Beacon] ${payload.alert.message}`,
      description: JSON.stringify(payload.alert, null, 2),
      priority: mapPriority(payload.alert.priority),
      queueID: env.AUTOTASK_QUEUE_ID,
      status: 1,  // New
    };

    await fetch('https://webservices.autotask.net/ATServicesRest/V1.0/Tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApiIntegrationCode': env.AUTOTASK_API_CODE,
        'UserName': env.AUTOTASK_USERNAME,
        'Secret': env.AUTOTASK_SECRET,
      },
      body: JSON.stringify(ticket),
    });

    return new Response('ok');
  }
};

function mapPriority(beaconPriority) {
  return { critical: 1, high: 2, moderate: 3, low: 4 }[beaconPriority] ?? 3;
}
```

### Step 3 — Configure the Beacon webhook

1. **Dashboard → Settings → Notification Channels → New Channel → Webhook**
2. Set the webhook URL to your bridge Worker URL
3. Configure the signing secret (use it in your bridge to verify the request is from Beacon)
4. Assign the channel to the policies whose alerts should create tickets

## Company mapping

The most common customization is mapping Beacon company names to Autotask company IDs. Options:

- **KV store lookup** — store the mapping in a Cloudflare KV namespace and look up by company name
- **Hardcoded map** — simple but requires redeployment when clients are added
- **Autotask API search** — query `GET /V1.0/Companies?search={"filter":[{"field":"companyName","op":"eq","value":"${name}"}]}`

## Closing tickets when alerts resolve

Handle `alert.resolved` events in your bridge to close or update the corresponding Autotask ticket. You'll need to store the Beacon alert ID → Autotask ticket ID mapping (KV, D1, or a database of your choice) when the ticket is created, then look it up when the resolved event comes in.

See also: [Webhooks & API](/kb/integrations/webhooks-api/)
