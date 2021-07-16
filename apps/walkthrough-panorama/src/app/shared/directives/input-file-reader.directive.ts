import { Directive, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fileToBase64 } from '../../utils';

@Directive({
  selector: 'input[type="file"][propertyspacesInputFileReader]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileReaderDirective),
      multi: true
    }
  ]
})
export class InputFileReaderDirective implements ControlValueAccessor {
  value: string | ArrayBuffer;
  onChange = (value) => {};
  onTouched = (value) => {};
  @HostListener('change', ['$event']) async inputChange($event) {
    if ($event.target.files.length) {
      this.value = await fileToBase64($event.target.files[0]);
      this.onChange(this.value);
    }

  }
  registerOnChange(onChange) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched) {
    this.onTouched = onTouched;
  }
  writeValue(value: string) {
    this.value = value;
  }
}
