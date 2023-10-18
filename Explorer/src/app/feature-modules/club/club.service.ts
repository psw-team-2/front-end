import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Club } from './model/club.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  getClub(): Observable<PagedResults<Club>> {
    return this.http.get<PagedResults<Club>>(environment.apiHost + 'clubs')
  }

  addClub(club: Club): Observable<Club> {
    return this.http.post<Club>(environment.apiHost + 'clubs', club);
  }

}
