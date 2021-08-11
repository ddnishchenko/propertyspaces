import { Directive, EventEmitter, forwardRef, HostListener, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Compressor from 'compressorjs';
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
  @Output() changed = new EventEmitter();
  onChange = (value) => { };
  onTouched = (value) => { };

  @HostListener('change', ['$event']) async inputChange($event) {
    if ($event.target.files.length) {
      const $this = this;
      new Compressor($event.target.files[0], {
        quality: 0.8,
        maxWidth: 2560,
        maxHeight: 1600,
        async success(file) {
          $this.value = await fileToBase64(file);
          $this.changed.emit({ file, base64File: $this.value });
          $this.onChange($this.value);
        }
      });
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
