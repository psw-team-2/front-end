import { Injectable } from '@angular/core';
import { BlogComment } from './model/blog-comment.model';
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

  getBlogsByUserId(id: number): Observable<PagedResults<Blog>> {
    return this.http.get<PagedResults<Blog>>(environment.apiHost + 'tourist/blog/byUser/' + id);
  }
  getCommentsByBlogId(id: number): Observable<PagedResults<BlogComment>> {
    return this.http.get<PagedResults<BlogComment>>(environment.apiHost + 'tourist/comment/byBlog/' + id);
  }

}
