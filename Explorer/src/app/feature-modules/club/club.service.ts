import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Club } from './model/club.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubRequest } from './model/club-request.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  getClubs(): Observable<PagedResults<Club>> {
    return this.http.get<PagedResults<Club>>(environment.apiHost + 'clubs');
  }

  getClubById(id: number): Observable<Club> {
    return this.http.get<Club>(environment.apiHost + 'clubs/' + id);
  }

  deleteClub(id: number): Observable<Club> {
    return this.http.delete<Club>(environment.apiHost + 'clubs/' + id);
  }

  addClub(club: Club): Observable<Club> {
    return this.http.post<Club>(environment.apiHost + 'clubs', club);
  }

  updateClub(club: Club): Observable<Club> {
    return this.http.put<Club>(environment.apiHost + 'clubs/update/' + club.id, club);
  }

  inviteMember(request: ClubRequest) {
    return this.http.post<ClubRequest>(environment.apiHost + 'clubRequests/sendRequest', request);
  }
  
  sendRequest(clubRequest: ClubRequest): Observable<ClubRequest> {
    return this.http.post<ClubRequest>(environment.apiHost + 'clubRequests/sendRequest', clubRequest);
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `https://localhost:44333/api/clubs/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
