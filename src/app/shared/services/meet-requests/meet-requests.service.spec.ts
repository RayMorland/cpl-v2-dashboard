import { TestBed } from '@angular/core/testing';

import { MeetRequestsService } from './meet-requests.service';

describe('MeetRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeetRequestsService = TestBed.get(MeetRequestsService);
    expect(service).toBeTruthy();
  });
});
