import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { CheckpointFormComponent } from './checkpoint-form/checkpoint-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CheckpointComponent,
    CheckpointFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    CheckpointComponent,
    CheckpointFormComponent
  ]
})
export class TourAuthoringModule { }
