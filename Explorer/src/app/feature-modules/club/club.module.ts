import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubListComponent } from './club-list/club-list.component';
import { ClubRequestComponent } from './club-request/club-request.component';

@NgModule({
  declarations: [
    ClubFormComponent, 
    ClubListComponent,
    ClubRequestComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ClubFormComponent, 
    ClubListComponent,
    ClubRequestComponent
  ]
})
export class ClubModule {}
