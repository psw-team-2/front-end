import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthorReview } from './model/author-review.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorReviewService {

  constructor(private http: HttpClient) { }

  getAllAuthorReviews(): Observable<PagedResults<AuthorReview>> {
    return this.http.get<PagedResults<AuthorReview>>(environment.apiHost + 'tourist/authorReview');
  }

  addReview(authorReview: AuthorReview, touristId: number): Observable<AuthorReview> {
    return this.http.post<AuthorReview>(environment.apiHost + 'tourist/authorReview/' + touristId, authorReview);
  }

  getAuthorReviews(authorId:number) : Observable<PagedResults<AuthorReview>>{
    return this.http.get<PagedResults<AuthorReview>>(environment.apiHost + 'tourist/authorReview/' + authorId);
  } 

  disapproveReview(reviewId: number): Observable<AuthorReview> {
    return this.http.put<AuthorReview>(environment.apiHost + 'tourist/authorReview/' + reviewId + '/disapproved', null);
  }
}
