import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { TourProblemResponse } from './model/tour-problem-response.model';

@Injectable({
  providedIn: 'root'
})

export class TourProblemResponseService {

  constructor(private http: HttpClient) { }

  authorRespond(id: number, tourProblemResponse:TourProblemResponse): Observable<TourProblemResponse> {
    return this.http.post<TourProblemResponse>(environment.apiHost + 'author/tour-problem/' + id + '/respond', tourProblemResponse);
  }

  touristRespond(id: number, tourProblemResponse:TourProblemResponse): Observable<TourProblemResponse> {
    return this.http.post<TourProblemResponse>(environment.apiHost + 'tourist/tour-problem/' + id + '/respond', tourProblemResponse);
  }

  administratorRespond(id: number, tourProblemResponse:TourProblemResponse): Observable<TourProblemResponse> {
    return this.http.post<TourProblemResponse>(environment.apiHost + 'administrator/tour-problem/' + id + '/respond', tourProblemResponse);
  }

  getResponsesAuthor(problemId: number): Observable<PagedResults<TourProblemResponse>> {
    return this.http.get<PagedResults<TourProblemResponse>>(environment.apiHost + 'author/tour-problem/' + problemId + '/responses');
  }

  getResponsesTourist(problemId: number): Observable<PagedResults<TourProblemResponse>> {
    return this.http.get<PagedResults<TourProblemResponse>>(environment.apiHost + 'tourist/tour-problem/' + problemId + '/responses');
  }

  getResponsesAdministrator(problemId: number): Observable<PagedResults<TourProblemResponse>> {
    return this.http.get<PagedResults<TourProblemResponse>>(environment.apiHost + 'administrator/tour-problem/' + problemId + '/responses');
  }
}