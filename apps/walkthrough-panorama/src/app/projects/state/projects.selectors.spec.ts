import * as fromProjects from './projects.reducer';
import { selectProjectsState } from './projects.selectors';

describe('Projects Selectors', () => {
  it('should select the feature state', () => {
    const result = selectProjectsState({
      [fromProjects.projectsFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
