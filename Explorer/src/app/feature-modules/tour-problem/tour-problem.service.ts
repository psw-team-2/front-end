import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TourProblem } from './model/tour-problem.model';
import { TourProblemResponse } from './model/tour-problem-response.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../tour-authoring/model/tour.model';

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
    return this.http.get<PagedResults<TourProblem>>(environment.apiHost + 'author/tour-problem/by-author/' + id);
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


  deleteTourProblemTourist(id: number): Observable<TourProblem> {
    return this.http.delete<TourProblem>(environment.apiHost + 'tourist/tour-problem' + id);
  }
  
  getTourProblemAuthor(id:number) : Observable<TourProblem>{
    return this.http.get<TourProblem>(environment.apiHost + 'author/tour-problem/' + id);
  } 

  getTourProblemForAuthor(id:number) : Observable<TourProblem>{
    return this.http.get<TourProblem>('https://localhost:44333/api/author/tour-problem/' + id);
  } 
  
    //Tourist HTTP Request Methods

  getTourProblemsTourist(id:number): Observable<PagedResults<TourProblem>> {
    return this.http.get<PagedResults<TourProblem>>(environment.apiHost + 'tourist/tour-problem/by-tourist/' + id);
  }



  addTourProblemTourist(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'tourist/tour-problem', tourProblem);
  }

  updateTourProblemTourist(tourProblem: TourProblem): Observable<TourProblem> {
   return this.http.put<TourProblem>(environment.apiHost + 'tourist/tour-problem' + tourProblem.id, tourProblem);
  }
  

  getTourProblemTourist(id:number) : Observable<TourProblem>{
    return this.http.get<TourProblem>(environment.apiHost + 'tourist/tour-problem/' + id);
  } 

  problemSolved(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'tourist/tour-problem/problemSolved', tourProblem);
  }

  problemUnsolved(tourProblem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'tourist/tour-problem/problemUnsolved', tourProblem);
  }



  // Tour Problem Response

  getTourProblemResponses(id: number): Observable<PagedResults<TourProblemResponse>> {
    return this.http.get<PagedResults<TourProblemResponse>>(environment.apiHost + 'tourist/tour-problems/' + id + '/responses');
  }

  // returns all responses targeted towards the tourist the id belongs to
  getTourProblemResponsesForTourist(id: number): Observable<PagedResults<TourProblemResponse>>{
    return this.http.get<PagedResults<TourProblemResponse>>('https://localhost:44333/api/tourist/tour-problem/tourist/' + id + '/responses');
  }

  // returns all responses targeted towards the author the id belongs to
  getTourProblemResponsesForAuthor(id: number): Observable<PagedResults<TourProblemResponse>>{
    return this.http.get<PagedResults<TourProblemResponse>>('https://localhost:44333/api/author/tour-problem/author/' + id + '/responses');
  }

  // // returns all responses targeted towards the user the id belongs to
  // getTourProblemResponsesForUser(id: number): Observable<PagedResults<TourProblemResponse>>{
  //   return this.http.get<PagedResults<TourProblemResponse>>(environment.apiHost + 'user/' + id + '/responses');
  // }

  getTour(id: Number): Observable<Tour> {
    return this.http.get<Tour>('https://localhost:44333/api/author/tour/' + id);
  }
}



