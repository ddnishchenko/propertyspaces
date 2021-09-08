import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAccount from './account.reducer';

export const selectAccountState = createFeatureSelector<fromAccount.State>(
  fromAccount.accountFeatureKey
);

export const selectAccount = createSelector(selectAccountState, state => state.account);
