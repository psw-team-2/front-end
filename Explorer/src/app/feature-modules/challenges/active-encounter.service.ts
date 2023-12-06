import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActiveEncounter } from './model/active-encounter.model';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';
import { Encounter } from './model/encounter.model';

@Injectable({
  providedIn: 'root'
})
export class ActiveEncounterService {

  constructor(private http: HttpClient) { }

  getActiveEncounters(): Observable<PagedResults<ActiveEncounter>> {
    return this.http.get<PagedResults<ActiveEncounter>>(environment.apiHost + 'activeEncounter');
  }

  getActiveEncounter(id:number): Observable<ActiveEncounter> {
    return this.http.get<ActiveEncounter>(environment.apiHost + 'activeEncounter/' + id);
  } 

  completeEncounter(activeEncounter: ActiveEncounter): Observable<ActiveEncounter> {
    return this.http.put<ActiveEncounter>(environment.apiHost + 'activeEncounter/completeEncounter', activeEncounter);
  }
  
  levelUp(activeEncounter: ActiveEncounter): Observable<ActiveEncounter> {
    return this.http.put<ActiveEncounter>(environment.apiHost + 'activeEncounter/levelUp', activeEncounter);
  }
}
