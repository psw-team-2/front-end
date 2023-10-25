import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubsOverviewComponent } from './clubs-overview/clubs-overview.component';
import { ClubOverviewComponent } from './club-overview/club-overview.component';
import { RouterModule } from '@angular/router';
import { ClubFormComponent } from './club-form/club-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ClubRequestComponent } from './club-request/club-request.component';

@NgModule({
  declarations: [
    ClubsOverviewComponent,
    ClubOverviewComponent,
    ClubFormComponent,
    ClubRequestComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    ClubsOverviewComponent,
    ClubOverviewComponent,
    ClubFormComponent,
    ClubRequestComponent
  ]
})
export class ClubModule {}
