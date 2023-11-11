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

  //Author HTTP Request Methods

  getTourProblemsAuthor(id:number): Observable<PagedResults<TourProblem>> {
    return this.http.get<PagedResults<TourProblem>>(environment.apiHost + 'author/by-author/tour-problem' + id);
  }

  deleteTourProblemAuthor(id: number): Observable<TourProblem> {
    return this.http.delete<TourProblem>(environment.apiHost + 'author/tour-problem/' + id);
  }

  addTourProblemAuthor(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'author/tour-problem', tourProblem);
  }

  updateTourProblemAuthor(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.put<TourProblem>(environment.apiHost + 'author/tour-problem/' + tourProblem.id, tourProblem);
  }

  
  getTourProblemAuthor(id:number) : Observable<PagedResults<TourProblem>>{
    return this.http.get<PagedResults<TourProblem>>(environment.apiHost + 'author/tour-problem/by-author/' + id);
  } 

    //Tourist HTTP Request Methods

  getTourProblemsTourist(): Observable<PagedResults<TourProblem>> {
    return this.http.get<PagedResults<TourProblem>>(environment.apiHost + 'tourist/tour-problem');
  }

  deleteTourProblemTourist(id: number): Observable<TourProblem> {
    return this.http.delete<TourProblem>(environment.apiHost + 'tourist/tour-problem/' + id);
  }

  addTourProblemTourist(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'tourist/tour-problem', tourProblem);
  }

  updateTourProblemTourist(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.put<TourProblem>(environment.apiHost + 'tourist/tour-problem/' + tourProblem.id, tourProblem);
  }

  getTourProblemTourist(id:number) : Observable<TourProblem>{
    return this.http.get<TourProblem>('https://localhost:44333/api/tourist/tour-problem/' + id);
  } 


  //Default HTTP Requests, not function, should be replaced by other roles
  
  getTourProblems(): Observable<PagedResults<TourProblem>> {
    return this.http.get<PagedResults<TourProblem>>(environment.apiHost + 'tour-problem/tour-problem');
  }

  deleteTourProblem(id: number): Observable<TourProblem> {
    return this.http.delete<TourProblem>(environment.apiHost + 'tour-problem/tour-problem/' + id);
  }

  addTourProblem(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'tour-problem/tour-problem', tourProblem);
  }

  updateTourProblem(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.put<TourProblem>(environment.apiHost + 'tour-problem/tour-problem/' + tourProblem.id, tourProblem);
  }

}



