import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplicationReviewComponent } from './application-review/application-review.component';



import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { ProfileComponent } from './profile/profile.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { PictureFormComponent } from './picture-form/picture-form.component';
import { Profile2Component } from './profile2/profile2.component';
import { ProfileForm2Component } from './profile-form2/profile-form2.component';
import { PictureForm2Component } from './picture-form2/picture-form2.component';
import { TourPreferenceModule } from '../tour-preference/tour-preference.module';
import { UserAccountAdministrationComponent } from './user-account-administration/user-account-administration.component';
import { PublicRequestsComponent } from './public-requests/public-requests.component';
import { ModalComponent } from './public-requests/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,

    ApplicationReviewComponent,
    ProfileComponent,
    ProfileFormComponent,
    PictureFormComponent,
    Profile2Component,
    ProfileForm2Component,
    PictureForm2Component,
    UserAccountAdministrationComponent,
    PublicRequestsComponent,
    ModalComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    TourPreferenceModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ApplicationReviewComponent,
    ProfileComponent,
    Profile2Component,
    UserAccountAdministrationComponent,
    PublicRequestsComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AdministrationModule { }
