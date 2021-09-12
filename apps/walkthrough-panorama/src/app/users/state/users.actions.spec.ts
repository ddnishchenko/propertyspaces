import * as fromUsers from './users.actions';

describe('loadUserss', () => {
  it('should return an action', () => {
    expect(fromUsers.loadUserss().type).toBe('[Users] Load Userss');
  });
});
