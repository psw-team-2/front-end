import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { TouristSelectedEquipmentComponent } from './tourist-selected-equipment/tourist-selected-equipment.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FaqComponent } from './faq/faq.component';
import { AuthorReviewComponent } from './author-review/author-review.component';



@NgModule({
  declarations: [
    //TouristSelectedEquipmentComponent,
    PurchaseReportComponent,
    CreateQuestionComponent,
    FaqComponent,
    AuthorReviewComponent,
    //TouristSelectedEquipmentComponent,
    PurchaseReportComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  exports: [
    CreateQuestionComponent,
    PurchaseReportComponent,
    //TouristSelectedEquipmentComponent
  ]
})
export class TouristModule { }
