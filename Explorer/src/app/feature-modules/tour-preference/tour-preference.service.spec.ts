import { TestBed } from '@angular/core/testing';

import { TourPreferenceService } from './tour-preference.service';

describe('TourPreferenceService', () => {
  let service: TourPreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourPreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
