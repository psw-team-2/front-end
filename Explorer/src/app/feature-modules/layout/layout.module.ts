import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { WhyusComponent } from './whyus/whyus.component';

import { HeroComponent } from './hero/hero.component';
import { StartYourJourneyComponent } from './start-your-journey/start-your-journey.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,

    WhyusComponent

    HeroComponent,
    StartYourJourneyComponent,    
    FooterComponent

  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,

    WhyusComponent

    HeroComponent,
    StartYourJourneyComponent,
    FooterComponent

  ]
})
export class LayoutModule { }
