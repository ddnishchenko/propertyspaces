import { createAction, props } from '@ngrx/store';

const prefix = '[Core]';

export const register = createAction(
  `${prefix} Register`,
  props<{ user: { email: string; password: string; passwordConfirmation: string; termsCheck: boolean } }>()
);

export const registerSuccess = createAction(
  `${prefix} Register Success`
);

export const registerFailure = createAction(
  `${prefix} Register Failure`
);

export const login = createAction(
  `${prefix} Login`,
  props<{ credentials: { email: string; password: string; } }>()
);

export const loginSuccess = createAction(
  `${prefix} Login Success`,
  props<{ accessToken: string }>()
);

export const loginFailure = createAction(
  `${prefix} Login Failure`
);


export const logout = createAction(
  `${prefix} Logout`
);