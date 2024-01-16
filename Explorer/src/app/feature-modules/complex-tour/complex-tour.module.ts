import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexTourCreationComponent } from './complex-tour-creation/complex-tour-creation.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/infrastructure/routing/app-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ViewComposedTourComponent } from './view-composed-tour/view-composed-tour.component';
import { ComposedTourOverviewComponent } from './composed-tour-overview/composed-tour-overview.component';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    ComplexTourCreationComponent,
    ViewComposedTourComponent,
    ComposedTourOverviewComponent,  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule,
    SharedModule,
    MatTooltipModule
  ]
})
export class ComplexTourModule { }
