import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationReviewFormComponent } from './application-review-form/application-review-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ApplicationReviewFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    ApplicationReviewFormComponent,
  ]
})
export class MarketplaceModule { }
