import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from './model/tour.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getTours() : Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(environment.apiHost + 'tour-authoring/tour');
  }

  addTour(tour: Tour) : Observable<Tour>{
    return this.http.post<Tour>(environment.apiHost + 'tour-authoring/tour' , tour);
  }


  updateTour(tour: Tour): Observable<Tour>{
    return this.http.put<Tour>(environment.apiHost + 'tour-authoring' + tour.id, tour)
  }

  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>(environment.apiHost + 'tour-authoring/tour' + id);
  }
}