import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import {Observable,map} from 'rxjs';
import { Object } from './model/object.model';
import { HttpRequest } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TourAutoringService {

  constructor(private http: HttpClient) { }




addObject( object: Object): Observable<Object>
{
  return this.http.post<Object>(environment.apiHost+ 'administration/object',object)
}

upload(file: File): Observable<HttpEvent<any>> {
  const formData: FormData = new FormData();

  formData.append('file', file);

  const req = new HttpRequest('POST', `https://localhost:44333/api/administration/object/UploadFile`, formData, {
    reportProgress: true,
    responseType: 'json'
  });

  return this.http.request(req);
}

}
