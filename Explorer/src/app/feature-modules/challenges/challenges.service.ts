import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Challenge } from './model/challenge.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {

  constructor(private http: HttpClient) { }

  getChallenges(): Observable<PagedResults<Challenge>> {
    return this.http.get<PagedResults<Challenge>>(environment.apiHost + 'administrator/challenge');
  }
}
