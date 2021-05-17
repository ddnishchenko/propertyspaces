import { TestBed } from '@angular/core/testing';

import { PanoramasResolver } from './panoramas.resolver';

describe('PanoramasResolver', () => {
  let resolver: PanoramasResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PanoramasResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
