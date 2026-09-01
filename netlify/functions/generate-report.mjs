const OPENAI_URL = 'https://api.openai.com/v1/responses'

const stringArray = { type: 'array', items: { type: 'string' } }
const objArray = (required, properties) => ({ type: 'array', items: { type: 'object', additionalProperties: false, required, properties } })

const REPORT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: [
    'reportTitle','reportSubtitle','profile','purpose','executiveStrongTeam','executiveOpportunities','executiveRisks',
    'strategicPriorities','successDefinition','assessmentSnapshot','talentSnapshot','roleReadinessGaps','employeeAssignments',
    'programAssignmentLogic','roadmap','iqCadence','individualCalendars','first30Days','scorecard','decisionsDependencies','sourceNotes'
  ],
  properties: {
    reportTitle: { type:'string' }, reportSubtitle:{ type:'string' },
    profile: { type:'object', additionalProperties:false, required:['name','period','locations','employees','brands','dealerPrincipal','generalManager','assessmentDate'], properties:{
      name:{type:'string'}, period:{type:'string'}, locations:{type:'string'}, employees:{type:'string'}, brands:stringArray,
      dealerPrincipal:{type:'string'}, generalManager:{type:'string'}, assessmentDate:{type:'string'}
    }},
    purpose:{type:'string'}, executiveStrongTeam:{type:'string'}, executiveOpportunities:{type:'string'}, executiveRisks:{type:'string'},
    strategicPriorities:stringArray, successDefinition:{type:'string'},
    assessmentSnapshot: objArray(['area','evidence'], { area:{type:'string'}, evidence:{type:'string'} }),
    talentSnapshot: objArray(['name','role','observedAsset','developmentNeed','successionRelevance','urgency'], {
      name:{type:'string'}, role:{type:'string'}, observedAsset:{type:'string'}, developmentNeed:{type:'string'}, successionRelevance:{type:'string'}, urgency:{type:'string'}
    }),
    roleReadinessGaps:stringArray,
    employeeAssignments: objArray(['name','role','objective','herohubU','herohubIQ','programs','cadence','evidence'], {
      name:{type:'string'}, role:{type:'string'}, objective:{type:'string'}, herohubU:{type:'string'}, herohubIQ:{type:'string'}, programs:{type:'string'}, cadence:{type:'string'}, evidence:{type:'string'}
    }),
    programAssignmentLogic:stringArray,
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

const instructions = `You are the Herohub Talent Development Roadmap Report Editor.

The uploaded source will normally follow the standardized HERohub Talent Development Roadmap format. Map it into the JSON schema by recognizing these recurring source sections when present:
1. Cover / Purpose / roadmap date range
2. Executive Summary, including A Strong Team to Build On, Highest-Value Opportunities, Material Gaps and Risks, Five Strategic Priorities, and Assessment Snapshot
3. Talent and Succession Snapshot plus Role and Readiness Gaps
4. Employee Development Assignment Matrix plus Program Assignment Logic
5. Dealership-Wide 12-Month Roadmap plus HerohubIQ Cadence
6. One or more INDIVIDUAL DEVELOPMENT CALENDAR pages. Each calendar has person, role, primary objective, manager/coach, and month rows with Capacity, HerohubU/Bootcamp/Basecamp/role development, HerohubIQ, and Manager reinforcement & evidence.
7. First 30 Days | Launch Plan
8. Scorecard and Governance
9. Decisions and Dependencies
10. Source and Planning Notes

SOURCE FIDELITY RULES:
- Treat the uploaded document as the authoritative source. Do not invent, infer, or normalize facts beyond what it states.
- Preserve names, roles, dates, program names/numbers, timing, conditions, owners, cadence, evidence, DMS references, and caveats exactly in substance.
- Preserve conditional language such as optional, recommended, required, subject to confirmation, only if, no aligned Pathway, not applicable, no performance gain guaranteed, and no invented targets.
- If a field is not supported by the source, return an empty string or empty array rather than guessing.
- Do not assign a successor, development path, program, KPI target, performance problem, or customer-facing role unless the source supports it.
- Do not turn aggregate assessment percentages into individual conclusions.
- Keep every individual calendar found in the source and preserve all source month rows in chronological order. Do not summarize away months.
- Keep every employee assignment row found in the Employee Development Assignment Matrix.
- Keep all 12 dealership-wide roadmap months when present.

EDITORIAL RULES:
- Lightly clean PDF extraction artifacts and broken line wraps, but do not materially rewrite source meaning.
- executiveStrongTeam should represent the source's “A Strong Team to Build On” section.
- executiveOpportunities should represent “Highest-Value Opportunities.”
- executiveRisks should represent “Material Gaps and Risks.”
- strategicPriorities should preserve the stated five strategic priorities as separate items when present.
- successDefinition should use the source's one-year success definition from the assessment snapshot or equivalent language.
- assessmentSnapshot should preserve the source's assessment area/evidence rows.
- talentSnapshot should preserve the source's Person/role, Observed asset, Development need, Succession relevance, Urgency columns.
- employeeAssignments should preserve the matrix columns: Employee, Current role, Primary objective, HerohubU, HerohubIQ, Bootcamp/Basecamp, Manager cadence, Success evidence.
- roadmap should preserve Month, Season/capacity, Theme/outcome, Required actions and Herohub programs, Participants, Completion evidence.
- individualCalendars should preserve each person exactly once and every monthly row.
- first30Days and scorecard should preserve all source rows.
- decisionsDependencies should include every bullet in that section, including bullets that continue onto a later page.
- sourceNotes should include the Source and Planning Notes plus material caveats elsewhere that affect interpretation.

Use the source title and date range when present.`

export default async (request) => {
  if (request.method !== 'POST') return json({ error:'Method not allowed.' },405)
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return json({ error:'OPENAI_API_KEY is not configured in Netlify environment variables.' },500)

  try {
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
      method:'POST', headers:{ Authorization:`Bearer ${apiKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
        instructions,
        input:[{ role:'user', content }],
        text:{ format:{ type:'json_schema', name:'herohub_talent_development_roadmap', strict:true, schema:REPORT_SCHEMA } },
        max_output_tokens: 40000
      })
    })

    const responseData = await openAIResponse.json()
    if (!openAIResponse.ok) return json({ error:responseData?.error?.message || 'OpenAI report generation failed.' }, openAIResponse.status)
    const outputText = extractOutputText(responseData)
    if (!outputText) return json({ error:'The model returned no structured report content.' },502)
    try { return json({ report:JSON.parse(outputText) }) } catch { return json({ error:'The model response could not be parsed as report JSON.' },502) }
  } catch(error) {
    console.error('generate-report error',error)
    return json({ error:error instanceof Error ? error.message : 'Unexpected report generation error.' },500)
  }
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
