// input-range-validator.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[type=number][appInputRangeValidator]'
})
export class InputRangeValidatorDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input') onInput() {
    const inputElement = this.el.nativeElement;

    const minValue = parseFloat(inputElement.min);
    const maxValue = parseFloat(inputElement.max);
    const currentValue = parseFloat(inputElement.value);

    if (currentValue < minValue || isNaN(currentValue)) {
      inputElement.value = String(minValue);
    } else if (currentValue > maxValue) {
      inputElement.value = String(maxValue);
    }
  }
}
