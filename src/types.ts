export type PriorityLevel = 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL'

export interface DealershipProfile {
  name: string
  brands: string[]
  locations: string
  employees: string
  dealerPrincipal: string
  generalManager: string
  planningHorizon: string
  roadmapStart: string
}

export interface Strength {
  title: string
  fact: string
  opportunity: string
}

export interface Opportunity {
  title: string
  businessChange: string
  priority: PriorityLevel
}

export interface LeaderPlan {
  name: string
  role: string
  objective: string
  development: string
  cadence: string
  evidence: string
  decisionGate: string
}

export interface CapacityMonth {
  month: string
  classification: string
  focus: string
  capacity: string
}

export interface RoadmapMonth {
  month: string
  title: string
  classification: string
  objective: string
  owner: string
  actions: string[]
  evidence: string[]
  developmentSupport: string[]
}

export interface First30Action {
  timing: string
  action: string
  owner: string
  evidence: string
}

export interface ScorecardItem {
  area: string
  indicator: string
  owner: string
}

export interface DecisionItem {
  decision: string
  owner: string
  timing: string
  evidence: string
}

export interface HerohubReport {
  reportTitle: string
  reportSubtitle: string
  profile: DealershipProfile
  purpose: string
  successDefinition: string
  strategicAim: string
  executiveSummary: string
  priorities: string[]
  leadershipRead: string
  strengths: Strength[]
  opportunities: Opportunity[]
  leaders: LeaderPlan[]
  capacity: CapacityMonth[]
  roadmap: RoadmapMonth[]
  first30Days: First30Action[]
  scorecard: ScorecardItem[]
  quarterlyQuestions: string[]
  decisions: DecisionItem[]
  finalOutcomes: string[]
  closingStatement: string
  sourceNotes: string[]
}
