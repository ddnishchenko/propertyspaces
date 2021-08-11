import { TestBed } from '@angular/core/testing';

import { AwsServiceService } from './aws-service.service';

describe('AwsServiceService', () => {
  let service: AwsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
