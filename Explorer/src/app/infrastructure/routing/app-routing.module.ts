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
import { ApplicationReviewFormComponent } from 'src/app/feature-modules/marketplace/application-review-form/application-review-form.component';
import { ApplicationReviewComponent } from 'src/app/feature-modules/administration/application-review/application-review.component';
import { UserAccountAdministrationComponent } from 'src/app/feature-modules/administration/user-account-administration/user-account-administration.component';
import { ProfileComponent } from 'src/app/feature-modules/administration/profile/profile.component';
import { ProfileFormComponent } from 'src/app/feature-modules/administration/profile-form/profile-form.component';
import { Profile2Component } from 'src/app/feature-modules/administration/profile2/profile2.component';
import { BlogFormComponent } from 'src/app/feature-modules/blog/blog-form/blog-form.component';
import { SinglePostComponent } from 'src/app/feature-modules/blog/single-post/single-post.component';
import { BlogManagemetComponent } from 'src/app/feature-modules/blog/blog-managemet/blog-managemet.component';
import { BlogCommentsComponent } from 'src/app/feature-modules/blog/blog-comments/blog-comments.component';


const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'clubs', component: ClubsOverviewComponent},
  {path: 'clubs/:id', component: ClubOverviewComponent},
  {path: 'clubRequest', component: ClubRequestComponent, canActivate: [AuthGuard],},
  {path: 'applicationReviewForm', component: ApplicationReviewFormComponent},
  {path: 'applicationReview', component: ApplicationReviewComponent},
  {path: 'userAccounts', component: UserAccountAdministrationComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent},
  {path: 'profile-form', component: ProfileFormComponent},
  {path: 'profile2', component: Profile2Component},
  {path: 'blog-comments', component: BlogCommentsComponent, canActivate: [AuthGuard],},
  {path: 'post', component: SinglePostComponent},
  {path: 'blog-management', component: BlogManagemetComponent, canActivate: [AuthGuard],},
  { path: 'blog-form', component: BlogFormComponent, canActivate: [AuthGuard],},
  { path: 'blog-form/:id', component: BlogFormComponent, canActivate: [AuthGuard], }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
