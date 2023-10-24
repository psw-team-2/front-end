import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubsOverviewComponent } from './clubs-overview/clubs-overview.component';
import { ClubOverviewComponent } from './club-overview/club-overview.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ClubsOverviewComponent,
    ClubOverviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ClubsOverviewComponent,
    ClubOverviewComponent
  ]
})
export class ClubModule { }
