import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourPreferenceFieldComponent } from './tour-preference-field/tour-preference-field.component';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TourPreferenceFieldComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    TourPreferenceFieldComponent
  ]
})
export class TourPreferenceModule { }
