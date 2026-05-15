import { Injectable }    from '@angular/core';
import { HttpClient }    from '@angular/common/http';
import { Observable }    from 'rxjs';
import {
  Question, Answer, SessionResult, StatsResponse
} from '../models/quiz.model';

@Injectable({ providedIn: 'root' })
export class QuizService {

  // Change this if your backend runs on a different host/port
  private readonly API = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  /** Fetch 9 randomised questions (3 per category) */
  getRandomQuestions(): Observable<{ success: boolean; questions: Question[]; total: number }> {
    return this.http.get<any>(`${this.API}/questions/random`);
  }

  /** Persist a new session with the given question IDs; returns sessionId */
  createSession(questionIds: string[]): Observable<{ success: boolean; sessionId: string }> {
    return this.http.post<any>(`${this.API}/sessions`, { questionIds });
  }

  /** Submit all answers for a session; backend calculates and stores results */
  submitAnswers(
    sessionId: string,
    answers:   Answer[]
  ): Observable<{ success: boolean; result: SessionResult }> {
    return this.http.post<any>(`${this.API}/sessions/${sessionId}/submit`, { answers });
  }

  /** Aggregate statistics across all completed sessions */
  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.API}/stats`);
  }
}
