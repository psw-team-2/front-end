import { TestBed } from '@angular/core/testing';

import { ClubRequestService } from './club-request.service';

describe('ClubRequestService', () => {
  let service: ClubRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClubRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
