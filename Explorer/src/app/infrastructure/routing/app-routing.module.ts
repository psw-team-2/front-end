import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { CheckpointComponent } from 'src/app/feature-modules/tour-authoring/checkpoint/checkpoint.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';


import { TourProblemsComponent } from 'src/app/feature-modules/tour-problem/tour-problems/tour-problems.component';

import { TourEquipmentComponent } from 'src/app/feature-modules/tour-authoring/tour-equipment/tour-equipment.component';
import { ObjectComponent } from 'src/app/feature-modules/tour-authoring/object-form/object.component';
import { TouristSelectedEquipmentComponent } from 'src/app/feature-modules/tourist/tourist-selected-equipment/tourist-selected-equipment.component';
import { TourReviewFormComponent } from 'src/app/feature-modules/marketplace/tour-review-form/tour-review-form.component';
import { TourReviewComponent } from 'src/app/feature-modules/marketplace/tour-review/tour-review.component';


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
import { ViewToursComponent } from 'src/app/feature-modules/tour-authoring/view-tours/view-tours.component';
import { TourOverviewComponent } from 'src/app/feature-modules/tour-authoring/tour-overview/tour-overview.component';
import { NotificationsOverviewComponent } from 'src/app/feature-modules/notifications/notifications-overview/notifications-overview.component';

import {TourProblemOverviewComponent } from 'src/app/feature-modules/tour-problem/tour-problem-overview/tour-problem-overview.component';
import { TourProblemResponseComponent } from 'src/app/feature-modules/tour-problem/tour-problem-response/tour-problem-response.component';

const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'tour-problems', component: TourProblemsComponent, canActivate: [AuthGuard],},
  {path: 'checkpoint/:id', component: CheckpointComponent},
  {path: 'tour', component: TourComponent},
  {path: 'equipment/:id', component: TourEquipmentComponent},
  {path: 'object', component: ObjectComponent},
  {path: 'touristSelectingEquipment', component: TouristSelectedEquipmentComponent},
  {path: 'tour-review-form', component: TourReviewFormComponent},
  {path: 'tour-review', component: TourReviewComponent},
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
  {path: 'blog-form', component: BlogFormComponent, canActivate: [AuthGuard],},
  {path: 'blog-form/:id', component: BlogFormComponent, canActivate: [AuthGuard], },
  {path: 'view-tours', component: ViewToursComponent},
  {path: 'tour/:id', component: TourOverviewComponent},
  {path: 'tour-problem/:id', component: TourProblemOverviewComponent},
  {path: 'tour-problem/:problemId/responses', component: TourProblemResponseComponent },

  {path: 'notifications', component: NotificationsOverviewComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
