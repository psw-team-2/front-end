import { TestBed } from '@angular/core/testing';

import { TourProblemResponseService } from './tour-problem-response.service';

describe('TourProblemResponseService', () => {
  let service: TourProblemResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourProblemResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
