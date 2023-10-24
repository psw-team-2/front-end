import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Blog } from './model/blog.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }
  getBlogs(): Observable<PagedResults<Blog>> {
    return this.http.get<PagedResults<Blog>>(environment.apiHost + 'tourist/blog')
  }

  deleteBlog(id: number): Observable<Blog> {
    return this.http.delete<Blog>(environment.apiHost + 'tourist/blog/' + id);
  }

  getBlog(id: number): Observable<Blog> {
    return this.http.get<Blog>(environment.apiHost + 'tourist/blog/' + id);
  }

  addBlog(blog: Blog): Observable<Blog> {
    return this.http.post<Blog>(environment.apiHost + 'tourist/blog', blog);
  }

  updateBlog(blog: Blog): Observable<Blog> {
    return this.http.put<Blog>(environment.apiHost + 'tourist/blog/' + blog.id, blog);
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', 'https://localhost:44333/api/tourist/blog/UploadFile', formData,{
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
