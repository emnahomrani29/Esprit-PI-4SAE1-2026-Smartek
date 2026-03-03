export interface ExamAnalytics {
  examId: number;
  examTitle: string;
  learnerId: number;
  learnerName: string;
  learnerEmail: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'passed' | 'failed';
  completedAt: Date;
}

export interface TrainingAnalytics {
  trainingId: number;
  trainingTitle: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
}
