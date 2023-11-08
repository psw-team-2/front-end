import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsOverviewComponent } from './notifications-overview/notifications-overview.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from './notification/notification.component';



@NgModule({
  declarations: [
    NotificationsOverviewComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class NotificationsModule { }
