import { Directive, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  selector: '[formGroup][propertyspacesConnectForm]'
})
export class ConnectFormDirective {
  @Input('propertyspacesConnectForm')
  set data(val: any) {
    if (val) {
      this.formGroupDirective.form.patchValue(val);
      this.formGroupDirective.form.markAsPristine();
    }
  }
  constructor(private formGroupDirective: FormGroupDirective) {}
}
