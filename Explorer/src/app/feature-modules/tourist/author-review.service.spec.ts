import { TestBed } from '@angular/core/testing';

import { AuthorReviewService } from './author-review.service';

describe('AuthorReviewService', () => {
  let service: AuthorReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
