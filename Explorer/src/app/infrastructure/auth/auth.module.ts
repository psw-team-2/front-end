import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { RecoverComponent } from './recover/recover.component';
import { RegistrationCompletedComponent } from './registration-completed/registration-completed.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    PasswordRecoveryComponent,
    RecoverComponent,
    RegistrationCompletedComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    LoginComponent
  ]
})
export class AuthModule { }
