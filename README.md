# Herohub Roadmap Builder

Deploy-ready Netlify + React/Vite app that turns dealership roadmap source files into a consistent Herohub-branded executive report.

## Included

- Herohub logo from the supplied SVG
- Brand palette:
  - `#00BFB3` Herohub teal
  - `#131515` ink
  - `#20364E` navy
  - `#00766E` deep teal
  - `#D8F1A0` accent
- Markdown / TXT / PDF upload
- OpenAI-powered extraction into a strict report JSON schema
- Fixed React report components so visual layout stays consistent across dealerships
- Executive cover, planning frame, priorities, strengths/opportunities, talent plans, capacity map, 12-month roadmap, first 30 days, scorecard, decisions, and final outcome
- JSON editor for manual corrections before export
- Browser print styling for **Print / Save PDF**
- Included Honda Suzuki of Sanford sample source and sample report preview

## Deploy to Netlify

### 1. Unzip and put the folder in GitHub (recommended)

The project root is the folder containing `package.json` and `netlify.toml`.

### 2. Create a Netlify site

Import the repository into Netlify. `netlify.toml` already provides:

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

### 3. Add environment variables

In **Netlify → Site configuration → Environment variables**, add:

```text
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-5-mini
```

`OPENAI_MODEL` is optional. The function defaults to `gpt-5-mini`. If your OpenAI project uses a different compatible model, set the variable to that model name without changing code.

### 4. Deploy

Trigger a Netlify deploy. The API key is read only inside the Netlify Function and is never sent to the browser.

## Local development

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example` and add your key.

For the static UI/sample preview:

```bash
npm run dev
```

For full local testing of the Netlify Function, use the Netlify CLI so `/.netlify/functions/generate-report` is available locally.

## User flow

1. Upload `.md`, `.txt`, or `.pdf`.
2. Click **Generate Report**.
3. Open **Edit JSON** for final wording/data corrections if needed.
4. Click **Print / Save PDF**.
5. In the browser print dialog, choose **Save as PDF** and enable background graphics if the browser offers that option.

## Source fidelity rules

The server prompt is intentionally conservative. It instructs the model to:

- use only source-supported dealership facts;
- not invent KPI results, names, dates, owners, or financial data;
- preserve explicit assumptions and add material caveats to `sourceNotes`;
- preserve decision gates as open questions rather than conclusions;
- keep source terminology for Herohub products and dealership roles.

Edit these rules in:

```text
netlify/functions/generate-report.mjs
```

## Branding / design changes

Most visual changes are in:

```text
src/styles.css
```

The report rendering lives in:

```text
src/App.tsx
```

The structured data contract is represented in:

```text
src/types.ts
netlify/functions/generate-report.mjs
```

Keep the frontend TypeScript types and server JSON schema aligned if you change the report structure.

## V1 upload limit

The UI intentionally caps individual uploads at **3 MB**. This keeps the JSON/base64 request conservative for a serverless function. If you later need large assessment packages, multiple files, transcripts, or spreadsheets, move uploads to object storage and pass file references to the generation function instead of sending the whole binary inside the request body.

## Included sample

`sample-input/honda-suzuki-sanford-roadmap.md` is the source file supplied for this build. The app also includes a prebuilt sample in `src/sampleReport.ts`, so the Herohub design can be previewed without calling OpenAI.


## v1.0.2

- Fixed PDF clipping by restoring the intended multi-column report grids inside print media.
- Added print-specific sizing and break protection for report cards, timeline rows, and tables.
- Removed the visible brand hex-code chips from the upload screen.
- Switched the app/report body typography to IBM Plex Sans via Google Fonts with system fallbacks.


## v1.0.3

- Prevents long roadmap classification badges such as “Shoulder / Peak Assumption” and “Peak / Shoulder Assumption” from overflowing the month rail in PDF output.
