import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Training, TrainingCreateRequest, TrainingUpdateRequest } from '../models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = `${environment.apiUrl}/trainings`;
  private cache = new Map<string, Observable<any>>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  getAllTrainings(): Observable<Training[]> {
    const cacheKey = 'all-trainings';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Training[]>(this.apiUrl).pipe(
      shareReplay(1),
      tap(() => {
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      })
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getTrainingById(id: number): Observable<Training> {
    const cacheKey = `training-${id}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Training>(`${this.apiUrl}/${id}`).pipe(
      shareReplay(1),
      tap(() => {
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      })
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getTrainingsByCategory(category: string): Observable<Training[]> {
    const cacheKey = `trainings-category-${category}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Training[]>(`${this.apiUrl}/category/${category}`).pipe(
      shareReplay(1),
      tap(() => {
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      })
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getTrainingsByLevel(level: string): Observable<Training[]> {
    const cacheKey = `trainings-level-${level}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Training[]>(`${this.apiUrl}/level/${level}`).pipe(
      shareReplay(1),
      tap(() => {
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      })
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  createTraining(training: TrainingCreateRequest): Observable<Training> {
    return this.http.post<Training>(this.apiUrl, training).pipe(
      tap(() => this.clearCache())
    );
  }

  updateTraining(id: number, training: TrainingUpdateRequest): Observable<Training> {
    return this.http.put<Training>(`${this.apiUrl}/${id}`, training).pipe(
      tap(() => this.clearCache())
    );
  }

  addCourseToTraining(trainingId: number, courseId: number): Observable<Training> {
    return this.http.post<Training>(`${this.apiUrl}/${trainingId}/courses/${courseId}`, {}).pipe(
      tap(() => this.clearCache())
    );
  }

  removeCourseFromTraining(trainingId: number, courseId: number): Observable<Training> {
    return this.http.delete<Training>(`${this.apiUrl}/${trainingId}/courses/${courseId}`).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteTraining(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
