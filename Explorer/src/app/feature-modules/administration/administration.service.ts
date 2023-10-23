import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ApplicationReview } from './../marketplace/model/application-review.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }


  getApplicationReview(): Observable<PagedResults<ApplicationReview>> {
    return this.http.get<PagedResults<ApplicationReview>>(environment.apiHost + 'tourist/applicationReview');
  }
  
  deleteApplicationReview(id: number): Observable<ApplicationReview> {
    return this.http.delete<ApplicationReview>(environment.apiHost + 'tourist/applicationReview' + id);
  }
  
  addApplicationReview(applicationReview: ApplicationReview): Observable<ApplicationReview> {
    return this.http.post<ApplicationReview>(environment.apiHost + 'tourist/applicationReview', applicationReview);
  }
  
  updateApplicationReview(applicationReview: ApplicationReview): Observable<ApplicationReview> {
    return this.http.put<ApplicationReview>(environment.apiHost + 'tourist/applicationReview' + applicationReview.id, applicationReview);
  }
  

}
