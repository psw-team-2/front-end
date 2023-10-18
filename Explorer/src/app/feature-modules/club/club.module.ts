import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubFormComponent } from './club-form/club-form.component';



@NgModule({
  declarations: [
    ClubFormComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ClubFormComponent
  ]
})
export class ClubModule { }
