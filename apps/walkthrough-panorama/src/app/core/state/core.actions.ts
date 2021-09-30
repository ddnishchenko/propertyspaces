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


export const forgotPassword = createAction(
  `${prefix} Forgot password`,
  props<{ email: string }>()
);

export const resetPassword = createAction(
  `${prefix} Reset Password`,
  props<{ data: { password: string; passwordConfirmation: string; resetToken: string; } }>()
)


export const loadProfile = createAction(
  `${prefix} Load Profile`
);

export const loadProfileSuccess = createAction(
  `${prefix} Load Profile`
);

export const loadProfileFailure = createAction(
  `${prefix} Load Profile`
);
