import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map/map.component';

import { MapViewComponent } from './map-view/map-view.component';
import { MapSearchComponent } from './map-search/map-search.component';




@NgModule({
  declarations: [
    MapViewComponent,
    MapComponent,
    MapSearchComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MapComponent,
    MapViewComponent,
    MapSearchComponent
  ],

  
})
export class SharedModule { }
