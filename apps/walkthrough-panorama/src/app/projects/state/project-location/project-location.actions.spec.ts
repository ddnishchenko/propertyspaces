import * as fromProjectLocation from './project-location.actions';

describe('loadProjectLocations', () => {
  it('should return an action', () => {
    expect(fromProjectLocation.loadProjectLocations().type).toBe('[ProjectLocation] Load ProjectLocations');
  });
});
