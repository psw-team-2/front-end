import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubsOverviewComponent } from './clubs-overview/clubs-overview.component';
import { ClubOverviewComponent } from './club-overview/club-overview.component';
import { RouterModule } from '@angular/router';
import { ClubFormComponent } from './club-form/club-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ClubRequestComponent } from './club-request/club-request.component';
import { AdministrationModule } from '../administration/administration.module';
import { InviteMembersToTourComponent } from './invite-members-to-tour/invite-members-to-tour.component';

@NgModule({
  declarations: [
    ClubsOverviewComponent,
    ClubOverviewComponent,
    ClubFormComponent,
    ClubRequestComponent,
    InviteMembersToTourComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    AdministrationModule,
    FormsModule
  ],
  exports: [
    ClubsOverviewComponent,
    ClubOverviewComponent,
    ClubFormComponent,
    ClubRequestComponent,
    InviteMembersToTourComponent
  ]
})
export class ClubModule {}
