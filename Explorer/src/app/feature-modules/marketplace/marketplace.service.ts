import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationReview } from './model/application-review.model'; // Updated import
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Equipment } from '../administration/model/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getApplicationReview(): Observable<PagedResults<ApplicationReview>> { 
    return this.http.get<PagedResults<ApplicationReview>>(environment.apiHost + 'tourist/applicationReview'); 
  }

  deleteApplicationReview(id: number): Observable<ApplicationReview> { 
    return this.http.delete<ApplicationReview>(environment.apiHost + 'tourist/applicationReview/' + id); 
  }

  addApplicationReview(applicationReview: ApplicationReview): Observable<ApplicationReview> { 
    return this.http.post<ApplicationReview>(environment.apiHost + 'tourist/applicationReview', applicationReview); 
  }

  updateApplicationReview(applicationReview: ApplicationReview): Observable<ApplicationReview> { 
    return this.http.put<ApplicationReview>(environment.apiHost + 'tourist/applicationReview/' + applicationReview.id, applicationReview); // Updated endpoint
  }
}
