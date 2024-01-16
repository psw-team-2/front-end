import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { CheckpointFormComponent } from './checkpoint-form/checkpoint-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ObjectComponent } from './object-form/object.component';
import { TourComponent } from './tour/tour.component';
import { TourFormComponent } from './tour-form/tour-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/infrastructure/routing/app-routing.module';
import { ViewToursAuthorComponent } from './view-tours-author/view-tours-author.component';
import { AddedEquipmentComponent } from './added-equipment/added-equipment.component';
import { TourEquipmentComponent } from './tour-equipment/tour-equipment.component';
import { ViewToursComponent } from './view-tours/view-tours.component';
import { TourOverviewComponent } from './tour-overview/tour-overview.component';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { ShoppingCartComponent } from '../marketplace/shopping-cart/shopping-cart.component';
import { ViewPurchasedToursComponent } from './view-purchased-tours/view-purchased-tours.component';
import { EncounterModule } from '../challenges/encounter.module';
import { BundleManagementComponent } from './bundle-management/bundle-management.component';
import { BundleFormComponent } from './bundle-form/bundle-form.component';
import { BundleDataFormComponent } from './bundle-data-form/bundle-data-form.component';
import { BundleOverviewComponent } from './bundle-overview/bundle-overview.component';
import { BundleUpdateFormComponent } from './bundle-update-form/bundle-update-form.component';
import { BundleViewComponent } from './bundle-view/bundle-view.component';
import { WishlistOverviewComponent } from './wishlist-overview/wishlist-overview.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TpFormComponent } from '../tour-problem/tp-form/tp-form.component';
import { TourProblemModule } from '../tour-problem/tour-problem.module';
import { GiftCardComponent } from './gift-card/gift-card.component';
import { TourCreationComponent } from './tour-creation/tour-creation.component';



@NgModule({
  declarations: [
    CheckpointComponent,
    CheckpointFormComponent,
    TourComponent,
    TourFormComponent,
    ViewToursAuthorComponent,
    TourEquipmentComponent,
    AddedEquipmentComponent,
    ObjectComponent,
    ViewToursComponent,
    TourOverviewComponent,
    ViewPurchasedToursComponent,
    BundleManagementComponent,
    BundleFormComponent,
    BundleDataFormComponent,
    BundleOverviewComponent,
    BundleUpdateFormComponent,
    BundleViewComponent,
    WishlistOverviewComponent,
    GiftCardComponent,
    TourCreationComponent,

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
    MarketplaceModule,
    FormsModule,
    EncounterModule,
    MatSnackBarModule,
    MatTooltipModule,
    TourProblemModule
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