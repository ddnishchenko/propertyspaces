import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileResolver } from './services/profile.resolver';

export const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: '',
        component: ProfileComponent,
        resolve: {
          profile: ProfileResolver
        },
        data: {
          title: 'Account'
        }
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: {
          title: 'Change Password'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
