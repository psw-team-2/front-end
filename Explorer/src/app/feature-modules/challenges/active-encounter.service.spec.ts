import { TestBed } from '@angular/core/testing';

import { ActiveEncounterService } from './active-encounter.service';

describe('ActiveEncounterService', () => {
  let service: ActiveEncounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveEncounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
