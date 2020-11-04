import { TestBed } from '@angular/core/testing';

import { CoordinatorApplicationsService } from './coordinator-applications.service';

describe('CoordinatorApplicationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoordinatorApplicationsService = TestBed.get(CoordinatorApplicationsService);
    expect(service).toBeTruthy();
  });
});
