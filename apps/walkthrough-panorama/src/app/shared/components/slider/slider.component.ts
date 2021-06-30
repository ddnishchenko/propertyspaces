import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  @Input() crement = true;
  @Input() step;
  @Input() min;
  @Input() max;
  @Output() input = new EventEmitter();
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

  slide($event) {
    this.value = $event.target.value;
    this.input.emit(this.value);
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
    this.input.emit(this.value);
    this.onChange(this.value);
  }
}
