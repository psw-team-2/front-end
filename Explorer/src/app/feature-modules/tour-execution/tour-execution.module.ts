import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouristPositionComponent } from './tourist-position/tourist-position.component';
import { TouristPositionMapComponent } from './tourist-position-map/tourist-position-map.component';
import { ActiveTourComponent } from './active-tour/active-tour.component';
import { ExecutionMapComponent } from './execution-map/execution-map.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    TouristPositionComponent,
    TouristPositionMapComponent,
    ActiveTourComponent,
    ExecutionMapComponent,

  ],
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  providers:[]
})
export class TourExecutionModule { }
