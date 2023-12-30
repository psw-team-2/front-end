import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { WhyusComponent } from './whyus/whyus.component ';

import { HeroComponent } from './hero/hero.component';
import { StartYourJourneyComponent } from './start-your-journey/start-your-journey.component';
import { FooterComponent } from './footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    HeroComponent,
    WhyusComponent,
    StartYourJourneyComponent,    
    FooterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatMenuModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    HeroComponent,
    StartYourJourneyComponent,
    FooterComponent

  ]
})
export class LayoutModule { }
