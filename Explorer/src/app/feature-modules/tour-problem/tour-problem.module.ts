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

@NgModule({
  declarations: [
    TourProblemFormComponent,
    TourProblemsComponent,
    TourProblemOverviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    AppRoutingModule,
  ],
  exports: [
    TourProblemsComponent,
    TourProblemFormComponent,
    TourProblemOverviewComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TourProblemModule { }
