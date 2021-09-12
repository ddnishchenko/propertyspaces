import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule, NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedModule } from '../shared/shared.module';
import { UsersEffects } from './state/users.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromAccount from './state/users.reducer';


@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbCollapseModule,
    NgbModalModule,
    NgbTypeaheadModule,
    UsersRoutingModule,
    StoreModule.forFeature(fromAccount.usersFeatureKey, fromAccount.reducer),
    EffectsModule.forFeature([UsersEffects])
  ]
})
export class UsersModule { }
