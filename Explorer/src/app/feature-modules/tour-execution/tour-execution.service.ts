import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TouristPosition } from './model/touristposition.model';
import { TourExecution } from './model/tourexecution.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }


  getTourExecution(userId : Number) : Observable<TourExecution> {
    return this.http.get<TourExecution>('https://localhost:44333/api/tourexecution/get/' + userId);
  } 
  completeTour(id? : Number) : Observable<TourExecution> {
    return this.http.post<TourExecution>('https://localhost:44333/api/tourexecution/complete/' + id,{});
  } 
  abandonTour(id? : Number) : Observable<TourExecution> {
    return this.http.post<TourExecution>('https://localhost:44333/api/tourexecution/abandon/' + id,{});
  } 
  updateTourExecution(tourExecution: TourExecution) : Observable<TourExecution>{
      return this.http.put<TourExecution>('https://localhost:44333/api/tourexecution/' + tourExecution.id, tourExecution)
  }
}
