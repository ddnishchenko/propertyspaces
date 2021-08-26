import { Directive, EventEmitter, forwardRef, HostListener, Output, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Compressor from 'compressorjs';
import { fileToBase64 } from '../../utils';

export interface InputFileReaderOptions {
  compress?: boolean;
  /**
   * Does not work with compress: true
   */
  readAs?: 'Text' | 'DataURL' | 'BinaryString' | 'ArrayBuffer';
}

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
export class InputFileReaderDirective implements OnInit, ControlValueAccessor {
  value: string | ArrayBuffer;
  @Input() propertyspacesInputFileReader: InputFileReaderOptions = {};
  @Output() changed = new EventEmitter();
  onChange = (value) => { };
  onTouched = (value) => { };

  @HostListener('change', ['$event']) async inputChange($event) {
    if ($event.target.files.length) {
      const $this = this;
      if (this.propertyspacesInputFileReader.compress) {
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
      } else {
        const fileReader = new FileReader();
        fileReader.onload = ev => {
          this.value = ev.target.result;
          this.changed.emit({ file: $event.target.files[0], textFile: this.value });
          this.onChange(this.value);
        }
        fileReader[`readAs${this.propertyspacesInputFileReader.readAs}`]($event.target.files[0]);
      }

    }

  }

  ngOnInit() {
    const defaultOptions: InputFileReaderOptions = {
      compress: true,
      readAs: 'DataURL'
    };
    this.propertyspacesInputFileReader = {
      ...defaultOptions,
      ...this.propertyspacesInputFileReader,
    };
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
