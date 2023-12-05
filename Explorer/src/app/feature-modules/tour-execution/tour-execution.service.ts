import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TouristPosition } from './model/touristposition.model';
import { TourExecution } from './model/tourexecution.model';
import { Checkpoint } from '../tour-authoring/model/checkpoint.model';
import { Secret } from './model/secret.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }


  getTourExecution(userId: Number): Observable<TourExecution> {
    return this.http.get<TourExecution>('https://localhost:44333/api/tourexecution/get/' + userId);
  }
  completeTour(id?: Number): Observable<TourExecution> {
    return this.http.post<TourExecution>('https://localhost:44333/api/tourexecution/complete/' + id, {});
  }
  abandonTour(id?: Number): Observable<TourExecution> {
    return this.http.post<TourExecution>('https://localhost:44333/api/tourexecution/abandon/' + id, {});
  }
  updateTourExecution(tourExecution: TourExecution): Observable<TourExecution> {
    return this.http.put<TourExecution>('https://localhost:44333/api/tourexecution/' + tourExecution.id, tourExecution)
  }
  completeCheckpoint(id: number, checkpoints: Checkpoint[]): Observable<TourExecution> {
    return this.http.put<TourExecution>('https://localhost:44333/api/tourexecution/checkpointComplete/' + id, checkpoints);
  }
  getSecrets(cpId:number){
    return this.http.get<Secret>('https://localhost:44333/api/tourexecution/getSecret/' + cpId);
  }
  
  getTourExecutionByTourAndUser(tourId: number, userId: number): Observable<PagedResults<TourExecution>>{
    return this.http.get<PagedResults<TourExecution>>('https://localhost:44333/api/tourexecution/'+ tourId +'/' + userId);
  }

}
