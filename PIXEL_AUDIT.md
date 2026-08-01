# Pixel & Tracking Audit — Workplace Action Planner

**Audit date:** 2026-05-12
**Stack:** Vite 7 + React 19 SPA, Tailwind v4, deployed on Vercel (`workplace-action-planner`).

## 1. Summary Table

| Platform | Status |
|---|---|
| GTM / GA4 / Google Ads | Not installed |
| Meta Pixel / CAPI | Not installed |
| TikTok / LinkedIn / Pinterest / X / Snap / Reddit / Bing UET | Not installed |
| Hotjar / Clarity / Segment / Mixpanel / Amplitude / PostHog | Not installed |
| Klaviyo / ConvertKit / Kit | Not installed |
| ManyChat | Not installed |
| Vercel Analytics / Speed Insights | Not installed |

**Bottom line:** the application is fully un-instrumented. Zero pixels, zero analytics SDKs, zero consent layer, zero lead capture.

## 2. Detailed Findings (file:line)

- `index.html:1-14` — only `<script type="module" src="/src/main.jsx">`. No third-party scripts.
- `src/main.jsx:1-11` — renders `<App />` in StrictMode. No analytics provider, no consent context.
- `src/App.jsx:1-134` — tab state via `useState`; persistence via `useLocalStorage` only (keys `yau-actions`, `yau-audit`, `yau-journal`, `yau-goals`). `handleToggleAction` (line 30-32) and `handleAddJournalEntry` (line 34-36) emit no events. No `action_added`, `plan_completed`, `audit_completed`, `week_completed`, `journal_entry_saved`, `goal_set`, or `lead_submitted` events exist anywhere.
- `src/components/Dashboard.jsx`, `WeeklyActions.jsx`, `CultureAudit.jsx`, `Journal.jsx`, `Goals.jsx`, `Navigation.jsx` — all display/local-state only.
- `src/data/*.js` — static data.
- `src/hooks/useLocalStorage.js` — never calls out to the network.

**False positives**: every occurrence of `tracking` in source is the Tailwind `tracking-*` letter-spacing utility or the `progress-track` CSS class.

**Environment / secrets**: no `.env`, `.env.local`, or `.env.production`. `.vercel/project.json` carries only project metadata.

## 3. Coverage Gaps

1. **No identity capture.** As a "lead magnet," the planner currently magnetises nothing.
2. **No top-of-funnel attribution.** Paid traffic is dark.
3. **No engagement events.** High-intent micro-conversions (audit_completed, week_completed, plan_completed, journal_entry_saved, goal_set) are invisible.
4. **No remarketing audiences** being seeded in GA4, Meta, or Google Ads.
5. **No Consent Mode v2 / cookie banner.**
6. **No domain verification** in Meta Business, Google Search Console, TikTok, or Pinterest.
7. **No server-side fallback** (no sGTM, no CAPI endpoint).
8. **No CRM/ESP integration** — no destination for leads if a form were added.
9. **No event_id dedup design** for future Pixel + CAPI parity.
10. **No Vercel Web Analytics / Speed Insights** package installed.

## 4. Recommendations (priority-ordered)

**P0 (before any paid traffic):**
1. Add a lead-capture step — best placement is immediately after the Culture Audit results screen (highest-intent moment) and as a "Save your plan" CTA.
2. Install GTM in `index.html`; drive all downstream tags via dataLayer.
3. Implement Consent Mode v2 with `denied` defaults. Add a lightweight banner.
4. Create a GA4 property, deploy via GTM. Use dataLayer pushes (e.g. `dataLayer.push({ event: 'action_completed', action_id, week_number })`).

**P1 (event taxonomy):**
Implement: `page_view` (virtual SPA), `audit_started`, `audit_completed` (`audit_score`, `audit_bucket`), `action_completed` (`action_id`, `week_number`), `week_completed`, `journal_entry_saved`, `goal_set`, `plan_completed`, `lead_submitted` (SHA-256 hashed email for Enhanced Conversions + CAPI). Primary Google Ads conversions: `lead_submitted` + `plan_completed`. Secondary: `audit_completed` + `week_completed`.

**P2 (channel pixels, only after P0 + lead form live):**
5. Meta Pixel via GTM + CAPI via Vercel serverless function (`/api/capi.js`) using `event_id` dedup. Verify domain, configure 8 AEM events.
6. Google Ads conversion for `lead_submitted` with Enhanced Conversions for Leads.
7. TikTok Pixel + Events API (if running TikTok).
8. LinkedIn Insight Tag (workplace/HR angle makes LI plausible).
9. Microsoft Clarity (free) for heatmaps + recordings on audit and journal screens.

**P3 (hardening):**
10. Server-side GTM once events exceed ~50k/month.
11. Add `@vercel/analytics` + `@vercel/speed-insights` for cookieless first-party baselines.
12. Env var hygiene: `VITE_GTM_ID`, `VITE_GA4_MEASUREMENT_ID`, `VITE_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, etc. Document in `.env.example`.
13. Cross-domain linking if planner lives on a subdomain.
14. Pre-release QA: GA4 DebugView, Meta Test Events, Tag Assistant, Lighthouse <200ms tag impact.

**P4 (attribution & reporting):**
15. GA4 → BigQuery raw export.
16. Switch Google Ads to data-driven attribution once `lead_submitted` clears ~30 conv / 30 days.
17. Weekly KPI dashboard: cost/lead, lead → plan-started rate, plan-completion rate, audit-score distribution.
