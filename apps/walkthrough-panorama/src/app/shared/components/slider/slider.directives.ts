import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[propertyspacesSliderPlus]'
})
export class SliderPlusDirective {
    constructor(public template: TemplateRef<any>) {}
}

@Directive({
    selector: '[propertyspacesSliderMinus]'
})
export class SliderMinusDirective {
    constructor(public template: TemplateRef<any>) {}
}