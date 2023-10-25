import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ClubsOverviewComponent } from 'src/app/feature-modules/club/clubs-overview/clubs-overview.component';
import { ClubOverviewComponent } from 'src/app/feature-modules/club/club-overview/club-overview.component';
import { ClubRequestComponent } from 'src/app/feature-modules/club/club-request/club-request.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'clubs', component: ClubsOverviewComponent},
  {path: 'clubs/:id', component: ClubOverviewComponent},
  {path: 'clubRequest', component: ClubRequestComponent, canActivate: [AuthGuard],}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
