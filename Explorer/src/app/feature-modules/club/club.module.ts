import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubsOverviewComponent } from './clubs-overview/clubs-overview.component';
import { ClubOverviewComponent } from './club-overview/club-overview.component';
import { RouterModule } from '@angular/router';
import { ClubFormComponent } from './club-form/club-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ClubsOverviewComponent,
    ClubOverviewComponent,
    ClubFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    ClubsOverviewComponent,
    ClubOverviewComponent,
    ClubFormComponent
  ]
})
export class ClubModule { }
