import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { PictureFormComponent } from './picture-form/picture-form.component';
import { Profile2Component } from './profile2/profile2.component';
import { ProfileForm2Component } from './profile-form2/profile-form2.component';
import { PictureForm2Component } from './picture-form2/picture-form2.component';
import { TourPreferenceModule } from '../tour-preference/tour-preference.module';
import { UserAccountAdministrationComponent } from './user-account-administration/user-account-administration.component';




@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    
    ProfileComponent,
    ProfileFormComponent,
    PictureFormComponent,
    Profile2Component,
    ProfileForm2Component,
    PictureForm2Component,
    UserAccountAdministrationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    TourPreferenceModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ProfileComponent,
    Profile2Component,
    UserAccountAdministrationComponent
  ]
})
export class AdministrationModule { }
