# Herohub Talent Development Roadmap Builder v1.1

This Netlify app is tuned for the standardized Herohub Talent Development Roadmap PDF format.

## What changed in v1.1

The parser now explicitly extracts and renders:
- Executive Summary: strong team, opportunities, gaps/risks, five strategic priorities, assessment snapshot
- Talent + Succession Snapshot and role/readiness gaps
- Complete Employee Development Assignment Matrix
- Program Assignment Logic
- Complete 12-month dealership-wide roadmap and HerohubIQ cadence
- Every Individual Development Calendar, including all 12 monthly rows
- First 30 Days launch plan
- Scorecard + Governance
- Decisions + Dependencies, including bullets continued on later pages
- Source + Planning Notes

## Netlify environment variables

Set these under Project configuration > Environment variables:

- `OPENAI_API_KEY` = your OpenAI API project key
- `OPENAI_MODEL` = `gpt-5.6-terra` (recommended; may be changed)

After changing variables, redeploy the site.

## Deploy

Build command: `npm run build`
Publish directory: `dist`
Functions directory: `netlify/functions`

## Input

Recommended input is a Herohub Talent Development Roadmap PDF using the standard recurring section structure. PDF, Markdown and TXT are accepted. Upload limit in the UI is 4 MB.

## Output

The app generates structured JSON first, then renders fixed Herohub React components. Use **Edit JSON** for corrections and **Print / Save PDF** for the final report.


## v1.1.1 deployment fix

The Netlify production build now runs `vite build` directly. Type checking remains available separately with `npm run typecheck`. This avoids deployment failures caused by TypeScript-only checks while preserving the same runtime app.

## v1.1.2: long-running roadmap generation

The standardized roadmap PDFs can require more than a synchronous serverless request to analyze and return all individual 12-month calendars. v1.1.2 starts the OpenAI Responses API request in background mode and polls for completion through the same Netlify Function.

After deploying, you can verify the function route by visiting:

`https://YOUR-DOMAIN/api/generate-report`

A healthy deployment returns JSON similar to:

`{"ok":true,"service":"Herohub Roadmap Builder","mode":"OpenAI background processing"}`

If that URL displays your normal website or a Netlify HTML 404 page, the function did not deploy or the repository does not contain `netlify/functions/generate-report.mjs` and the included `netlify.toml`.
