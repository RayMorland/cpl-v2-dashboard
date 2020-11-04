import { TestBed } from '@angular/core/testing';

import { CoordinatorsService } from './coordinators.service';

describe('CoordinatorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoordinatorsService = TestBed.get(CoordinatorsService);
    expect(service).toBeTruthy();
  });
});
