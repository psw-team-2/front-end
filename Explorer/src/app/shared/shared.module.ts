import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map/map.component';

import { MapViewComponent } from './map-view/map-view.component';




@NgModule({
  declarations: [
    MapViewComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MapComponent,
    MapViewComponent
  ],

  
})
export class SharedModule { }
