import { TestBed } from '@angular/core/testing';

import { MembershipsService } from './memberships.service';

describe('MembershipsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MembershipsService = TestBed.get(MembershipsService);
    expect(service).toBeTruthy();
  });
});
