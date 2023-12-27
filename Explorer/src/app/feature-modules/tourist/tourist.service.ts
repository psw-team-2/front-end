import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable, map } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Equipment } from '../administration/model/equipment.model';
import { PurchaseReport } from './model/purchase-report.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { Question } from './model/question.model';
import { Answer, AnswerCategory } from './model/answer.model';

@Injectable({
  providedIn: 'root'
})
export class TouristService {

  constructor(private http: HttpClient) { }

  getPurchaseReportsByTouristId(userId: number): Observable<PurchaseReport[]> {
    return this.http.get<PurchaseReport[]>(`https://localhost:44333/api/tourist/purchaseReport/byTourist/${userId}`);
  }

  getTourById(tourId: number): Observable<Tour> {
    return this.http.get<Tour>(`https://localhost:44333/api/author/tour/${tourId}`);
  }

  createQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>('https://localhost:44333/api/question', question);
  }

  getAnswersByCategory(category: AnswerCategory): Observable<Answer[]> {
    return this.http.get<Answer[]>(`https://localhost:44333/api/answer/category/${category}`);
  }

  getQuestionTextByQuestionId(questionId: number): Observable<string> {
    return this.http
      .get(`https://localhost:44333/api/question/questionId/${questionId}`, { responseType: 'arraybuffer' })
      .pipe(
        map(response => new TextDecoder('utf-8').decode(response))
      );
      }
  
}
