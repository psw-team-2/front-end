import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Equipment } from './model/equipment.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
    providedIn: 'root'
  })

export class TourAuthoringService {

    constructor(private http: HttpClient) { }
  
    getEquipment(): Observable<PagedResults<Equipment>> {
      return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'tour-authoring/equipment')
    }
  
    deleteEquipment(id: number): Observable<Equipment> {
      return this.http.delete<Equipment>(environment.apiHost + 'tour-authoring/equipment' + id);
    }
  
    addEquipment(equipment: Equipment): Observable<Equipment> {
      return this.http.post<Equipment>(environment.apiHost + 'tour-authoring/equipment', equipment);
    }
  
    updateEquipment(equipment: Equipment): Observable<Equipment> {
      return this.http.put<Equipment>(environment.apiHost + 'tour-authoring/equipment' + equipment.id, equipment);
    }

    addEquipmentToTour(equipment: Equipment) : Observable<Equipment>{
      return this.http.post<Equipment>(environment.apiHost + 'tour-authoring/equipment', equipment)
    }

    removeEquipmentFromTour(equipment: Equipment, tour: Tour) : Observable<Equipment>{
      return this.http.post<Equipment>('https://localhost:44333/api/author/tour/tourEquipment/' + equipment.id + '/' + equipment,tour)
    }
  
}







