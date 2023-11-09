import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { CheckpointFormComponent } from './checkpoint-form/checkpoint-form.component';
import { TourComponent } from './tour/tour.component';
import { TourFormComponent } from './tour-form/tour-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/infrastructure/routing/app-routing.module';
import { ViewToursAuthorComponent } from './view-tours-author/view-tours-author.component';



@NgModule({
  declarations: [
    CheckpointComponent,
    CheckpointFormComponent,
    TourComponent,
    TourFormComponent,
    ViewToursAuthorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    CheckpointComponent,
    CheckpointFormComponent,
    TourComponent,
    TourFormComponent
  ]
})
export class TourAuthoringModule { }