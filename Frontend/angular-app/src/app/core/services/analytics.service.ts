import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamAnalytics, TrainingAnalytics } from '../models/analytics.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getTrainerExamAnalytics(trainerId: number): Observable<ExamAnalytics[]> {
    return this.http.get<ExamAnalytics[]>(`${this.apiUrl}/exam-results/trainer/${trainerId}/analytics`);
  }

  getTrainerTrainingAnalytics(trainerId: number): Observable<TrainingAnalytics[]> {
    return this.http.get<TrainingAnalytics[]>(`${this.apiUrl}/trainings/enrollments/trainer/${trainerId}/analytics`);
  }
}
