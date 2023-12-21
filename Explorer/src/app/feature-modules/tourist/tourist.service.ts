import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Equipment } from '../administration/model/equipment.model';
import { PurchaseReport } from './model/purchase-report.model';
import { Tour } from '../tour-authoring/model/tour.model';

@Injectable({
  providedIn: 'root'
})
export class TouristService {

  constructor(private http: HttpClient) { }

  getPurchaseReportsByTouristId(userId: number): Observable<PurchaseReport[]> {
    return this.http.get<PurchaseReport[]>(`https://localhost:44333/api/tourist/purchaseReport/byTourist/${userId}`);
  }

  getTourById(tourId: number): Observable<Tour> {
    return this.http.get<Tour>(`https://localhost:44333/api/author/tour/${tourId}`);
  }
}
