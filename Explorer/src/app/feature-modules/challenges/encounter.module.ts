import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncounterFormComponent } from './encounter-form/encounter-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EncounterFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    EncounterFormComponent
  ]
})
export class EncounterModule { }
