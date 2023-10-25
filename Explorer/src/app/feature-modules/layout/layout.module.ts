import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { WhyusComponent } from './whyus/whyus.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    WhyusComponent
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
  ]
})
export class LayoutModule { }
