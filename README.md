# Herohub Talent Development Roadmap Builder — v1.2.0

Deploy-ready Netlify app for converting the standardized Herohub Talent Development Roadmap source PDF into a polished Herohub-branded report.

## v1.2.0: source-faithful mapping

This version is intentionally designed to **format the approved source roadmap rather than reinterpret it**.

The generated report mirrors the recurring source hierarchy:

1. Cover / Purpose / Prepared from
2. Executive Summary
   - A Strong Team to Build On
   - Highest-Value Opportunities
   - Material Gaps and Risks
   - Five Strategic Priorities
   - Assessment Snapshot
3. Talent and Succession Snapshot
   - Role and Readiness Gaps
4. Employee Development Assignment Matrix
   - Program Assignment Logic
5. Dealership-Wide 12-Month Roadmap
   - Seasonality assumptions
   - HerohubIQ Cadence
6. Individual Development Calendars — every person and every month
7. First 30 Days | Launch Plan
8. Scorecard and Governance
9. Decisions and Dependencies
10. Source and Planning Notes

The OpenAI extraction prompt now emphasizes near-verbatim source fidelity. It should only clean PDF extraction artifacts and must preserve dates, program names/numbers, required/recommended/optional language, conditions, owners, evidence, DMS dependencies and source caveats.

## Netlify

Build command:

```bash
npm run build
```

Publish directory:

```text
dist
```

Netlify Function route:

```text
/api/generate-report
```

Health check:

```text
https://YOUR-DOMAIN/api/generate-report
```

A healthy deployment returns JSON identifying the Herohub Roadmap Builder and OpenAI background processing mode.

## Environment variables

Required:

```text
OPENAI_API_KEY=your_api_key
```

Recommended:

```text
OPENAI_MODEL=gpt-5.6-terra
```

The API key is read only inside the Netlify Function and is never exposed in the React client.

## Input

- PDF
- Markdown
- TXT
- Maximum upload: 4 MB

The standardized PDF is the preferred input.

## Output

The browser preview and Print / Save PDF view use the same React components. IBM Plex Sans is loaded from Google Fonts. The report uses the supplied Herohub logo and brand palette.

## Development

```bash
npm install
npm run dev
```

Optional type check:

```bash
npm run typecheck
```

Production build:

```bash
npm run build
```


## v1.2.2

- Prevents duplicate numbering in Five Strategic Priorities by stripping source numeric prefixes before ordered-list rendering.


## v1.2.2 print fix

- Forces all report tables to the printable page width in print mode.
- Overrides the responsive 780px table minimum width that could leak into Chrome print rendering.
- Wraps long words and dense cell content instead of clipping the rightmost columns.
- Removes horizontal table scroll behavior from printed/PDF output.
