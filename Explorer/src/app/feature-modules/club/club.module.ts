import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule here
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubListComponent } from './club-list/club-list.component';

@NgModule({
  declarations: [ClubFormComponent, ClubListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Add ReactiveFormsModule to the imports
  ],
  exports: [ClubFormComponent, ClubListComponent],
})
export class ClubModule {}
