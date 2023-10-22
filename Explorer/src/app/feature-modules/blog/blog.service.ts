import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogComment } from './model/blog-comment.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  getBlogComment(): Observable<PagedResults<BlogComment>> {
    return this.http.get<PagedResults<BlogComment>>(environment.apiHost + 'tourist/comment')
  }

  deleteBlogComment(id: number): Observable<BlogComment> {
    return this.http.delete<BlogComment>(environment.apiHost + 'tourist/comment/' + id);
  }

  addBlogComment(comment: BlogComment): Observable<BlogComment> {
    return this.http.post<BlogComment>(environment.apiHost + 'tourist/comment', comment);
  }

  updateBlogComment(comment: BlogComment): Observable<BlogComment> {
    return this.http.put<BlogComment>(environment.apiHost + 'tourist/comment/' + comment.id, comment);
  }

}
