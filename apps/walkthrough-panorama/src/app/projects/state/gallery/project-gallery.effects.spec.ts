import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ProjectGalleryEffects } from './project-gallery.effects';

describe('ProjectGalleryEffects', () => {
  let actions$: Observable<any>;
  let effects: ProjectGalleryEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectGalleryEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(ProjectGalleryEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
