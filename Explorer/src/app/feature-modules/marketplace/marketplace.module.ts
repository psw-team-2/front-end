import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationReviewComponent } from './application-review/application-review.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ApplicationReviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    ApplicationReviewComponent,
  ]
})
export class MarketplaceModule { }
