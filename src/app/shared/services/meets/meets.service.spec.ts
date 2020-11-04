import { TestBed } from '@angular/core/testing';

import { MeetsService } from './meets.service';

describe('MeetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeetsService = TestBed.get(MeetsService);
    expect(service).toBeTruthy();
  });
});
