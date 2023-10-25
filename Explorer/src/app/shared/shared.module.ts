import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from './map-view/map-view.component';



@NgModule({
  declarations: [
    MapViewComponent
  ],
  imports: [
    CommonModule,
  ],
  exports :[
    MapViewComponent
  ]
})
export class SharedModule { }
