import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubRequest } from './model/club-request.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class ClubRequestService {

  constructor(private http: HttpClient) { }
  
  getClubRequests(): Observable<PagedResults<ClubRequest>> {
    return this.http.get<PagedResults<ClubRequest>>(environment.apiHost + 'clubRequests');
  }
  
  withdrawRequest(id: number): Observable<ClubRequest> {
    return this.http.delete<ClubRequest>(environment.apiHost + 'clubRequests/withdrawRequest/' + id);
  }
 
  acceptRequest(clubRequest: ClubRequest): Observable<ClubRequest> {
    return this.http.post<ClubRequest>(environment.apiHost + 'clubRequests/acceptRequest', clubRequest);
  }

  rejectRequest(clubRequest: ClubRequest): Observable<ClubRequest> {
    return this.http.post<ClubRequest>(environment.apiHost + 'clubRequests/rejectRequest', clubRequest);
  }

}