import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Checkpoint } from './model/checkpoint.model';
import { Equipment } from './model/equipment.model';
import { Observable, throwError, of } from 'rxjs';
import { Tour } from './model/tour.model';
import { environment } from 'src/env/environment';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>('https://localhost:44333/api/author/equipment?page=0&pageSize=0')
  }

  getCheckpoints() : Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>('https://localhost:44333/api/addcheckpoint/checkpoint?page=0&pageSize=0');
  }
  getCheckpointById(checkpointId: Number): Observable<Checkpoint> {
    return this.http.get<Checkpoint>(`https://localhost:44333/api/addcheckpoint/checkpoint/${checkpointId}`);
  }
  addCheckpoint(checkpoint: Checkpoint) : Observable<Checkpoint>{
    return this.http.post<Checkpoint>('https://localhost:44333/api/addcheckpoint/checkpoint/', checkpoint)
  }

  updateCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint>{
    return this.http.put<Checkpoint>('https://localhost:44333/api/addcheckpoint/checkpoint/' + checkpoint.id, checkpoint)
  }

  deleteCheckpoint(id: number): Observable<Checkpoint> {
    return this.http.delete<Checkpoint>('https://localhost:44333/api/addcheckpoint/checkpoint/' + id);
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `https://localhost:44333/api/addcheckpoint/checkpoint/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getToursWithAuth(user:User | undefined) : Observable<PagedResults<Tour>> {

    if(user){
      if(user.role === 'administrator'){
        return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/administrator/tour?page=0&pageSize=0');
      }
      else if(user.role === 'author'){
        return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/author/tour?page=0&pageSize=0');
      }else if(user.role === 'tourist'){
        //      Function call if need for tourist role in the future, not implemented in back-end currently
        //      return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/tourist/tour?page=0&pageSize=0');
        //      Temporary return result
        return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/administrator/tour?page=0&pageSize=0');
      }
      else{
        error: () => {
          console.error('An error occurred: Given Role is non-existent');
          return throwError('Given Role is non-existent');
          
        }
        return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/administrator/tour?page=0&pageSize=0');
      }
    }else{
      return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/administrator/tour?page=0&pageSize=0');      
    }
  }

  getTours() : Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/author/tour?page=0&pageSize=0');
  }

  getTour(id: Number): Observable<Tour> {
    return this.http.get<Tour>('https://localhost:44333/api/author/tour/' + id);
  }

  addTour(tour: Tour) : Observable<Tour>{
    return this.http.post<Tour>('https://localhost:44333/api/author/tour/' , tour)
  }


  updateTour(tour: Tour): Observable<Tour>{
    return this.http.put<Tour>('https://localhost:44333/api/author/tour/' + tour.id, tour)
  }

  updateTourCheckpoints(tour:Tour,checkpointId:number) {
    return this.http.put<Tour>('https://localhost:44333/api/author/tour/' + tour.id + '/' + checkpointId,tour);

  }
  deleteTourCheckpoint(tour:Tour,checkpointId:number) {
    return this.http.put<Tour>('https://localhost:44333/api/author/tour/delete/' + tour.id + '/' + checkpointId,tour);

  }

  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>('https://localhost:44333/api/author/tour/' + id);
  }

  addEquipmentToTour(equipment: Equipment, tour: Tour) : Observable<Equipment>{
    console.log(equipment);
    console.log(tour);
    return this.http.post<Equipment>('https://localhost:44333/api/author/tour/tourEquipment/' + tour.id +  '/' + equipment.id,tour)
  }

  removeEquipmentFromTour(equipmentId: number, tour: Tour) : Observable<Equipment>{
    return this.http.put<Equipment>('https://localhost:44333/api/author/tour/remove/' + tour.id +  '/' + equipmentId,tour)
  }


}












