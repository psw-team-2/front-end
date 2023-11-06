import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './infrastructure/routing/app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './feature-modules/layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './infrastructure/material/material.module';
import { AdministrationModule } from './feature-modules/administration/administration.module';
import { TourProblemModule } from './feature-modules/tour-problem/tour-problem.module';
import { BlogModule } from './feature-modules/blog/blog.module';
import { MarketplaceModule } from './feature-modules/marketplace/marketplace.module';
import { TourAuthoringModule } from './feature-modules/tour-authoring/tour-authoring.module';
import { TourExecutionModule } from './feature-modules/tour-execution/tour-execution.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './infrastructure/auth/jwt/jwt.interceptor';
import { SharedModule } from './shared/shared.module';

import { TouristSelectedEquipmentComponent } from './feature-modules/tourist/tourist-selected-equipment/tourist-selected-equipment.component';
import { TouristModule } from './feature-modules/tourist/tourist.module';
import { MatMenu, MatMenuModule } from '@angular/material/menu';

import { MapViewComponent } from './shared/map-view/map-view.component';
import { ClubModule } from './feature-modules/club/club.module';
import { ClubFormComponent } from './feature-modules/club/club-form/club-form.component';
import { TourPreferenceModule } from './feature-modules/tour-preference/tour-preference.module';
import { AuthService } from './infrastructure/auth/auth.service';

import { MatDatepickerModule } from '@angular/material/datepicker'
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    MaterialModule,
    AdministrationModule,
    TourProblemModule,
    BlogModule,
    MarketplaceModule,
    TourAuthoringModule,
    TourExecutionModule,
    AuthModule,
    HttpClientModule,
    SharedModule,
    TouristModule,
    MatMenuModule,
    ClubModule,
    ReactiveFormsModule,
    TourPreferenceModule,
    DatePipe
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,     
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }