import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Club } from './model/club.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubRequest } from './model/club-request.model';
import { ClubMessage } from './model/club-message.model';

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

  getClubMessages(clubId : number): Observable<PagedResults<ClubMessage>> {
    return this.http.get<PagedResults<ClubMessage>>('https://localhost:44333/api/club/' + clubId + '/chatroom');
  }

  addClubMessage(clubMessage: ClubMessage): Observable<ClubMessage> {
    return this.http.post<ClubMessage>('https://localhost:44333/api/club', clubMessage);
  }

  getAllMembers(clubId: number): Observable<Array<number>> {
    return this.http.get<Array<number>>(environment.apiHost + 'clubs/' + clubId + '/allMembers');
  }

  inviteMembersToTour(clubId: number, senderId: number, tourId: number, invitedMemberIds: number[]): Observable<boolean> {
    const params = new HttpParams()
    .set('senderId', senderId.toString())
    .set('tourId', tourId.toString());

    return this.http.post<boolean>(environment.apiHost + `clubs/${clubId}/inviteMembersToTour`, invitedMemberIds, { params: params });
  }
}
