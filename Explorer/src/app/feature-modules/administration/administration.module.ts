import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplicationReviewComponent } from './application-review/application-review.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ApplicationReviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ApplicationReviewComponent
  ]
})
export class AdministrationModule { }
