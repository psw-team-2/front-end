import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncounterFormComponent } from './encounter-form/encounter-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ActiveEncounterComponent } from './active-encounter/active-encounter.component';



@NgModule({
  declarations: [
    EncounterFormComponent,
    ActiveEncounterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    EncounterFormComponent,
    ActiveEncounterComponent,
  ]
})
export class EncounterModule { }
