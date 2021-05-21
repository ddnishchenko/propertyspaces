import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectFormDirective } from './directives/connect-form.directive';
import { SafePipe } from './pipes/safe.pipe';



@NgModule({
  declarations: [
    ConnectFormDirective,
    SafePipe
  ],
  exports: [
    ConnectFormDirective,
    SafePipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
