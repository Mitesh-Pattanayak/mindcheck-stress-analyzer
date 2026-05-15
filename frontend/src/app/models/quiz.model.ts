export type Category = 'E' | 'P' | 'M';
export type AppState = 'disclaimer' | 'loading' | 'quiz' | 'submitting' | 'results' | 'error';

export interface Question {
  _id: string;
  text: string;
  category: Category;
  reverse: boolean;
}

export interface Answer {
  questionId: string;
  category: Category;
  reverse: boolean;
  rawValue: number;
}

export interface SessionResult {
  scores:           { E: number; P: number; M: number };
  totalScore:       number;
  maxPossible:      number;
  percentage:       number;
  primaryCategory:  Category;
  stressType:       string;
  stressDescription:string;
}

export interface GlobalStats {
  totalSessions: number;
  avgPercentage: number;
  avgE:          number;
  avgP:          number;
  avgM:          number;
}

export interface StressTypeCount {
  _id:   string;
  count: number;
}

export interface StatsResponse {
  success:               boolean;
  stats:                 GlobalStats;
  stressTypeDistribution:StressTypeCount[];
  categoryDistribution:  { _id: Category; count: number }[];
}
