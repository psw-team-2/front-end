import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TourProblemFormComponent } from './tour-problem-form/tour-problem-form.component';
import { TourProblemsComponent } from './tour-problems/tour-problem.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    TourProblemFormComponent,
    TourProblemsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule
  ],
  exports: [
    TourProblemsComponent,
    TourProblemFormComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TourProblemModule { }
