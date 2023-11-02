import { TestBed } from '@angular/core/testing';

import { MapSearchService } from './map-search.service';

describe('MapSearchService', () => {
  let service: MapSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
