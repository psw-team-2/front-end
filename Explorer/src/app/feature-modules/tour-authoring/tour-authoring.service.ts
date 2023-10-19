import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Checkpoint } from './model/checkpoint.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getCheckpoints() : Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>('https://localhost:44333/api/addcheckpoint/checkpoint?page=0&pageSize=0');
  }

  addCheckpoint(checkpoint: Checkpoint) : Observable<Checkpoint>{
    return this.http.post<Checkpoint>('https://localhost:44333/api/addcheckpoint/checkpoint/', checkpoint)
  }

  updateCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint>{
    return this.http.put<Checkpoint>('https://localhost:44333/api/addcheckpoint/checkpoint/' + checkpoint.id, checkpoint)
  }

  deleteCheckpoint(id: number): Observable<Checkpoint> {
    return this.http.delete<Checkpoint>('https://localhost:44333/api/addcheckpoint/checkpoint/' + id);
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `https://localhost:44333/api/addcheckpoint/checkpoint/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
