export interface DealershipProfile {
  name: string
  period: string
  locations: string
  employees: string
  brands: string[]
  dealerPrincipal: string
  generalManager: string
  assessmentDate: string
}

export interface AssessmentItem {
  area: string
  evidence: string
}

export interface TalentSnapshotItem {
  name: string
  role: string
  observedAsset: string
  developmentNeed: string
  successionRelevance: string
  urgency: string
}

export interface EmployeeAssignment {
  name: string
  role: string
  objective: string
  herohubU: string
  herohubIQ: string
  programs: string
  cadence: string
  evidence: string
}

export interface RoadmapMonth {
  month: string
  seasonCapacity: string
  theme: string
  actionsPrograms: string
  participants: string
  evidence: string
}

export interface CalendarMonth {
  month: string
  capacity: string
  development: string
  herohubIQ: string
  reinforcementEvidence: string
}

export interface IndividualCalendar {
  name: string
  role: string
  objective: string
  coach: string
  months: CalendarMonth[]
}

export interface LaunchAction {
  timing: string
  action: string
  owner: string
  evidence: string
}

export interface ScorecardItem {
  measure: string
  evidence: string
  owner: string
  cadence: string
}

export interface HerohubReport {
  reportTitle: string
  reportSubtitle: string
  profile: DealershipProfile
  purpose: string
  executiveStrongTeam: string
  executiveOpportunities: string
  executiveRisks: string
  strategicPriorities: string[]
  successDefinition: string
  assessmentSnapshot: AssessmentItem[]
  talentSnapshot: TalentSnapshotItem[]
  roleReadinessGaps: string[]
  employeeAssignments: EmployeeAssignment[]
  programAssignmentLogic: string[]
  roadmap: RoadmapMonth[]
  iqCadence: string[]
  individualCalendars: IndividualCalendar[]
  first30Days: LaunchAction[]
  scorecard: ScorecardItem[]
  decisionsDependencies: string[]
  sourceNotes: string[]
}
