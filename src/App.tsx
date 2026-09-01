import { useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { sampleReport } from './sampleReport'
import type { HerohubReport } from './types'

type ViewMode = 'preview' | 'json'

function Logo() {
  return <div className="logo-wrap"><img src="/herohub-logo.svg" alt="Herohub" /></div>
}

function Page({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`report-page ${className}`}>{children}</section>
}

function Brand() { return <div className="page-brand"><Logo /></div> }
function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow">{children}</div> }
function SectionTitle({ number, title, intro }: { number?: string; title: string; intro?: string }) {
  return <div className={`section-title-block ${intro ? '' : 'section-title-block--solo'}`}>
    <div>{number && <span className="section-number">{number}</span>}<h2>{title}</h2></div>
    {intro && <p>{intro}</p>}
  </div>
}

function ReportPreview({ report }: { report: HerohubReport }) {
  const assignmentPages = chunk(report.employeeAssignments, 6)
  const roadmapPages = chunk(report.roadmap, 6)
  let section = 1
  const next = () => String(section++).padStart(2, '0')

  return <main className="report-document" id="report-document">
    <Page className="cover-page">
      <div className="cover-top"><Logo /></div>
      <div className="cover-content">
        <Eyebrow>Herohub Unlimited</Eyebrow>
        <h1>{report.profile.name}</h1>
        <h3>{report.reportSubtitle}</h3>
        <p>{report.profile.period}</p>
      </div>
      <div className="cover-purpose"><span>Purpose</span><strong>{report.purpose}</strong></div>
      <div className="cover-footer"><span>{report.profile.assessmentDate ? `Prepared from assessment: ${report.profile.assessmentDate}` : 'Prepared by Herohub'}</span></div>
    </Page>

    <Page><Brand />
      <SectionTitle number={next()} title="Executive Summary" intro={report.executiveStrongTeam} />
      <div className="exec-two-col">
        <article><Eyebrow>Highest-Value Opportunities</Eyebrow><p>{report.executiveOpportunities}</p></article>
        <article><Eyebrow>Material Gaps + Risks</Eyebrow><p>{report.executiveRisks}</p></article>
      </div>
      <div className="priority-strip">
        {report.strategicPriorities.map((item, i) => <div key={item}><span>{String(i + 1).padStart(2, '0')}</span><strong>{item}</strong></div>)}
      </div>
      <div className="success-box"><Eyebrow>One-Year Success</Eyebrow><strong>{report.successDefinition}</strong></div>
      <div className="table-wrap assessment-table"><table><thead><tr><th>Assessment Area</th><th>Evidence</th></tr></thead><tbody>
        {report.assessmentSnapshot.map(item => <tr key={item.area}><td><strong>{item.area}</strong></td><td>{item.evidence}</td></tr>)}
      </tbody></table></div>
    </Page>

    <Page><Brand />
      <SectionTitle number={next()} title="Talent + Succession Snapshot" />
      <div className="table-wrap talent-table"><table><thead><tr><th>Person / Role</th><th>Observed Asset</th><th>Development Need</th><th>Succession Relevance</th><th>Urgency</th></tr></thead><tbody>
        {report.talentSnapshot.map(item => <tr key={`${item.name}-${item.role}`}><td><strong>{item.name}</strong><span className="cell-sub">{item.role}</span></td><td>{item.observedAsset}</td><td>{item.developmentNeed}</td><td>{item.successionRelevance}</td><td><span className="urgency-pill">{item.urgency}</span></td></tr>)}
      </tbody></table></div>
      <div className="gap-panel"><Eyebrow>Role + Readiness Gaps</Eyebrow><ul>{report.roleReadinessGaps.map(x => <li key={x}>{x}</li>)}</ul></div>
    </Page>

    {assignmentPages.map((items, pageIndex) => <Page key={`assign-${pageIndex}`}><Brand />
      <SectionTitle number={pageIndex === 0 ? next() : undefined} title={pageIndex === 0 ? 'Employee Development Assignments' : 'Employee Development Assignments — Continued'} />
      <div className="assignment-grid">{items.map(item => <article className="assignment-card" key={`${item.name}-${item.role}`}>
        <div className="assignment-card__title"><div><h3>{item.name}</h3><span>{item.role}</span></div></div>
        <p className="assignment-objective">{item.objective}</p>
        <dl>
          <div><dt>HerohubU</dt><dd>{item.herohubU || 'Not applicable'}</dd></div>
          <div><dt>HerohubIQ</dt><dd>{item.herohubIQ || 'Not applicable'}</dd></div>
          <div><dt>Bootcamp / Basecamp</dt><dd>{item.programs || 'None assigned'}</dd></div>
          <div><dt>Manager Cadence</dt><dd>{item.cadence}</dd></div>
          <div><dt>Success Evidence</dt><dd>{item.evidence}</dd></div>
        </dl>
      </article>)}</div>
      {pageIndex === assignmentPages.length - 1 && report.programAssignmentLogic.length > 0 && <div className="logic-panel"><Eyebrow>Program Assignment Logic</Eyebrow><ul>{report.programAssignmentLogic.map(x => <li key={x}>{x}</li>)}</ul></div>}
    </Page>)}

    {roadmapPages.map((months, pageIndex) => <Page key={`roadmap-${pageIndex}`}><Brand />
      <SectionTitle number={pageIndex === 0 ? next() : undefined} title={pageIndex === 0 ? 'Dealership-Wide 12-Month Roadmap' : 'Dealership-Wide 12-Month Roadmap — Continued'} />
      <div className="roadmap-list">{months.map(item => <article className="roadmap-row" key={item.month}>
        <div className="roadmap-month"><strong>{item.month}</strong><span>{item.seasonCapacity}</span></div>
        <div><span>Theme / Outcome</span><strong>{item.theme}</strong></div>
        <div><span>Required Actions + Herohub Programs</span><p>{item.actionsPrograms}</p></div>
        <div><span>Participants</span><p>{item.participants}</p></div>
        <div><span>Completion Evidence</span><p>{item.evidence}</p></div>
      </article>)}</div>
      {pageIndex === roadmapPages.length - 1 && report.iqCadence.length > 0 && <div className="iq-panel"><Eyebrow>HerohubIQ Cadence</Eyebrow><ul>{report.iqCadence.map(x => <li key={x}>{x}</li>)}</ul></div>}
    </Page>)}

    {report.individualCalendars.map((person) => <Page key={`${person.name}-${person.role}`}><Brand />
      <Eyebrow>Individual Development Calendar</Eyebrow>
      <div className="calendar-heading"><h2>{person.name} <span>|</span> {person.role}</h2><div><span>Primary Objective</span><strong>{person.objective}</strong></div><p><b>Manager / coach:</b> {person.coach}</p></div>
      <div className="calendar-table table-wrap"><table><thead><tr><th>Month</th><th>Capacity</th><th>HerohubU / Bootcamp / Basecamp / Role Development</th><th>HerohubIQ</th><th>Manager Reinforcement + Evidence</th></tr></thead><tbody>
        {person.months.map(month => <tr key={`${person.name}-${month.month}`}><td><strong>{month.month}</strong></td><td>{month.capacity}</td><td>{month.development}</td><td>{month.herohubIQ}</td><td>{month.reinforcementEvidence}</td></tr>)}
      </tbody></table></div>
    </Page>)}

    <Page><Brand />
      <SectionTitle number={next()} title="First 30 Days | Launch Plan" />
      <div className="table-wrap launch-table"><table><thead><tr><th>Timing</th><th>Action</th><th>Owner</th><th>Completion Evidence</th></tr></thead><tbody>
        {report.first30Days.map(item => <tr key={`${item.timing}-${item.action}`}><td><strong>{item.timing}</strong></td><td>{item.action}</td><td>{item.owner}</td><td>{item.evidence}</td></tr>)}
      </tbody></table></div>
      <h3 className="subsection-heading">Scorecard + Governance</h3>
      <div className="table-wrap score-table"><table><thead><tr><th>Measure</th><th>Evidence</th><th>Owner</th><th>Cadence</th></tr></thead><tbody>
        {report.scorecard.map(item => <tr key={item.measure}><td><strong>{item.measure}</strong></td><td>{item.evidence}</td><td>{item.owner}</td><td>{item.cadence}</td></tr>)}
      </tbody></table></div>
    </Page>

    <Page><Brand />
      <SectionTitle number={next()} title="Decisions + Dependencies" />
      <div className="decision-list">{report.decisionsDependencies.map((x, i) => <div key={x}><span>{String(i + 1).padStart(2, '0')}</span><p>{x}</p></div>)}</div>
      {report.sourceNotes.length > 0 && <div className="source-panel"><Eyebrow>Source + Planning Notes</Eyebrow><ul>{report.sourceNotes.map(x => <li key={x}>{x}</li>)}</ul></div>}
      <div className="closing-panel"><Eyebrow>Roadmap Intent</Eyebrow><strong>{report.purpose}</strong></div>
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

  function showSample() { setReport(sampleReport); setJsonDraft(JSON.stringify(sampleReport, null, 2)); setViewMode('preview'); setError(''); setTimeout(() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }), 20) }

  async function generateReport() {
    if (!selectedFile) return
    setError(''); setIsGenerating(true)
    try {
      const isText = selectedFile.type.startsWith('text/') || /\.(md|txt)$/i.test(selectedFile.name)
      if (selectedFile.size > 4 * 1024 * 1024) throw new Error('Please keep uploads under 4 MB.')
      const payload: Record<string, string> = { fileName: selectedFile.name, mimeType: selectedFile.type || (isText ? 'text/plain' : 'application/pdf') }
      if (isText) payload.textContent = await selectedFile.text(); else payload.base64Data = await fileToBase64(selectedFile)
      const response = await fetch('/.netlify/functions/generate-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Report generation failed.')
      setReport(result.report); setJsonDraft(JSON.stringify(result.report, null, 2)); setViewMode('preview'); setTimeout(() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }), 20)
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong.') } finally { setIsGenerating(false) }
  }

  function applyJson() { try { const parsed = JSON.parse(jsonDraft) as HerohubReport; setReport(parsed); setViewMode('preview'); setError('') } catch { setError('The JSON is not valid yet.') } }
  function openJsonEditor() { if (!report) return; setJsonDraft(JSON.stringify(report, null, 2)); setViewMode('json') }
  function downloadJson() { if (!report) return; const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${slug(report.profile.name)}-herohub-roadmap.json`; a.click(); URL.revokeObjectURL(url) }

  return <div className="app-shell">
    <header className="app-header no-print"><Logo /><div className="app-header__title"><strong>Roadmap Builder</strong><span>Talent development report generation</span></div></header>
    <section className="hero no-print"><div className="hero-copy"><Eyebrow>Herohub Report Studio</Eyebrow><h1>Turn a Talent Development Roadmap into a polished Herohub report.</h1><p>Upload the standard Herohub Talent Development Roadmap PDF. The app now maps its recurring sections—including individual development calendars—into a consistent branded report.</p></div>
      <div className="upload-card"><input ref={inputRef} type="file" accept=".md,.txt,.pdf,text/markdown,text/plain,application/pdf" onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedFile(e.target.files?.[0] || null)} hidden />
        <button className="drop-zone" onClick={() => inputRef.current?.click()}><span className="upload-icon">↑</span><strong>{selectedFile ? selectedFile.name : 'Choose a Talent Development Roadmap'}</strong><small>{selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : 'PDF, Markdown or TXT · max 4 MB'}</small></button>
        <button className="primary-button" onClick={generateReport} disabled={!selectedFile || isGenerating}>{isGenerating ? 'Building Herohub report…' : 'Generate Report'}</button><div className="or"><span />or<span /></div><button className="secondary-button" onClick={showSample}>Preview Included Sample</button>{error && <div className="error-box">{error}</div>}
      </div></section>
    {report && <section className="workspace" id="workspace"><div className="toolbar no-print"><div className="toolbar__left"><strong>{report.profile.name}</strong><span>{report.profile.period}</span></div><div className="toolbar__actions">{viewMode === 'preview' ? <button onClick={openJsonEditor}>Edit JSON</button> : <button onClick={() => setViewMode('preview')}>Back to Preview</button>}<button onClick={downloadJson}>Download JSON</button><button className="toolbar__print" onClick={() => window.print()}>Print / Save PDF</button></div></div>
      {error && <div className="workspace-error no-print">{error}</div>}
      {viewMode === 'json' ? <div className="json-editor no-print"><div><h2>Edit structured report</h2><p>All recurring source sections are represented in this JSON, including the individual monthly calendars.</p></div><textarea value={jsonDraft} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setJsonDraft(e.target.value)} spellCheck={false} /><div className="json-actions"><button onClick={() => setViewMode('preview')}>Cancel</button><button className="primary-button" onClick={applyJson}>Apply Changes</button></div></div> : <ReportPreview report={report} />}
    </section>}
    <footer className="app-footer no-print"><Logo /><span>Herohub Roadmap Builder · v1.1</span></footer>
  </div>
}

function chunk<T>(items: T[], size: number) { const out: T[][] = []; for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size)); return out }
function fileToBase64(file: File): Promise<string> { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => { const result = String(reader.result || ''); resolve(result.includes(',') ? result.split(',')[1] : result) }; reader.onerror = reject; reader.readAsDataURL(file) }) }
function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
