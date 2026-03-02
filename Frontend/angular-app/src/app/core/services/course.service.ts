import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, CourseCreateRequest, CourseUpdateRequest } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;
  private cache = new Map<string, Observable<any>>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    const cacheKey = 'all-courses';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Course[]>(this.apiUrl).pipe(
      shareReplay(1),
      tap(() => {
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      })
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getCourseById(id: number): Observable<Course> {
    const cacheKey = `course-${id}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      shareReplay(1),
      tap(() => {
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      })
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getCoursesByTrainer(trainerId: number): Observable<Course[]> {
    const cacheKey = `trainer-courses-${trainerId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Course[]>(`${this.apiUrl}/trainer/${trainerId}`).pipe(
      shareReplay(1),
      tap(() => {
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      })
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  createCourse(course: CourseCreateRequest): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course).pipe(
      tap(() => this.clearCache())
    );
  }

  updateCourse(id: number, course: CourseUpdateRequest): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
