import * as fromProjects from './projects.actions';

describe('loadProjectss', () => {
  it('should return an action', () => {
    expect(fromProjects.loadProjectss().type).toBe('[Projects] Load Projectss');
  });
});
