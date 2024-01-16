import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TourProblemFormComponent } from './tour-problem-form/tour-problem-form.component';
import { TourProblemsComponent } from './tour-problems/tour-problems.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TourProblemOverviewComponent } from './tour-problem-overview/tour-problem-overview.component';
import { AppRoutingModule } from 'src/app/infrastructure/routing/app-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { TourProblemResponseComponent } from './tour-problem-response/tour-problem-response.component';
import { TpFormComponent } from './tp-form/tp-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TpCommentFormComponent } from './tp-comment-form/tp-comment-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    TourProblemFormComponent,
    TourProblemsComponent,
    TourProblemOverviewComponent,
    TourProblemResponseComponent,
    TpFormComponent,
    TpCommentFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    AppRoutingModule,
    MatNativeDateModule,
    DatePipe,
    MatSnackBarModule,
    MatTooltipModule
  ],
  exports: [
    TourProblemsComponent,
    TourProblemFormComponent,
    TourProblemOverviewComponent,
    TourProblemResponseComponent,
    TpFormComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TourProblemModule { }
