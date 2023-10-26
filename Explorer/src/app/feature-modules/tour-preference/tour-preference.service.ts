import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TourPreference } from './model/tour-preference.model';

@Injectable({
  providedIn: 'root'
})
export class TourPreferenceService {

  constructor(private http: HttpClient) { }

  getPreference(): Observable<TourPreference> {
    return this.http.get<TourPreference>(environment.apiHost + 'tourists/preference/byTourist')
  }

  deletePreference(id: number): Observable<TourPreference> {
    return this.http.delete<TourPreference>(environment.apiHost + 'tourists/preference/' + id);
  }

  addPreference(tourPreference: TourPreference): Observable<TourPreference> {
    return this.http.post<TourPreference>(environment.apiHost + 'tourists/preference/', tourPreference);
  }

  updatePreference(tourPreference: TourPreference): Observable<TourPreference> {
    return this.http.put<TourPreference>(environment.apiHost + 'tourists/preference/' + tourPreference.id, tourPreference);
  }
}
