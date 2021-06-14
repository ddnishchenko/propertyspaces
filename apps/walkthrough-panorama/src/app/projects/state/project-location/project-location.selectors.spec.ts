import * as fromProjectLocation from './project-location.reducer';
import { selectProjectLocationState } from './project-location.selectors';

describe('ProjectLocation Selectors', () => {
  it('should select the feature state', () => {
    const result = selectProjectLocationState({
      [fromProjectLocation.projectLocationFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
