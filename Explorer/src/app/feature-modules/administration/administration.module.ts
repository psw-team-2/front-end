import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserAccountAdministrationComponent } from './user-account-administration/user-account-administration.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    UserAccountAdministrationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    UserAccountAdministrationComponent
  ]
})
export class AdministrationModule { }
