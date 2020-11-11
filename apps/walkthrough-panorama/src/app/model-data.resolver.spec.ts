import { TestBed } from '@angular/core/testing';

import { ModelDataResolver } from './model-data.resolver';

describe('ModelDataResolver', () => {
  let service: ModelDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelDataResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
