import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TourProblem } from './model/tour-problem.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class TourModelService {

  constructor(private http: HttpClient) { }

  getTourProblems(): Observable<PagedResults<TourProblem>> {
    return this.http.get<PagedResults<TourProblem>>(environment.apiHost + 'tour-problem/tour-problems');
  }

  deleteTourProblem(id: number): Observable<TourProblem> {
    return this.http.delete<TourProblem>(environment.apiHost + 'tour-problem/tour-problems/' + id);
  }

  addTourProblem(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'tour-problem/tour-problems', tourProblem);
  }

  updateTourProblem(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.put<TourProblem>(environment.apiHost + 'tour-problem/tour-problems/' + tourProblem.id, tourProblem);
  }

}



