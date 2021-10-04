import { Directive, EventEmitter, forwardRef, HostListener, Output, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Compressor from 'compressorjs';
import { fileToBase64 } from '../../utils';

export interface InputFileReaderOptions {
  compress?: boolean;
  /**
   * Does not work with compress: true
   */
  readAs?: 'Text' | 'DataURL' | 'BinaryString' | 'ArrayBuffer';
  maxWidth?: number;
  maxHeight?: number;
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
  private fileReader = new FileReader();
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
          maxWidth: this.propertyspacesInputFileReader.maxWidth || 2560,
          maxHeight: this.propertyspacesInputFileReader.maxHeight || 1600,
          async success(file) {
            $this.value = await fileToBase64(file);
            $this.changed.emit({ file, result: $this.value });
            $this.onChange($this.value);
            $this.changeRef.detectChanges();
          }
        });
      } else {
        this.fileReader.onload = ev => {
          this.value = ev.target.result;
          this.changed.emit({ file: $event.target.files[0], result: this.value });
          this.onChange(this.value);
          this.changeRef.detectChanges();
        }
        this.fileReader[`readAs${this.propertyspacesInputFileReader.readAs}`]($event.target.files[0]);
      }

    }

  }
  constructor(private changeRef: ChangeDetectorRef) { }
  ngOnInit() {
    const defaultOptions: InputFileReaderOptions = {
      compress: false,
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
