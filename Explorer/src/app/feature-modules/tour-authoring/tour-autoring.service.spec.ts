import { TestBed } from '@angular/core/testing';

import { TourAutoringService } from './tour-autoring.service';

describe('TourAutoringService', () => {
  let service: TourAutoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourAutoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
