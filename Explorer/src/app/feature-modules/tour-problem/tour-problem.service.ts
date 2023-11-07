import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TourProblem } from './model/tour-problem.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class TourProblemService {

  constructor(private http: HttpClient) { }

  //Administrator HTTP Request Methods

  getTourProblemsAdministrator(): Observable<PagedResults<TourProblem>> {
    return this.http.get<PagedResults<TourProblem>>(environment.apiHost + 'administrator/tour-problem');
  }

  deleteTourProblemAdministrator(id: number): Observable<TourProblem> {
    return this.http.delete<TourProblem>(environment.apiHost + 'administrator/tour-problem/' + id);
  }

  addTourProblemAdministrator(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'administrator/tour-problem', tourProblem);
  }

  updateTourProblemAdministrator(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.put<TourProblem>(environment.apiHost + 'administrator/tour-problem/' + tourProblem.id, tourProblem);
  }

  getTourProblemAdministrator(id:number) : Observable<TourProblem>{
    return this.http.get<TourProblem>('https://localhost:44333/api/administrator/tour-problem/' + id);
  } 

  //Author HTTP request methods
  getTourProblemsAuthor(): Observable<PagedResults<TourProblem>> {
    return this.http.get<PagedResults<TourProblem>>(environment.apiHost + 'author/tour-problem');
  }

  deleteTourProblemAuthor(id: number): Observable<TourProblem> {
    return this.http.delete<TourProblem>(environment.apiHost + 'author/tour-problem' + id);
  }

  addTourProblemAuthor(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'author/tour-problem', tourProblem);
  }

  updateTourProblemAuthor(tourProblem: TourProblem): Observable<TourProblem> {
   return this.http.put<TourProblem>(environment.apiHost + 'author/tour-problem' + tourProblem.id, tourProblem);
  }

  //Tourist HTTP request methods
  getTourProblemsTourist(): Observable<PagedResults<TourProblem>> {
    return this.http.get<PagedResults<TourProblem>>(environment.apiHost + 'tourist/tour-problems');
  }

  deleteTourProblemTourist(id: number): Observable<TourProblem> {
    return this.http.delete<TourProblem>(environment.apiHost + 'tourist/tour-problems' + id);
  }

  addTourProblemTourist(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'tourist/tour-problems', tourProblem);
  }

  updateTourProblemTourist(tourProblem: TourProblem): Observable<TourProblem> {
   return this.http.put<TourProblem>(environment.apiHost + 'tourist/tour-problems' + tourProblem.id, tourProblem);
  }
  
}