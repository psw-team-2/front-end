import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourFormComponent } from './tour-form/tour-form.component';
import { TourComponent } from './tour/tour.component';



@NgModule({
  declarations: [
    TourFormComponent,
    TourComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TourAuthoringModule { }
