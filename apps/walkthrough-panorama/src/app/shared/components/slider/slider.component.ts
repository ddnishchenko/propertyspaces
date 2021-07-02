import { Component, ContentChild, EventEmitter, forwardRef, Input, Output, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SliderMinusDirective, SliderPlusDirective } from './slider.directives';

@Component({
  selector: 'propertyspaces-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ]
})
export class SliderComponent implements ControlValueAccessor {
  @ContentChild(SliderPlusDirective, {read: TemplateRef}) plusTpl: TemplateRef<any>;
  @ContentChild(SliderMinusDirective, {read: TemplateRef}) minusTpl: TemplateRef<any>;
  @Input() customClass = '';
  @Input() showCrement = true;
  @Input() showValue = true;
  @Input() step;
  @Input() min;
  @Input() max;
  @Output() slide = new EventEmitter();
  value;

  onChange = (value) => {};
  onTouched = (value) => {};

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  writeValue(value: number) {
    this.value = value;
  }

  changing($event) {
    this.value = +$event.target.value;
    this.slide.emit(this.value);
    this.onChange(this.value);
  }

  crementControl(step) {
    let fix = 0;
    const decimal = step.toString().split('.');
    if (decimal[1]) {
      fix = decimal[1].length;
    }
    const n = +this.value + (+step);
    const rn = n.toFixed(fix);
    this.value = +rn;
    this.slide.emit(this.value);
    this.onChange(this.value);
  }
}
