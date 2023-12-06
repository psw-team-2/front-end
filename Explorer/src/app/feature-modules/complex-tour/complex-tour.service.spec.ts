import { TestBed } from '@angular/core/testing';
import { ComplexTourService } from './complex-tour.service';
describe('ClubService', () => {
  let service: ComplexTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplexTourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
