import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourPreferenceFieldComponent } from './tour-preference-field/tour-preference-field.component';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TourPreferenceSettingsComponent } from './tour-preference-settings/tour-preference-settings.component';

@NgModule({
  declarations: [
    TourPreferenceFieldComponent,
    TourPreferenceSettingsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    TourPreferenceFieldComponent,
    TourPreferenceSettingsComponent
  ]
})
export class TourPreferenceModule { }
