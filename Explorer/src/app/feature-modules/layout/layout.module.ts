import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { HeroComponent } from './home/hero/hero.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    HeroComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    HeroComponent
  ]
})
export class LayoutModule { }
