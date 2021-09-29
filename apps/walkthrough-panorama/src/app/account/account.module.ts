import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StoreModule } from '@ngrx/store';
import * as fromAccount from './state/account.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AccountEffects } from './state/account.effects';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AccountComponent,
    ProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    NgbNavModule,
    SharedModule,
    StoreModule.forFeature(fromAccount.accountFeatureKey, fromAccount.reducer),
    EffectsModule.forFeature([AccountEffects])
  ]
})
export class AccountModule { }
