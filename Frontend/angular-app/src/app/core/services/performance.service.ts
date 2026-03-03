import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CourseStats {
  userId: number;
  totalEnrolled: number;
  inProgress: number;
  completed: number;
  completionRate: number;
  totalChapters: number;
  completedChapters: number;
}

export interface TrainingStats {
  userId: number;
  totalEnrolled: number;
  inProgress: number;
  completed: number;
  averageProgress: number;
  statusBreakdown: { [key: string]: number };
}

export interface ExamStats {
  userId: number;
  totalAvailable: number;
  attempted: number;
  passed: number;
  failed: number;
  averageScore: number;
  successRate: number;
  totalAttempts: number;
}

export interface PerformanceStats {
  courses: CourseStats;
  trainings: TrainingStats;
  exams: ExamStats;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private courseApiUrl = `${environment.apiUrl}/courses/stats`;
  private trainingApiUrl = `${environment.apiUrl}/training/stats`;
  private examApiUrl = `${environment.apiUrl}/exams/stats`;

  constructor(private http: HttpClient) {}

  getCourseStats(userId: number): Observable<CourseStats> {
    return this.http.get<CourseStats>(`${this.courseApiUrl}/user/${userId}`);
  }

  getTrainingStats(userId: number): Observable<TrainingStats> {
    return this.http.get<TrainingStats>(`${this.trainingApiUrl}/user/${userId}`);
  }

  getExamStats(userId: number): Observable<ExamStats> {
    return this.http.get<ExamStats>(`${this.examApiUrl}/user/${userId}`);
  }

  getAllStats(userId: number): Observable<PerformanceStats> {
    return forkJoin({
      courses: this.getCourseStats(userId),
      trainings: this.getTrainingStats(userId),
      exams: this.getExamStats(userId)
    });
  }
}
