export enum RiskSeverity {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  SAFE = 'SAFE'
}

export enum AnalysisVerdict {
  RECOMMENDED = 'RECOMMENDED',
  ACCEPTABLE = 'ACCEPTABLE',
  CAUTION = 'CAUTION',
  AVOID = 'AVOID'
}

export interface AnalysisItem {
  id: string;
  originalText: string;
  simplifiedTranslation: string;
  severity: RiskSeverity;
  category: string;
  explanation: string;
}

export interface AnalysisResult {
  score: number; // 0 to 100, where 100 is perfectly safe
  verdict: AnalysisVerdict;
  recommendation: string;
  summary: string;
  items: AnalysisItem[];
  companyName?: string;
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';