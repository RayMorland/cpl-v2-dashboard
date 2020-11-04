import { TestBed } from '@angular/core/testing';

import { RecordGroupsService } from './record-groups.service';

describe('RecordGroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecordGroupsService = TestBed.get(RecordGroupsService);
    expect(service).toBeTruthy();
  });
});
