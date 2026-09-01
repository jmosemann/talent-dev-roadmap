const OPENAI_URL = 'https://api.openai.com/v1/responses'

const stringArray = { type: 'array', items: { type: 'string' } }
const objArray = (required, properties) => ({ type: 'array', items: { type: 'object', additionalProperties: false, required, properties } })

const REPORT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: [
    'reportTitle','reportSubtitle','profile','purpose','preparedFrom','executiveStrongTeam','executiveOpportunities','executiveRisks',
    'strategicPriorities','successDefinition','assessmentSnapshot','talentSnapshot','roleReadinessGaps','employeeAssignments',
    'programAssignmentIntro','programAssignmentLogic','seasonalityAssumptions','roadmap','iqCadence','individualCalendars','first30Days','scorecard','decisionsDependencies','sourceNotes'
  ],
  properties: {
    reportTitle: { type:'string' }, reportSubtitle:{ type:'string' },
    profile: { type:'object', additionalProperties:false, required:['name','period','locations','employees','brands','dealerPrincipal','generalManager','assessmentDate'], properties:{
      name:{type:'string'}, period:{type:'string'}, locations:{type:'string'}, employees:{type:'string'}, brands:stringArray,
      dealerPrincipal:{type:'string'}, generalManager:{type:'string'}, assessmentDate:{type:'string'}
    }},
    purpose:{type:'string'}, preparedFrom:{type:'string'}, executiveStrongTeam:{type:'string'}, executiveOpportunities:{type:'string'}, executiveRisks:{type:'string'},
    strategicPriorities:stringArray, successDefinition:{type:'string'},
    assessmentSnapshot: objArray(['area','evidence'], { area:{type:'string'}, evidence:{type:'string'} }),
    talentSnapshot: objArray(['name','role','observedAsset','developmentNeed','successionRelevance','urgency'], {
      name:{type:'string'}, role:{type:'string'}, observedAsset:{type:'string'}, developmentNeed:{type:'string'}, successionRelevance:{type:'string'}, urgency:{type:'string'}
    }),
    roleReadinessGaps:stringArray,
    employeeAssignments: objArray(['name','role','objective','herohubU','herohubIQ','programs','cadence','evidence'], {
      name:{type:'string'}, role:{type:'string'}, objective:{type:'string'}, herohubU:{type:'string'}, herohubIQ:{type:'string'}, programs:{type:'string'}, cadence:{type:'string'}, evidence:{type:'string'}
    }),
    programAssignmentIntro:{type:'string'},
    programAssignmentLogic:stringArray,
    seasonalityAssumptions:{type:'string'},
    roadmap: objArray(['month','seasonCapacity','theme','actionsPrograms','participants','evidence'], {
      month:{type:'string'}, seasonCapacity:{type:'string'}, theme:{type:'string'}, actionsPrograms:{type:'string'}, participants:{type:'string'}, evidence:{type:'string'}
    }),
    iqCadence:stringArray,
    individualCalendars: objArray(['name','role','objective','coach','months'], {
      name:{type:'string'}, role:{type:'string'}, objective:{type:'string'}, coach:{type:'string'},
      months: objArray(['month','capacity','development','herohubIQ','reinforcementEvidence'], {
        month:{type:'string'}, capacity:{type:'string'}, development:{type:'string'}, herohubIQ:{type:'string'}, reinforcementEvidence:{type:'string'}
      })
    }),
    first30Days: objArray(['timing','action','owner','evidence'], { timing:{type:'string'}, action:{type:'string'}, owner:{type:'string'}, evidence:{type:'string'} }),
    scorecard: objArray(['measure','evidence','owner','cadence'], { measure:{type:'string'}, evidence:{type:'string'}, owner:{type:'string'}, cadence:{type:'string'} }),
    decisionsDependencies:stringArray,
    sourceNotes:stringArray
  }
}

const instructions = `You are a source-faithful Herohub Talent Development Roadmap formatter.

The uploaded PDF is already the approved CONTENT roadmap. Your job is not to create a new strategy, rewrite the roadmap, or editorialize it. Your job is to map the source into structured JSON so a Herohub-branded template can reproduce the source content cleanly.

The standardized source normally follows this order:
1. Cover: dealership, 12-Month Talent Development Roadmap, date range, Purpose, Prepared from...
2. Executive Summary
   - A Strong Team to Build On
   - Highest-Value Opportunities
   - Material Gaps and Risks
   - Five strategic priorities
   - Assessment Snapshot
3. Talent and Succession Snapshot
   - Person / role
   - Observed asset
   - Development need
   - Succession relevance
   - Urgency
   - Role and Readiness Gaps
4. Employee Development Assignment Matrix
   - Employee
   - Current role
   - Primary objective
   - HerohubU
   - HerohubIQ
   - Bootcamp / Basecamp
   - Manager cadence
   - Success evidence
   - Program Assignment Logic
5. Dealership-Wide 12-Month Roadmap
   - Seasonality assumptions
   - Month
   - Season / capacity
   - Theme / outcome
   - Required actions and Herohub programs
   - Participants
   - Completion evidence
   - HerohubIQ Cadence
6. INDIVIDUAL DEVELOPMENT CALENDAR pages, one person at a time
   - Person / role
   - Primary objective
   - Manager / coach
   - Month
   - Capacity
   - HerohubU / Bootcamp / Basecamp / role development
   - HerohubIQ
   - Manager reinforcement & evidence
7. First 30 Days | Launch Plan
8. Scorecard and Governance
9. Decisions and Dependencies
10. Source and Planning Notes

TRANSCRIPTION / FIDELITY RULES:
- Treat the source PDF as authoritative and already approved.
- Preserve the source wording as closely as possible. Do NOT summarize or paraphrase substantive passages merely to make them shorter.
- Only clean extraction artifacts: broken line wraps, stray hyphenation caused by PDF extraction, duplicated whitespace, or obvious character corruption.
- Preserve the original section order and table row order.
- Preserve ALL names, roles, program names and numbers, dates, conditions, owners, cadence, evidence, DMS references, caveats, and qualifiers.
- Preserve words such as Required, Recommended, Optional, conditional, subject to confirmation, only if, no aligned Pathway, Not applicable, no invented targets, and no performance gain is guaranteed.
- Do not invent a successor, role path, program, KPI target, performance problem, expected outcome, or employee classification.
- Do not infer individual facts from aggregate assessment percentages.
- If a field is absent, return an empty string or empty array. Never fill a gap from general dealership knowledge.
- Keep every Employee Development Assignment Matrix row.
- Keep all 12 Dealership-Wide Roadmap rows when present.
- Keep every Individual Development Calendar in the document, in source order, with every monthly row. Repeated monthly manager-evidence language should remain repeated if the source repeats it.
- Keep every First 30 Days row, every Scorecard row, every Decisions and Dependencies bullet, and all Source and Planning Notes.

FIELD MAPPING RULES:
- reportTitle: use the source report title, normally “12-Month Talent Development Roadmap”.
- reportSubtitle: use any source subtitle/series label if present; otherwise empty string.
- purpose: transcribe the source Purpose text.
- preparedFrom: transcribe the source “Prepared from...” line as written.
- executiveStrongTeam: transcribe “A Strong Team to Build On”.
- executiveOpportunities: transcribe “Highest-Value Opportunities”.
- executiveRisks: transcribe “Material Gaps and Risks”.
- strategicPriorities: preserve each strategic priority as an individual item without rewriting it, but OMIT the leading source number/marker (for example, return “Establish structured onboarding.” rather than “1) Establish structured onboarding.”). The report renderer supplies the visible numbering.
- successDefinition: transcribe the One-year success evidence if present; do not create a new statement.
- assessmentSnapshot: transcribe all Assessment Snapshot rows.
- talentSnapshot: map the Talent and Succession Snapshot table directly.
- roleReadinessGaps: preserve each Role and Readiness Gaps bullet.
- employeeAssignments: map the Employee Development Assignment Matrix directly, one source row per JSON item.
- programAssignmentIntro: preserve the introductory paragraph under Program Assignment Logic before its bullets.
- programAssignmentLogic: preserve each person/program logic bullet separately.
- seasonalityAssumptions: transcribe the paragraph that begins “Seasonality assumptions”. Do not duplicate the label itself.
- roadmap: map the Dealership-Wide 12-Month Roadmap table directly, one month per JSON item.
- iqCadence: preserve every bullet under HerohubIQ Cadence, including the applicable-roles bullet.
- individualCalendars: map every calendar directly. Preserve exact source order and all 12 months when present.
- first30Days: map the Launch Plan table directly.
- scorecard: map Scorecard and Governance directly.
- decisionsDependencies: preserve every bullet, including bullets continuing onto the next page.
- sourceNotes: preserve the Source and Planning Notes content as separate paragraphs/items; do not add new interpretation notes.

The branded output should be a visual restyling of the source PDF, not a newly authored report.`

export default async (request) => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return json({ error:'OPENAI_API_KEY is not configured in Netlify environment variables.' },500)

  try {
    if (request.method === 'GET') {
      const url = new URL(request.url)
      const responseId = safeString(url.searchParams.get('responseId'))
      if (!responseId) return json({ ok:true, service:'Herohub Roadmap Builder', mode:'OpenAI background processing' })
      if (!/^resp_[A-Za-z0-9_-]+$/.test(responseId)) return json({ error:'A valid responseId is required.' },400)

      const openAIResponse = await fetch(`${OPENAI_URL}/${encodeURIComponent(responseId)}`, {
        method:'GET',
        headers:{ Authorization:`Bearer ${apiKey}`, 'Content-Type':'application/json' }
      })
      const responseData = await readJson(openAIResponse)
      if (!openAIResponse.ok) return json({ error:responseData?.error?.message || `OpenAI status check failed (${openAIResponse.status}).` },openAIResponse.status)

      const status = safeString(responseData?.status) || 'in_progress'
      if (status !== 'completed') {
        const detail = responseData?.error?.message || responseData?.incomplete_details?.reason || ''
        return json({ status, error:detail })
      }

      const outputText = extractOutputText(responseData)
      if (!outputText) return json({ status:'failed', error:'The completed OpenAI response contained no structured report content.' },502)
      try { return json({ status:'completed', report:JSON.parse(outputText) }) }
      catch { return json({ status:'failed', error:'The completed model response could not be parsed as report JSON.' },502) }
    }

    if (request.method !== 'POST') return json({ error:'Method not allowed.' },405)

    const body = await request.json()
    const fileName = safeString(body.fileName)
    const mimeType = safeString(body.mimeType) || 'text/plain'
    const textContent = typeof body.textContent === 'string' ? body.textContent : ''
    const base64Data = typeof body.base64Data === 'string' ? body.base64Data : ''
    if (!fileName || (!textContent && !base64Data)) return json({ error:'No readable source file was provided.' },400)
    if (textContent.length > 3_000_000 || base64Data.length > 5_700_000) return json({ error:'The source is too large for this function. Keep the original upload under about 4 MB.' },413)

    const content = [{ type:'input_text', text:`Convert the source named “${fileName}” into the complete Herohub Talent Development Roadmap report schema. This is expected to use the standardized recurring roadmap format. Do not omit individual development calendars or monthly rows.\n\n${textContent ? `SOURCE TEXT:\n${textContent}` : 'The PDF is attached as the input file.'}` }]
    if (base64Data) content.push({ type:'input_file', filename:fileName, file_data:`data:${mimeType};base64,${base64Data}` })

    const openAIResponse = await fetch(OPENAI_URL, {
      method:'POST',
      headers:{ Authorization:`Bearer ${apiKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
        instructions,
        input:[{ role:'user', content }],
        text:{ format:{ type:'json_schema', name:'herohub_talent_development_roadmap', strict:true, schema:REPORT_SCHEMA } },
        max_output_tokens:60000,
        background:true,
        store:true
      })
    })

    const responseData = await readJson(openAIResponse)
    if (!openAIResponse.ok) return json({ error:responseData?.error?.message || 'OpenAI report generation could not start.' },openAIResponse.status)
    const responseId = safeString(responseData?.id)
    if (!responseId) return json({ error:'OpenAI did not return a response ID for the background report job.' },502)
    return json({ responseId, status:safeString(responseData?.status) || 'queued' },202)
  } catch(error) {
    console.error('generate-report error',error)
    return json({ error:error instanceof Error ? error.message : 'Unexpected report generation error.' },500)
  }
}

export const config = {
  path:'/api/generate-report'
}

async function readJson(response) {
  const raw = await response.text()
  try { return raw ? JSON.parse(raw) : {} }
  catch { return { error:{ message:`OpenAI returned a non-JSON response (HTTP ${response.status}).` } } }
}

function extractOutputText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) return data.output_text
  for (const item of data?.output || []) for (const part of item?.content || []) {
    if (part?.type === 'output_text' && typeof part.text === 'string') return part.text
    if (typeof part?.text === 'string' && part.text.trim().startsWith('{')) return part.text
  }
  return ''
}
function safeString(value){ return typeof value === 'string' ? value.trim() : '' }
function json(payload,status=200){ return new Response(JSON.stringify(payload),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}}) }
