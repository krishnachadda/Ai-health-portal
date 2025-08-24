
export enum AppStep {
  CONSENT = 'CONSENT',
  FORM = 'FORM',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS'
}

export interface SymptomData {
  age: string;
  gender: string;
  severity: string;
  description: string;
  duration: string;
  history: string;
}

export interface Condition {
  name: string;
  probability: number;
  description: string;
}

export interface RiskFactor {
  factor: string;
  value: number;
}

export interface SymptomAnalysis {
  severity: string;
  duration_pattern: string;
  progression: string;
}

export interface CarePlanItem {
  title: string;
  description: string;
  type: 'recommendation' | 'caution';
}

export interface TimelineItem {
  time: string;
  title: string;
  description: string;
}

export interface AnalysisResult {
  ai_confidence: number;
  conditions_analyzed: number;
  urgency_level: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendations: number;
  conditions: Condition[];
  risk_assessment: RiskFactor[];
  symptom_analysis: SymptomAnalysis;
  care_plan: CarePlanItem[];
  timeline: TimelineItem[];
}