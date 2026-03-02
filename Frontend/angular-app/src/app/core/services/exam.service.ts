import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { Exam, Question, Exercise, ExamResult, ExerciseAnswer } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:8090/api/exams';
  private cache = new Map<string, Observable<any>>();
  private cacheTimeout = 3 * 60 * 1000; // 3 minutes (shorter for exams)

  constructor(private http: HttpClient) {}

  // Exam CRUD
  getAllExams(): Observable<Exam[]> {
    const cacheKey = 'all-exams';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Exam[]>(this.apiUrl).pipe(
      shareReplay(1),
      tap(() => {
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      })
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getExamById(id: number): Observable<Exam> {
    const cacheKey = `exam-${id}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Exam>(`${this.apiUrl}/${id}`).pipe(
      shareReplay(1),
      tap(() => {
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      })
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getExamsByCourse(courseId: number): Observable<Exam[]> {
    const cacheKey = `exams-course-${courseId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<Exam[]>(`${this.apiUrl}/course/${courseId}`).pipe(
      shareReplay(1),
      tap(() => {
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      })
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  createExam(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, exam).pipe(
      tap(() => this.clearCache())
    );
  }

  updateExam(id: number, exam: Exam): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, exam).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  // Questions (for QUIZ)
  getQuestionsByExam(examId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${examId}/questions`);
  }

  createQuestion(examId: number, question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/${examId}/questions`, question).pipe(
      tap(() => this.clearCache())
    );
  }

  updateQuestion(examId: number, questionId: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${examId}/questions/${questionId}`, question).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteQuestion(examId: number, questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${examId}/questions/${questionId}`).pipe(
      tap(() => this.clearCache())
    );
  }

  // Exercises (for EXAM)
  getExercisesByExam(examId: number): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/${examId}/exercises`);
  }

  createExercise(examId: number, exercise: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.apiUrl}/${examId}/exercises`, exercise).pipe(
      tap(() => this.clearCache())
    );
  }

  updateExercise(examId: number, exerciseId: number, exercise: Exercise): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/${examId}/exercises/${exerciseId}`, exercise).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteExercise(examId: number, exerciseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${examId}/exercises/${exerciseId}`).pipe(
      tap(() => this.clearCache())
    );
  }

  // Exam Results
  submitExam(submissionData: any): Observable<ExamResult> {
    return this.http.post<ExamResult>('http://localhost:8090/api/exam-results/submit', submissionData).pipe(
      tap(() => this.clearCache())
    );
  }

  submitQuiz(examId: number, answers: any): Observable<ExamResult> {
    return this.http.post<ExamResult>(`${this.apiUrl}/${examId}/submit-quiz`, answers).pipe(
      tap(() => this.clearCache())
    );
  }

  submitExamOld(examId: number, answers: ExerciseAnswer[]): Observable<ExamResult> {
    return this.http.post<ExamResult>(`${this.apiUrl}/${examId}/submit-exam`, answers).pipe(
      tap(() => this.clearCache())
    );
  }

  getResultsByUser(userId: number): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/results/user/${userId}`);
  }

  getResultById(resultId: number): Observable<ExamResult> {
    return this.http.get<ExamResult>(`${this.apiUrl}/results/${resultId}`);
  }

  getExamResult(resultId: number): Observable<ExamResult> {
    return this.http.get<ExamResult>(`http://localhost:8090/api/exam-results/${resultId}`);
  }

  getUserAnswers(resultId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8090/api/exam-results/${resultId}/answers`);
  }

  // Correction (for TRAINER)
  getPendingCorrections(): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/results/pending`);
  }

  correctExercise(answerId: number, marks: number, feedback: string): Observable<ExerciseAnswer> {
    return this.http.put<ExerciseAnswer>(`${this.apiUrl}/exercise-answers/${answerId}/correct`, {
      marksObtained: marks,
      trainerFeedback: feedback
    });
  }

  finalizeCorrection(resultId: number): Observable<ExamResult> {
    return this.http.put<ExamResult>(`${this.apiUrl}/results/${resultId}/finalize`, {});
  }

  // Exam Enrollments
  getMyExams(userId: number): Observable<Exam[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<Exam[]>('http://localhost:8090/api/exam-enrollments/my-exams', { params });
  }

  completeCourse(courseId: number, userId: number): Observable<string> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<string>(`http://localhost:8090/api/courses/${courseId}/complete`, null, { params });
  }

  // Exam Drafts
  saveDraft(examId: number, userId: number, answers: Map<number, string>): Observable<string> {
    const answersObj: any = {};
    answers.forEach((value, key) => {
      answersObj[key] = value;
    });
    
    return this.http.post('http://localhost:8090/api/exam-drafts/save', {
      examId,
      userId,
      answers: answersObj
    }, { responseType: 'text' });
  }

  getDraft(examId: number, userId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8090/api/exam-drafts/${examId}/user/${userId}`);
  }

  deleteDraft(examId: number, userId: number): Observable<string> {
    return this.http.delete(`http://localhost:8090/api/exam-drafts/${examId}/user/${userId}`, { responseType: 'text' });
  }

  clearCache(): void {
    this.cache.clear();
  }
}
