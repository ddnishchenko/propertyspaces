import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersResolver } from './services/users.resolver';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    resolve: {
      users: UsersResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
