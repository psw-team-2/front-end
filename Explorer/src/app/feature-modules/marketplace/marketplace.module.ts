import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TourReviewComponent } from './tour-review/tour-review.component';

import { ApplicationReviewFormComponent } from './application-review-form/application-review-form.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SaleFormComponent } from './sale-form/sale-form.component';
import { EditSaleComponent } from './edit-sale/edit-sale.component';



@NgModule({
  declarations: [
    TourReviewFormComponent,
    TourReviewComponent,
    ApplicationReviewFormComponent,
    ShoppingCartComponent,
    SaleFormComponent,
    EditSaleComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
  ],
  exports: [
   TourReviewFormComponent,
   TourReviewComponent,
   ApplicationReviewFormComponent,
  ]
})
export class MarketplaceModule { }
