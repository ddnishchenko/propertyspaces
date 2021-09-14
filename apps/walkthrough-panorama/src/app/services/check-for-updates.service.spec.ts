import { TestBed } from '@angular/core/testing';

import { CheckForUpdatesService } from './check-for-updates.service';

describe('CheckForUpdatesService', () => {
  let service: CheckForUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckForUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
