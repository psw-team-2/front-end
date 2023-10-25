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
    return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/author/tour?page=0&pageSize=0');
  }

  addTour(tour: Tour) : Observable<Tour>{
    return this.http.post<Tour>('https://localhost:44333/api/author/tour/' , tour)
  }


  updateTour(tour: Tour): Observable<Tour>{
    return this.http.put<Tour>('https://localhost:44333/api/author/tour/' + tour.id, tour)
  }

  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>('https://localhost:44333/api/author/tour/' + id);
  }
}