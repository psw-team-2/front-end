import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ComposedTour } from './model/composed-tour.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../tour-authoring/model/tour.model';

@Injectable({
  providedIn: 'root'
})
export class ComplexTourService {

  constructor(private http: HttpClient) { }

  addComplexTour(complexTour: ComposedTour): Observable<ComposedTour> {
    return this.http.post<ComposedTour>(environment.apiHost + 'tourComposition', complexTour);
  }
  

  retrivesAllUserTours(userId:number) : Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/tourComposition/'+userId+'?page=0&pageSize=0');
  }

  getAll(page: number, pageSize: number): Observable<PagedResults<ComposedTour>> {
    return this.http.get<PagedResults<ComposedTour>>(`${environment.apiHost}tourComposition?page=${page}&pageSize=${pageSize}`);
  }
}
