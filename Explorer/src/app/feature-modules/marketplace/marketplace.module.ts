import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TourReviewComponent } from './tour-review/tour-review.component';


@NgModule({
  declarations: [
    TourReviewFormComponent,
    TourReviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
   TourReviewFormComponent
  ]
})
export class MarketplaceModule { }
