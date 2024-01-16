import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map/map.component';

import { MapViewComponent } from './map-view/map-view.component';
import { MapSearchComponent } from './map-search/map-search.component';
import { ComposedTourMapComponent } from './composed-tour-map/composed-tour-map.component';
import { CheckpointsComponent } from './checkpoints/checkpoints.component';
import { CheckpointModalComponent } from './checkpoint-modal/checkpoint-modal.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    MapViewComponent,
    MapComponent,
    MapSearchComponent,
    ComposedTourMapComponent,
    CheckpointsComponent,
    CheckpointModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  exports: [
    MapComponent,
    MapViewComponent,
    MapSearchComponent
  ],

  
})
export class SharedModule { }
