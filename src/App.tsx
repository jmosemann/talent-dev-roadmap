import { useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { sampleReport } from './sampleReport'
import type { HerohubReport } from './types'

type ViewMode = 'preview' | 'json'

function stripLeadingListNumber(value: string) {
  return value.replace(/^\s*(?:\d+\s*[.)]\s*)+/, '').trim()
}

function Logo() {
  return <div className="logo-wrap"><img src="/herohub-logo.svg" alt="Herohub" /></div>
}

function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`report-page ${className}`}>{children}</section>
}

function Brand() { return <div className="page-brand"><Logo /></div> }
function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow">{children}</div> }
function SectionTitle({ title, intro }: { title: string; intro?: string }) {
  return <div className={`section-title-block ${intro ? '' : 'section-title-block--solo'}`}>
    <div><h2>{title}</h2></div>
    {intro && <p>{intro}</p>}
  </div>
}

function TextSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="source-section"><h3>{title}</h3><div>{children}</div></section>
}

function ReportPreview({ report }: { report: HerohubReport }) {
  const assignmentPages = chunk(report.employeeAssignments, 6)
  const roadmapPages = chunk(report.roadmap, 6)
  const preparedFrom = report.preparedFrom || (report.profile.assessmentDate ? `Prepared from the ${report.profile.assessmentDate} Talent Development Assessment` : 'Prepared by Herohub')

  return <main className="report-document" id="report-document">
    <Page className="cover-page">
      <div className="cover-top"><Logo /></div>
      <div className="cover-content">
        <Eyebrow>Herohub Unlimited</Eyebrow>
        <h1>{report.profile.name}</h1>
        <h3>{report.reportTitle || report.reportSubtitle || '12-Month Talent Development Roadmap'}</h3>
        <p>{report.profile.period}</p>
      </div>
      <div className="cover-purpose"><span>Purpose</span><strong>{report.purpose}</strong></div>
      <div className="cover-footer"><span>{preparedFrom}</span></div>
    </Page>

    <Page><Brand />
      <SectionTitle title="Executive Summary" />
      <TextSection title="A Strong Team to Build On"><p>{report.executiveStrongTeam}</p></TextSection>
      <TextSection title="Highest-Value Opportunities"><p>{report.executiveOpportunities}</p></TextSection>
      <TextSection title="Material Gaps and Risks"><p>{report.executiveRisks}</p></TextSection>
      {report.strategicPriorities.length > 0 && <TextSection title="Five Strategic Priorities">
        <ol className="priority-list">{report.strategicPriorities.map((item, index) => <li key={`${index}-${item}`}>{stripLeadingListNumber(item)}</li>)}</ol>
      </TextSection>}
      <h3 className="subsection-heading subsection-heading--compact">Assessment Snapshot</h3>
      <div className="table-wrap assessment-table"><table><thead><tr><th>Assessment Area</th><th>Evidence</th></tr></thead><tbody>
        {report.assessmentSnapshot.map(item => <tr key={item.area}><td><strong>{item.area}</strong></td><td>{item.evidence}</td></tr>)}
      </tbody></table></div>
    </Page>

    <Page><Brand />
      <SectionTitle title="Talent and Succession Snapshot" />
      <div className="table-wrap talent-table"><table><thead><tr><th>Person / Role</th><th>Observed Asset</th><th>Development Need</th><th>Succession Relevance</th><th>Urgency</th></tr></thead><tbody>
        {report.talentSnapshot.map(item => <tr key={`${item.name}-${item.role}`}><td><strong>{item.name}</strong><span className="cell-sub">{item.role}</span></td><td>{item.observedAsset}</td><td>{item.developmentNeed}</td><td>{item.successionRelevance}</td><td>{item.urgency}</td></tr>)}
      </tbody></table></div>
      <h3 className="subsection-heading">Role and Readiness Gaps</h3>
      <ul className="source-bullets">{report.roleReadinessGaps.map(x => <li key={x}>{x}</li>)}</ul>
    </Page>

    {assignmentPages.map((items, pageIndex) => <Page key={`assign-${pageIndex}`}><Brand />
      <SectionTitle title={pageIndex === 0 ? 'Employee Development Assignment Matrix' : 'Employee Development Assignment Matrix — Continued'} />
      <div className="table-wrap assignment-table"><table><thead><tr>
        <th>Employee</th><th>Current Role</th><th>Primary Objective</th><th>HerohubU</th><th>HerohubIQ</th><th>Bootcamp / Basecamp</th><th>Manager Cadence</th><th>Success Evidence</th>
      </tr></thead><tbody>
        {items.map(item => <tr key={`${item.name}-${item.role}`}><td><strong>{item.name}</strong></td><td>{item.role}</td><td>{item.objective}</td><td>{item.herohubU}</td><td>{item.herohubIQ}</td><td>{item.programs}</td><td>{item.cadence}</td><td>{item.evidence}</td></tr>)}
      </tbody></table></div>
      {pageIndex === assignmentPages.length - 1 && (report.programAssignmentIntro || report.programAssignmentLogic.length > 0) && <div className="source-note-block">
        <h3>Program Assignment Logic</h3>
        {report.programAssignmentIntro && <p>{report.programAssignmentIntro}</p>}
        <ul>{report.programAssignmentLogic.map(x => <li key={x}>{x}</li>)}</ul>
      </div>}
    </Page>)}

    {roadmapPages.map((months, pageIndex) => <Page key={`roadmap-${pageIndex}`}><Brand />
      <SectionTitle title={pageIndex === 0 ? 'Dealership-Wide 12-Month Roadmap' : 'Dealership-Wide 12-Month Roadmap — Continued'} />
      {pageIndex === 0 && report.seasonalityAssumptions && <p className="section-source-intro"><strong>Seasonality assumptions:</strong> {report.seasonalityAssumptions}</p>}
      <div className="table-wrap roadmap-table"><table><thead><tr>
        <th>Month</th><th>Season / Capacity</th><th>Theme / Outcome</th><th>Required Actions and Herohub Programs</th><th>Participants</th><th>Completion Evidence</th>
      </tr></thead><tbody>
        {months.map(item => <tr key={item.month}><td><strong>{item.month}</strong></td><td>{item.seasonCapacity}</td><td>{item.theme}</td><td>{item.actionsPrograms}</td><td>{item.participants}</td><td>{item.evidence}</td></tr>)}
      </tbody></table></div>
      {pageIndex === roadmapPages.length - 1 && report.iqCadence.length > 0 && <div className="source-note-block source-note-block--plain"><h3>HerohubIQ Cadence</h3><ul>{report.iqCadence.map(x => <li key={x}>{x}</li>)}</ul></div>}
    </Page>)}

    {report.individualCalendars.map((person) => <Page key={`${person.name}-${person.role}`}><Brand />
      <Eyebrow>Individual Development Calendar</Eyebrow>
      <div className="calendar-heading"><h2>{person.name} <span>|</span> {person.role}</h2><div><span>Primary Objective</span><strong>{person.objective}</strong></div><p><b>Manager / coach:</b> {person.coach}</p></div>
      <div className="calendar-table table-wrap"><table><thead><tr><th>Month</th><th>Capacity</th><th>HerohubU / Bootcamp / Basecamp / Role Development</th><th>HerohubIQ</th><th>Manager Reinforcement &amp; Evidence</th></tr></thead><tbody>
        {person.months.map(month => <tr key={`${person.name}-${month.month}`}><td><strong>{month.month}</strong></td><td>{month.capacity}</td><td>{month.development}</td><td>{month.herohubIQ}</td><td>{month.reinforcementEvidence}</td></tr>)}
      </tbody></table></div>
    </Page>)}

    <Page><Brand />
      <SectionTitle title="First 30 Days | Launch Plan" />
      <div className="table-wrap launch-table"><table><thead><tr><th>Timing</th><th>Action</th><th>Owner</th><th>Completion Evidence</th></tr></thead><tbody>
        {report.first30Days.map(item => <tr key={`${item.timing}-${item.action}`}><td><strong>{item.timing}</strong></td><td>{item.action}</td><td>{item.owner}</td><td>{item.evidence}</td></tr>)}
      </tbody></table></div>
      <h3 className="subsection-heading">Scorecard and Governance</h3>
      <div className="table-wrap score-table"><table><thead><tr><th>Measure</th><th>Evidence</th><th>Owner</th><th>Cadence</th></tr></thead><tbody>
        {report.scorecard.map(item => <tr key={item.measure}><td><strong>{item.measure}</strong></td><td>{item.evidence}</td><td>{item.owner}</td><td>{item.cadence}</td></tr>)}
      </tbody></table></div>
    </Page>

    <Page><Brand />
      <SectionTitle title="Decisions and Dependencies" />
      <ul className="source-bullets source-bullets--large">{report.decisionsDependencies.map(x => <li key={x}>{x}</li>)}</ul>
      {report.sourceNotes.length > 0 && <>
        <h3 className="subsection-heading">Source and Planning Notes</h3>
        <div className="source-notes-prose">{report.sourceNotes.map(x => <p key={x}>{x}</p>)}</div>
      </>}
    </Page>
  </main>
}

export default function App() {
  const [report, setReport] = useState<HerohubReport | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [jsonDraft, setJsonDraft] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

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
      if (selectedFile.size > 4 * 1024 * 1024) throw new Error('Please keep uploads under 4 MB.')
      const payload: Record<string, string> = { fileName: selectedFile.name, mimeType: selectedFile.type || (isText ? 'text/plain' : 'application/pdf') }
      if (isText) payload.textContent = await selectedFile.text()
      else payload.base64Data = await fileToBase64(selectedFile)

      const startResponse = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const start = await readApiResponse(startResponse)
      if (!startResponse.ok) throw new Error(start.error || `Could not start report generation (${startResponse.status}).`)
      if (!start.responseId) throw new Error('The report job started without a response ID.')

      let completed: HerohubReport | null = null
      for (let attempt = 0; attempt < 100; attempt++) {
        await sleep(attempt === 0 ? 1200 : 2500)
        const statusResponse = await fetch(`/api/generate-report?responseId=${encodeURIComponent(start.responseId)}`, { cache: 'no-store' })
        const status = await readApiResponse(statusResponse)
        if (!statusResponse.ok) throw new Error(status.error || `Report status check failed (${statusResponse.status}).`)
        if (status.status === 'completed' && status.report) { completed = status.report as HerohubReport; break }
        if (['failed', 'cancelled', 'incomplete'].includes(status.status)) throw new Error(status.error || `Report generation ended with status: ${status.status}.`)
      }
      if (!completed) throw new Error('The report is still processing after several minutes. Please try again.')

      setReport(completed)
      setJsonDraft(JSON.stringify(completed, null, 2))
      setViewMode('preview')
      setTimeout(() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }), 20)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate the report.')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    setError('')
  }

  function applyJson() {
    try {
      const parsed = JSON.parse(jsonDraft) as HerohubReport
      setReport(parsed)
      setViewMode('preview')
      setError('')
    } catch {
      setError('The JSON is not valid. Fix the syntax and try again.')
    }
  }

  return <>
    <header className="app-header no-print"><Logo /><div className="app-header__title"><strong>Talent Development Roadmap Builder</strong><span>Herohub Unlimited</span></div></header>
    <section className="hero no-print">
      <div className="hero-copy"><Eyebrow>Herohub Unlimited</Eyebrow><h1>Turn the standard roadmap into a polished Herohub report.</h1><p>Upload the standardized Talent Development Roadmap PDF. The app preserves the source structure and content, then applies the Herohub visual system for a cleaner executive-ready report.</p></div>
      <div className="upload-card">
        <button className="drop-zone" onClick={() => inputRef.current?.click()} type="button"><span className="upload-icon">↑</span><strong>{selectedFile ? selectedFile.name : 'Choose a roadmap file'}</strong><small>PDF, Markdown or TXT · up to 4 MB</small></button>
        <input ref={inputRef} type="file" accept=".pdf,.md,.txt,text/plain,text/markdown,application/pdf" onChange={handleFile} hidden />
        <button className="primary-button" disabled={!selectedFile || isGenerating} onClick={generateReport}>{isGenerating ? 'Mapping source content…' : 'Generate Branded Report'}</button>
        <div className="or"><span />or<span /></div>
        <button className="secondary-button" onClick={showSample}>View sample report</button>
        {error && <div className="error-box">{error}</div>}
      </div>
    </section>

    {report && <section className="workspace" id="workspace">
      <div className="toolbar no-print"><div className="toolbar__left"><strong>{report.profile.name}</strong><span>{report.profile.period}</span></div><div className="toolbar__actions"><button onClick={() => setViewMode('preview')}>Report</button><button onClick={() => setViewMode('json')}>Edit JSON</button><button className="toolbar__print" onClick={() => window.print()}>Print / Save PDF</button></div></div>
      {error && <div className="workspace-error no-print">{error}</div>}
      {viewMode === 'preview' ? <ReportPreview report={report} /> : <div className="json-editor no-print"><Eyebrow>Structured Report Data</Eyebrow><h2>Edit report JSON</h2><p>Changes here update the branded report. Keep the source wording and structure intact unless you intentionally want to edit the report.</p><textarea value={jsonDraft} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setJsonDraft(event.target.value)} /><div className="json-actions"><button onClick={() => setViewMode('preview')}>Cancel</button><button className="primary-button" onClick={applyJson}>Apply changes</button></div></div>}
    </section>}
    <footer className="app-footer no-print"><Logo /><span>Herohub Talent Development Roadmap Builder</span></footer>
  </>
}

function chunk<T>(items: T[], size: number) {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size))
  return result
}

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function readApiResponse(response: Response): Promise<Record<string, any>> {
  const raw = await response.text()
  if (!raw) return {}
  try { return JSON.parse(raw) }
  catch {
    const preview = raw.replace(/\s+/g, ' ').slice(0, 160)
    if (raw.trimStart().startsWith('<')) throw new Error(`Netlify returned an HTML page instead of JSON (HTTP ${response.status}). Check that the generate-report function is deployed. Response: ${preview}`)
    throw new Error(`The server returned an unreadable response (HTTP ${response.status}). Response: ${preview}`)
  }
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '')
    reader.readAsDataURL(file)
  })
}
