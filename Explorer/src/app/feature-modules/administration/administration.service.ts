import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { User } from './model/user-account.model';
import { Profile } from './model/profile.model';

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

  getUserAccounts():Observable<PagedResults<User>>{
    return this.http.get<PagedResults<User>>(environment.apiHost + 'administration/userAccounts')
  }
  
  deactivateUserAccount(user: User): Observable<User> {
    return this.http.put<User>(environment.apiHost + 'administration/userAccounts/' + user.id, user);
  }

  // dodato
  // PROFIL
  getByUserId(): Observable<Profile> {
    return this.http.get<Profile>('https://localhost:44333/api/administration/profile/by-user');
  }

  getByUserId2(): Observable<Profile> {
    return this.http.get<Profile>('https://localhost:44333/api/administration/profile2/by-user');
  }
  
  updateProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>('https://localhost:44333/api/administration/profile/' + profile.id + '/' + profile.userId, profile);
  }

  updateProfile2(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>('https://localhost:44333/api/administration/profile2/' + profile.id + '/' + profile.userId, profile)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Request failed:', error);
          return throwError('An error occurred. Please try again later.');
        })
      );
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `https://localhost:44333/api/administration/profile/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  upload2(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `https://localhost:44333/api/administration/profile2/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
