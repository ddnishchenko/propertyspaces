import { TestBed } from '@angular/core/testing';

import { ResetTokenGuard } from './reset-token.guard';

describe('ResetTokenGuard', () => {
  let guard: ResetTokenGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ResetTokenGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
