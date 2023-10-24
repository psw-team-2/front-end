import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { StartYourJourneyComponent } from './start-your-journey/start-your-journey.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    StartYourJourneyComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    StartYourJourneyComponent
  ]
})
export class LayoutModule { }
