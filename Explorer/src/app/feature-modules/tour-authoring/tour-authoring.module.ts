import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { CheckpointFormComponent } from './checkpoint-form/checkpoint-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ObjectComponent } from './object-form/object.component';
import { TourComponent } from './tour/tour.component';
import { TourFormComponent } from './tour-form/tour-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/infrastructure/routing/app-routing.module';
import { AddedEquipmentComponent } from './added-equipment/added-equipment.component';
import { TourEquipmentComponent } from './tour-equipment/tour-equipment.component';
import { ViewToursComponent } from './view-tours/view-tours.component';
import { TourOverviewComponent } from './tour-overview/tour-overview.component';
import { ShoppingCartComponent } from '../marketplace/shopping-cart/shopping-cart.component';
import { ViewPurchasedToursComponent } from './view-purchased-tours/view-purchased-tours.component';



@NgModule({
  declarations: [
    CheckpointComponent,
    CheckpointFormComponent,
    TourComponent,
    TourFormComponent,
    TourEquipmentComponent,
    AddedEquipmentComponent,
    ObjectComponent,
    ViewToursComponent,
    TourOverviewComponent,
    ViewPurchasedToursComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    AppRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,

  ],
  exports: [
    CheckpointComponent,
    CheckpointFormComponent,
    TourComponent,
    TourFormComponent,
    TourEquipmentComponent,
    AddedEquipmentComponent,
    ObjectComponent,
  ]
})
export class TourAuthoringModule { }