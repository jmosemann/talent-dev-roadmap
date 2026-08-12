const OPENAI_URL = 'https://api.openai.com/v1/responses'

const stringArray = { type: 'array', items: { type: 'string' } }

const REPORT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'reportTitle', 'reportSubtitle', 'profile', 'purpose', 'successDefinition', 'strategicAim',
    'executiveSummary', 'priorities', 'leadershipRead', 'strengths', 'opportunities', 'leaders',
    'capacity', 'roadmap', 'first30Days', 'scorecard', 'quarterlyQuestions', 'decisions',
    'finalOutcomes', 'closingStatement', 'sourceNotes'
  ],
  properties: {
    reportTitle: { type: 'string' },
    reportSubtitle: { type: 'string' },
    profile: {
      type: 'object', additionalProperties: false,
      required: ['name', 'brands', 'locations', 'employees', 'dealerPrincipal', 'generalManager', 'planningHorizon', 'roadmapStart'],
      properties: {
        name: { type: 'string' },
        brands: stringArray,
        locations: { type: 'string' },
        employees: { type: 'string' },
        dealerPrincipal: { type: 'string' },
        generalManager: { type: 'string' },
        planningHorizon: { type: 'string' },
        roadmapStart: { type: 'string' }
      }
    },
    purpose: { type: 'string' },
    successDefinition: { type: 'string' },
    strategicAim: { type: 'string' },
    executiveSummary: { type: 'string' },
    priorities: stringArray,
    leadershipRead: { type: 'string' },
    strengths: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['title', 'fact', 'opportunity'],
        properties: { title: { type: 'string' }, fact: { type: 'string' }, opportunity: { type: 'string' } }
      }
    },
    opportunities: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['title', 'businessChange', 'priority'],
        properties: {
          title: { type: 'string' },
          businessChange: { type: 'string' },
          priority: { type: 'string', enum: ['REQUIRED', 'RECOMMENDED', 'OPTIONAL'] }
        }
      }
    },
    leaders: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['name', 'role', 'objective', 'development', 'cadence', 'evidence', 'decisionGate'],
        properties: {
          name: { type: 'string' }, role: { type: 'string' }, objective: { type: 'string' },
          development: { type: 'string' }, cadence: { type: 'string' }, evidence: { type: 'string' }, decisionGate: { type: 'string' }
        }
      }
    },
    capacity: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['month', 'classification', 'focus', 'capacity'],
        properties: { month: { type: 'string' }, classification: { type: 'string' }, focus: { type: 'string' }, capacity: { type: 'string' } }
      }
    },
    roadmap: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['month', 'title', 'classification', 'objective', 'owner', 'actions', 'evidence', 'developmentSupport'],
        properties: {
          month: { type: 'string' }, title: { type: 'string' }, classification: { type: 'string' },
          objective: { type: 'string' }, owner: { type: 'string' }, actions: stringArray, evidence: stringArray, developmentSupport: stringArray
        }
      }
    },
    first30Days: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['timing', 'action', 'owner', 'evidence'],
        properties: { timing: { type: 'string' }, action: { type: 'string' }, owner: { type: 'string' }, evidence: { type: 'string' } }
      }
    },
    scorecard: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['area', 'indicator', 'owner'],
        properties: { area: { type: 'string' }, indicator: { type: 'string' }, owner: { type: 'string' } }
      }
    },
    quarterlyQuestions: stringArray,
    decisions: {
      type: 'array', items: {
        type: 'object', additionalProperties: false,
        required: ['decision', 'owner', 'timing', 'evidence'],
        properties: { decision: { type: 'string' }, owner: { type: 'string' }, timing: { type: 'string' }, evidence: { type: 'string' } }
      }
    },
    finalOutcomes: stringArray,
    closingStatement: { type: 'string' },
    sourceNotes: stringArray
  }
}

const instructions = `You are the Herohub Roadmap Report Editor. Convert the uploaded dealership roadmap, assessment, or planning document into the supplied structured report schema.

SOURCE FIDELITY RULES:
- Use only facts, names, roles, dates, objectives, assignments, owners, evidence, and priorities supported by the source.
- Do not invent KPIs, financial results, employee names, deadlines, owners, brands, or dealership facts.
- If a field is not supported, use an empty string or empty array rather than guessing.
- Preserve explicit assumptions as assumptions. Put material caveats in sourceNotes and retain words such as assumption, estimated, or to be validated when the source uses them.
- Preserve decision gates as open questions. Do not convert an evaluation or observation into a conclusion.
- Preserve the source's terminology for Herohub products and dealership roles.

EDITORIAL RULES:
- Write polished, concise executive prose without changing the factual meaning.
- executiveSummary should be 2-4 sentences and distinct from leadershipRead.
- leadershipRead should be a clear executive interpretation grounded in the source, normally 1-2 sentences.
- strategicAim should summarize the desired business state, not introduce new facts.
- strengths should capture meaningful existing advantages plus their stated or directly supported opportunity.
- opportunities should use REQUIRED only when the source identifies the item as required/critical/mandatory; otherwise use RECOMMENDED or OPTIONAL based on the source.
- leaders should include leadership and employee development assignments that appear in the source. decisionGate must be empty unless the source explicitly calls for a decision/evaluation.
- roadmap should preserve chronological order and source month names.
- finalOutcomes should reflect the source's stated end-state.
- closingStatement should preserve the source's core framing and may lightly polish wording.

REPORT TITLE:
Use the source title when present. If the source clearly represents a Herohub talent/operating roadmap but has no explicit title, use "Herohub Talent & Operating Roadmap".`

export default async (request) => {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405)
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return json({ error: 'OPENAI_API_KEY is not configured in Netlify environment variables.' }, 500)
  }

  try {
    const body = await request.json()
    const fileName = safeString(body.fileName)
    const mimeType = safeString(body.mimeType) || 'text/plain'
    const textContent = typeof body.textContent === 'string' ? body.textContent : ''
    const base64Data = typeof body.base64Data === 'string' ? body.base64Data : ''

    if (!fileName || (!textContent && !base64Data)) {
      return json({ error: 'No readable source file was provided.' }, 400)
    }

    if (textContent.length > 2_500_000 || base64Data.length > 4_500_000) {
      return json({ error: 'The source is too large for this v1 function. Keep the original file under about 3 MB.' }, 413)
    }

    const content = [
      {
        type: 'input_text',
        text: `Create the Herohub structured report from the source named "${fileName}". Preserve all source-supported caveats and assumptions.\n\n${textContent ? `SOURCE TEXT:\n${textContent}` : 'The source document is attached as an input file.'}`
      }
    ]

    if (base64Data) {
      content.push({
        type: 'input_file',
        filename: fileName,
        file_data: `data:${mimeType};base64,${base64Data}`
      })
    }

    const openAIResponse = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        instructions,
        input: [{ role: 'user', content }],
        text: {
          format: {
            type: 'json_schema',
            name: 'herohub_roadmap_report',
            strict: true,
            schema: REPORT_SCHEMA
          }
        },
        max_output_tokens: 18000
      })
    })

    const responseData = await openAIResponse.json()

    if (!openAIResponse.ok) {
      const detail = responseData?.error?.message || 'OpenAI report generation failed.'
      return json({ error: detail }, openAIResponse.status)
    }

    const outputText = extractOutputText(responseData)
    if (!outputText) {
      return json({ error: 'The model returned no structured report content.' }, 502)
    }

    let report
    try {
      report = JSON.parse(outputText)
    } catch {
      return json({ error: 'The model response could not be parsed as report JSON.' }, 502)
    }

    return json({ report })
  } catch (error) {
    console.error('generate-report error', error)
    return json({ error: error instanceof Error ? error.message : 'Unexpected report generation error.' }, 500)
  }
}

function extractOutputText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) return data.output_text
  for (const item of data?.output || []) {
    for (const part of item?.content || []) {
      if (part?.type === 'output_text' && typeof part.text === 'string') return part.text
      if (typeof part?.text === 'string' && part.text.trim().startsWith('{')) return part.text
    }
  }
  return ''
}

function safeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  })
}
