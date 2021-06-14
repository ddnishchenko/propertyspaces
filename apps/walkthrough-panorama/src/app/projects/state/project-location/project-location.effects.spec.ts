import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ProjectLocationEffects } from './project-location.effects';

describe('ProjectLocationEffects', () => {
  let actions$: Observable<any>;
  let effects: ProjectLocationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectLocationEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(ProjectLocationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
