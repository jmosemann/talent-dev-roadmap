import { useMemo, useRef, useState } from 'react'
import { sampleReport } from './sampleReport'
import type { HerohubReport, RoadmapMonth } from './types'

type ViewMode = 'preview' | 'json'

const quarters = [
  { label: 'Q1', title: 'Establish the Operating System' },
  { label: 'Q2', title: 'Build Profitability + Independence' },
  { label: 'Q3', title: 'Strengthen Departments + Prepare for Peak' },
  { label: 'Q4', title: 'Execute, Test + Reset' },
]

function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className={`logo-wrap ${inverted ? 'logo-wrap--inverted' : ''}`}>
      <img src="/herohub-logo.svg" alt="Herohub" />
    </div>
  )
}

function Page({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`report-page ${className}`}>{children}</section>
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>
}

function SectionTitle({ number, title, intro }: { number?: string; title: string; intro?: string }) {
  return (
    <div className="section-title-block">
      <div>
        {number && <span className="section-number">{number}</span>}
        <h2>{title}</h2>
      </div>
      {intro && <p>{intro}</p>}
    </div>
  )
}

function Badge({ children, tone = 'teal' }: { children: React.ReactNode; tone?: 'teal' | 'navy' | 'lime' | 'muted' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

function ReportPreview({ report }: { report: HerohubReport }) {
  const roadmapGroups = useMemo(() => {
    const groups: RoadmapMonth[][] = []
    for (let i = 0; i < report.roadmap.length; i += 3) groups.push(report.roadmap.slice(i, i + 3))
    return groups
  }, [report.roadmap])

  return (
    <main className="report-document" id="report-document">
      <Page className="cover-page">
        <div className="cover-top"><Logo inverted /></div>
        <div className="cover-rule" />
        <div className="cover-content">
          <Eyebrow>Talent + Operating Roadmap</Eyebrow>
          <h1>{report.profile.name}</h1>
          <h3>{report.reportSubtitle}</h3>
        </div>
        <div className="cover-footer">
          <div><strong>Planning Horizon</strong><span>{report.profile.planningHorizon}</span></div>
          <div><strong>Roadmap Start</strong><span>{report.profile.roadmapStart}</span></div>
          <div><strong>Prepared by</strong><span>Herohub</span></div>
        </div>
      </Page>

      <Page>
        <div className="page-brand"><Logo /></div>
        <SectionTitle number="01" title="Executive Planning Frame" intro={report.purpose} />
        <div className="metric-grid">
          <div className="metric-card"><strong>{report.profile.locations}</strong><span>Location{report.profile.locations === '1' ? '' : 's'}</span></div>
          <div className="metric-card"><strong>{report.profile.employees}</strong><span>Employees</span></div>
          <div className="metric-card"><strong>{report.profile.brands.length}</strong><span>OEM Brands</span></div>
          <div className="metric-card"><strong>{report.profile.planningHorizon}</strong><span>Planning Horizon</span></div>
        </div>
        <div className="profile-grid">
          <div><span>Dealer Principal</span><strong>{report.profile.dealerPrincipal || 'Not specified'}</strong></div>
          <div><span>General Manager</span><strong>{report.profile.generalManager || 'Not specified'}</strong></div>
          <div className="profile-grid__wide"><span>Brands / OEMs</span><strong>{report.profile.brands.join(' · ')}</strong></div>
        </div>
        <div className="quote-panel">
          <Eyebrow>Primary One-Year Success Definition</Eyebrow>
          <blockquote>“{report.successDefinition}”</blockquote>
        </div>
        <div className="strategic-aim">
          <span>The Strategic Aim</span>
          <strong>{report.strategicAim}</strong>
        </div>
      </Page>

      <Page>
        <div className="page-brand"><Logo /></div>
        <SectionTitle number="02" title="Executive Summary" intro={report.executiveSummary} />
        <div className="priority-grid">
          {report.priorities.map((priority, index) => (
            <div className="priority-card" key={priority}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{priority}</strong>
            </div>
          ))}
        </div>
        <div className="leadership-read">
          <Eyebrow>Leadership Read</Eyebrow>
          <p>{report.leadershipRead}</p>
        </div>
        {report.sourceNotes.length > 0 && (
          <div className="source-note">
            <strong>Source Note</strong>
            <p>{report.sourceNotes.join(' ')}</p>
          </div>
        )}
      </Page>

      <Page>
        <div className="page-brand"><Logo /></div>
        <SectionTitle number="03" title="Strengths + Highest-Value Opportunities" />
        <div className="strength-grid">
          {report.strengths.map((strength, index) => (
            <article className="strength-card" key={`${strength.title}-${index}`}>
              <span className="strength-index">0{index + 1}</span>
              <h3>{strength.title}</h3>
              <p>{strength.fact}</p>
              <div><span>Opportunity</span><strong>{strength.opportunity}</strong></div>
            </article>
          ))}
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Priority</th><th>Required Business Change</th><th>Urgency</th></tr></thead>
            <tbody>
              {report.opportunities.map((item) => (
                <tr key={item.title}>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.businessChange}</td>
                  <td><Badge tone={item.priority === 'REQUIRED' ? 'teal' : item.priority === 'RECOMMENDED' ? 'navy' : 'muted'}>{item.priority}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Page>

      <Page>
        <div className="page-brand"><Logo /></div>
        <SectionTitle number="04" title="Talent + Leadership Development" intro="Development assignments translate dealership priorities into clear leadership and employee expectations." />
        <div className="leader-grid">
          {report.leaders.slice(0, 6).map((leader) => (
            <article className="leader-card" key={`${leader.name}-${leader.role}`}>
              <div className="leader-card__header"><div><h3>{leader.name}</h3><span>{leader.role}</span></div>{leader.decisionGate && <Badge tone="lime">Decision Gate</Badge>}</div>
              {leader.decisionGate && <p className="decision-gate">{leader.decisionGate}</p>}
              <dl>
                <div><dt>Primary Objective</dt><dd>{leader.objective}</dd></div>
                <div><dt>Development</dt><dd>{leader.development}</dd></div>
                <div><dt>Manager Cadence</dt><dd>{leader.cadence}</dd></div>
                <div><dt>Success Evidence</dt><dd>{leader.evidence}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </Page>

      {report.leaders.length > 6 && (
        <Page>
          <div className="page-brand"><Logo /></div>
          <SectionTitle number="05" title="Employee Development Assignments" />
          <div className="leader-grid leader-grid--compact">
            {report.leaders.slice(6).map((leader) => (
              <article className="leader-card" key={`${leader.name}-${leader.role}`}>
                <div className="leader-card__header"><div><h3>{leader.name}</h3><span>{leader.role}</span></div></div>
                <dl>
                  <div><dt>Primary Objective</dt><dd>{leader.objective}</dd></div>
                  <div><dt>Development</dt><dd>{leader.development}</dd></div>
                  <div><dt>Cadence</dt><dd>{leader.cadence}</dd></div>
                  <div><dt>Evidence</dt><dd>{leader.evidence}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </Page>
      )}

      <Page>
        <div className="page-brand"><Logo /></div>
        <SectionTitle number="06" title="Annual Capacity Map" intro="Development intensity should flex with dealership workload. Source assumptions should remain visibly labeled until validated." />
        <div className="capacity-grid">
          {report.capacity.map((item) => {
            const cls = item.classification.toLowerCase()
            const tone = cls.includes('development') ? 'development' : cls.includes('peak') && !cls.includes('shoulder') ? 'peak' : 'shoulder'
            return (
              <article className={`capacity-card capacity-card--${tone}`} key={item.month}>
                <span className="capacity-card__month">{item.month}</span>
                <strong>{item.classification}</strong>
                <p>{item.focus}</p>
                <div>{item.capacity}</div>
              </article>
            )
          })}
        </div>
        <div className="capacity-legend"><span><i className="dot dot--peak" />Peak / protect revenue</span><span><i className="dot dot--shoulder" />Shoulder / moderate development</span><span><i className="dot dot--development" />Development / higher capacity</span></div>
      </Page>

      {roadmapGroups.map((group, groupIndex) => (
        <Page key={`roadmap-${groupIndex}`}>
          <div className="page-brand"><Logo /></div>
          <SectionTitle number={String(7 + groupIndex).padStart(2, '0')} title={`${quarters[groupIndex]?.label ?? `Phase ${groupIndex + 1}`} — ${quarters[groupIndex]?.title ?? 'Roadmap'}`} />
          <div className="roadmap-stack">
            {group.map((month, index) => (
              <article className="month-card" key={`${month.month}-${month.title}`}>
                <div className="month-card__rail">
                  <span>MONTH {String(groupIndex * 3 + index + 1).padStart(2, '0')}</span>
                  <strong>{month.month}</strong>
                  <Badge tone="navy">{month.classification}</Badge>
                </div>
                <div className="month-card__body">
                  <div className="month-card__heading"><div><h3>{month.title}</h3><p>{month.objective}</p></div><div className="owner"><span>Owner</span><strong>{month.owner}</strong></div></div>
                  <div className="month-card__columns">
                    <div><span className="mini-label">Key Actions</span><ul>{month.actions.map((x) => <li key={x}>{x}</li>)}</ul></div>
                    <div><span className="mini-label">Completion Evidence</span><ul>{month.evidence.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  </div>
                  {month.developmentSupport.length > 0 && <div className="support-line"><strong>Development Support</strong><span>{month.developmentSupport.join(' · ')}</span></div>}
                </div>
              </article>
            ))}
          </div>
        </Page>
      ))}

      <Page>
        <div className="page-brand"><Logo /></div>
        <SectionTitle number="11" title="First 30 Days" intro="Convert the roadmap into immediate ownership, cadence, and completion evidence." />
        <div className="timeline-list">
          {report.first30Days.map((item, index) => (
            <div className="timeline-row" key={`${item.action}-${index}`}>
              <span className="timeline-index">{String(index + 1).padStart(2, '0')}</span>
              <div><Badge tone="teal">{item.timing}</Badge><strong>{item.action}</strong></div>
              <div><span>Owner</span><strong>{item.owner}</strong></div>
              <div><span>Completion Evidence</span><strong>{item.evidence}</strong></div>
            </div>
          ))}
        </div>
      </Page>

      <Page>
        <div className="page-brand"><Logo /></div>
        <SectionTitle number="12" title="Management Scorecard + Governance" />
        <div className="scorecard-grid">
          {report.scorecard.map((item) => (
            <article className="scorecard-card" key={item.area}>
              <span>{item.area}</span>
              <strong>{item.indicator}</strong>
              <div>Owner · {item.owner}</div>
            </article>
          ))}
        </div>
        <div className="questions-panel">
          <Eyebrow>Quarterly Review Questions</Eyebrow>
          <ol>{report.quarterlyQuestions.map((q) => <li key={q}>{q}</li>)}</ol>
        </div>
      </Page>

      <Page>
        <div className="page-brand"><Logo /></div>
        <SectionTitle number="13" title="Decisions + Dependencies" />
        <div className="table-wrap table-wrap--large">
          <table>
            <thead><tr><th>Decision</th><th>Owner</th><th>Timing</th><th>Evidence Needed</th></tr></thead>
            <tbody>{report.decisions.map((item) => <tr key={item.decision}><td><strong>{item.decision}</strong></td><td>{item.owner}</td><td>{item.timing}</td><td>{item.evidence}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="outcome-box">
          <Eyebrow>What good looks like</Eyebrow>
          <p>Every critical operating decision has a named owner, a timing expectation, and visible evidence of completion.</p>
        </div>
      </Page>

      <Page className="closing-page">
        <div className="closing-top"><Logo inverted /></div>
        <div className="closing-content">
          <Eyebrow>12-Month Outcome</Eyebrow>
          <h2>Twelve months from now, {report.profile.name} should have:</h2>
          <div className="outcome-list">
            {report.finalOutcomes.map((outcome, index) => <div key={outcome}><span>{String(index + 1).padStart(2, '0')}</span><strong>{outcome}</strong></div>)}
          </div>
        </div>
        <div className="closing-statement">
          <span>The Bottom Line</span>
          <strong>{report.closingStatement}</strong>
        </div>
      </Page>
    </main>
  )
}

export default function App() {
  const [report, setReport] = useState<HerohubReport | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [jsonDraft, setJsonDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function showSample() {
    setReport(sampleReport)
    setJsonDraft(JSON.stringify(sampleReport, null, 2))
    setViewMode('preview')
    setError('')
    setTimeout(() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }), 20)
  }

  async function generateReport() {
    if (!selectedFile) return
    setError('')
    setIsGenerating(true)
    try {
      const isText = selectedFile.type.startsWith('text/') || /\.(md|txt)$/i.test(selectedFile.name)
      if (selectedFile.size > 3 * 1024 * 1024) throw new Error('Please keep uploads under 3 MB for this v1 package.')

      const payload: Record<string, string> = {
        fileName: selectedFile.name,
        mimeType: selectedFile.type || (isText ? 'text/plain' : 'application/pdf'),
      }

      if (isText) {
        payload.textContent = await selectedFile.text()
      } else {
        payload.base64Data = await fileToBase64(selectedFile)
      }

      const response = await fetch('/.netlify/functions/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Report generation failed.')
      setReport(result.report)
      setJsonDraft(JSON.stringify(result.report, null, 2))
      setViewMode('preview')
      setTimeout(() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }), 20)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsGenerating(false)
    }
  }

  function applyJson() {
    try {
      const parsed = JSON.parse(jsonDraft) as HerohubReport
      setReport(parsed)
      setViewMode('preview')
      setError('')
    } catch {
      setError('The JSON is not valid yet. Fix the highlighted syntax issue in your editor and try Apply again.')
    }
  }

  function openJsonEditor() {
    if (!report) return
    setJsonDraft(JSON.stringify(report, null, 2))
    setViewMode('json')
  }

  function downloadJson() {
    if (!report) return
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug(report.profile.name)}-herohub-roadmap.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <header className="app-header no-print">
        <Logo />
        <div className="app-header__title"><strong>Roadmap Builder</strong><span>Herohub report generation</span></div>
      </header>

      <section className="hero no-print">
        <div className="hero-copy">
          <Eyebrow>Herohub Report Studio</Eyebrow>
          <h1>Turn a dealership roadmap into a polished executive report.</h1>
          <p>Upload a Markdown, TXT, or PDF source. The app extracts the content into a fixed Herohub schema, applies the branded report design, and lets you review the JSON before exporting to PDF.</p>
          <div className="brand-chips"><span>#00BFB3</span><span>#131515</span><span>#20364E</span><span>#00766E</span><span>#D8F1A0</span></div>
        </div>
        <div className="upload-card">
          <input ref={inputRef} type="file" accept=".md,.txt,.pdf,text/markdown,text/plain,application/pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} hidden />
          <button className="drop-zone" onClick={() => inputRef.current?.click()}>
            <span className="upload-icon">↑</span>
            <strong>{selectedFile ? selectedFile.name : 'Choose a roadmap or assessment'}</strong>
            <small>{selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : 'Markdown, TXT or PDF · max 3 MB'}</small>
          </button>
          <button className="primary-button" onClick={generateReport} disabled={!selectedFile || isGenerating}>{isGenerating ? 'Building Herohub report…' : 'Generate Report'}</button>
          <div className="or"><span />or<span /></div>
          <button className="secondary-button" onClick={showSample}>Preview Included Sample</button>
          {error && <div className="error-box">{error}</div>}
        </div>
      </section>

      {report && (
        <section className="workspace" id="workspace">
          <div className="toolbar no-print">
            <div className="toolbar__left"><strong>{report.profile.name}</strong><span>{report.reportSubtitle}</span></div>
            <div className="toolbar__actions">
              {viewMode === 'preview' ? <button onClick={openJsonEditor}>Edit JSON</button> : <button onClick={() => setViewMode('preview')}>Back to Preview</button>}
              <button onClick={downloadJson}>Download JSON</button>
              <button className="toolbar__print" onClick={() => window.print()}>Print / Save PDF</button>
            </div>
          </div>
          {error && <div className="workspace-error no-print">{error}</div>}
          {viewMode === 'json' ? (
            <div className="json-editor no-print">
              <div><h2>Edit structured report</h2><p>Change any wording, owner, action, priority, or section content. The report preview updates after you apply valid JSON.</p></div>
              <textarea value={jsonDraft} onChange={(e) => setJsonDraft(e.target.value)} spellCheck={false} />
              <div className="json-actions"><button onClick={() => setViewMode('preview')}>Cancel</button><button className="primary-button" onClick={applyJson}>Apply Changes</button></div>
            </div>
          ) : <ReportPreview report={report} />}
        </section>
      )}

      <footer className="app-footer no-print"><Logo /><span>Herohub Roadmap Builder · v1</span></footer>
    </div>
  )
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      resolve(result.includes(',') ? result.split(',')[1] : result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
