# M5 Painting: GA4 lead and call-click verification

Updated November 12, 2026.

## Property and events

OpenSEO's connected GA4 property: **M5 Painting** (`properties/551178746`), web measurement ID **G-1QWGMNC02K**.

The public site now emits these events without a custom cookie-consent opt-in gate:

| Event | When it fires | What it measures | Event parameters |
| --- | --- | --- | --- |
| `generate_lead` | The contact form has stored a lead in Convex **and** its email notification succeeded (current contact flow) | Successful end-to-end quote request | `form_name=contact`, `lead_type` (interior / exterior / commercial / consultation / other) |
| `click_to_call` | Someone clicks any `tel:` link on a public page (header, footer, contact, SEO landing) | **Call intent only**, not a completed call | `click_location`, `page_path` |
| `page_view` | Consent-enabled first page load or subsequent client-side route change | Viewed public page | Built-in page metadata |

Neither call numbers nor customers' names, email, phone or message are sent to GA4. A test call click does not prove that a conversation was completed.

If the email notification fails after the database already accepted the lead, the current form does not report a successful request; this should be revisited when the separate Turnstile/contact PR #48 is integrated.

## Manual GA4 setup

1. Log in to Google Analytics, select the **M5 Painting** property and visit **Admin → Data display → Events**.
2. If `generate_lead` already appears under Recent events, click its star to mark it as a **key event**. Otherwise use **Create event → Create with code** (if available), enter `generate_lead`, and turn on **Mark as key event**. Don't create a page-view-based event; the site sends this name directly after a successful request.
3. Do the same for `click_to_call` only if you want call-click **intent** in key-event reporting. Never treat this as a confirmed phone conversation.
4. Existing `qualify_lead` and `close_convert_lead` are separate downstream funnel stages. Do not rename a raw form submission to `qualify_lead`.
5. If the deployment uses **Google Tag Manager** (`NEXT_PUBLIC_GTM_ID`), add Custom Event triggers for both names and GA4 Event tags that send the event and the permitted parameters to the M5 property. Without these GTM tags, dataLayer events alone do not reach GA4. If it uses direct `NEXT_PUBLIC_GA_MEASUREMENT_ID`, the code sends events via gtag and no GTM trigger is required.

Google's reference: https://support.google.com/analytics/answer/13128484?hl=en

## Realtime testing on an approved hostname

1. Verify the deployed main branch loads the M5 measurement ID or configured GTM container. Open an incognito browser.
2. Analytics runs without a cookie banner or preferences control. Confirm the site's privacy notice and any required opt-out mechanism match the deployed behavior.
3. Open a public service page, then `/contact`. In GA4 **Reports → Realtime**, check `page_view` and the page paths.
4. Click a phone link. Verify `click_to_call` in GA4 Realtime/DebugView. It is an interaction, not an actual connected call.
5. Submit a **clearly labeled internal test quote request** through the real form after the production Turnstile secrets are configured and its draft PR is deployed. Confirm both the lead in M5's CMS and the notification email. In GA4 Realtime/DebugView, confirm exactly one `generate_lead` event for the successful submission.
6. Verify that public analytics does not collect admin-page events. Avoid extra test leads in production.
7. Confirm both events appear as key events after GA4 has processed them. Standard reports can lag, and creating a key event does not retroactively reclassify old traffic.

## Caveats and follow-up

- **Do not merge Turnstile PR #48 as-is**: it still changes the removed consent component, and its form protection needs `TURNSTILE_SECRET` and `TURNSTILE_HOSTNAMES` configured first.
- Existing CMS admin custom click/form events can coexist; avoid configuring another GA4 tag with the **same event name** on the same interaction, or conversions may be counted twice.
- With consent gating removed, review applicable privacy notice, consent and opt-out requirements. Removing the banner does not itself establish compliance.
- Verify actual call completions through a call-tracking provider or phone system, not by labeling a `tel:` click as a phone call.
