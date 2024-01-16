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
import { BlogSinglePostComponent } from 'src/app/feature-modules/blog/blog-single-post/blog-single-post.component';
import { BlogReviewComponent } from 'src/app/feature-modules/blog/blog-review/blog-review.component';
import { CommentsReviewComponent } from 'src/app/feature-modules/blog/comments-review/comments-review.component';
import { ViewToursComponent } from 'src/app/feature-modules/tour-authoring/view-tours/view-tours.component';
import { TourOverviewComponent } from 'src/app/feature-modules/tour-authoring/tour-overview/tour-overview.component';
import { TouristPositionComponent } from 'src/app/feature-modules/tour-execution/tourist-position/tourist-position.component';
import { ActiveTourComponent } from 'src/app/feature-modules/tour-execution/active-tour/active-tour.component';
import { ViewToursAuthorComponent } from 'src/app/feature-modules/tour-authoring/view-tours-author/view-tours-author.component';
import { PublicRequestsComponent } from 'src/app/feature-modules/administration/public-requests/public-requests.component';
import { NotificationsOverviewComponent } from 'src/app/feature-modules/notifications/notifications-overview/notifications-overview.component';
import { ShoppingCartComponent } from 'src/app/feature-modules/marketplace/shopping-cart/shopping-cart.component';
import { ViewPurchasedToursComponent } from 'src/app/feature-modules/tour-authoring/view-purchased-tours/view-purchased-tours.component';
import { TourProblemOverviewComponent } from 'src/app/feature-modules/tour-problem/tour-problem-overview/tour-problem-overview.component';
import { TourProblemResponseComponent } from 'src/app/feature-modules/tour-problem/tour-problem-response/tour-problem-response.component';
import { TourProblemFormComponent } from 'src/app/feature-modules/tour-problem/tour-problem-form/tour-problem-form.component';
import { ProfilesComponent } from 'src/app/feature-modules/administration/profiles/profiles.component';
import { Profiles2Component } from 'src/app/feature-modules/administration/profiles2/profiles2.component';
import { ComplexTourCreationComponent } from 'src/app/feature-modules/complex-tour/complex-tour-creation/complex-tour-creation.component';
import { BundleManagementComponent } from 'src/app/feature-modules/tour-authoring/bundle-management/bundle-management.component';
import { BundleFormComponent } from 'src/app/feature-modules/tour-authoring/bundle-form/bundle-form.component';
import { WalletsOverviewComponent } from 'src/app/feature-modules/administration/wallets-overview/wallets-overview.component';
import { BundleOverviewComponent } from 'src/app/feature-modules/tour-authoring/bundle-overview/bundle-overview.component';
import { PurchaseReportComponent } from 'src/app/feature-modules/tourist/purchase-report/purchase-report.component';
import { BundleViewComponent } from 'src/app/feature-modules/tour-authoring/bundle-view/bundle-view.component';
import { BundleUpdateFormComponent } from 'src/app/feature-modules/tour-authoring/bundle-update-form/bundle-update-form.component';
import { SaleComponent } from 'src/app/feature-modules/marketplace/sale/sale.component';
import { SaleFormComponent } from 'src/app/feature-modules/marketplace/sale-form/sale-form.component';
import { EditSaleComponent } from 'src/app/feature-modules/marketplace/edit-sale/edit-sale.component';
import { ViewComposedTourComponent } from 'src/app/feature-modules/complex-tour/view-composed-tour/view-composed-tour.component';
import { ComposedTourOverviewComponent } from 'src/app/feature-modules/complex-tour/composed-tour-overview/composed-tour-overview.component';
import { ActiveEncounterComponent } from 'src/app/feature-modules/challenges/active-encounter/active-encounter.component';
import { InviteMembersToTourComponent } from 'src/app/feature-modules/club/invite-members-to-tour/invite-members-to-tour.component';
import { VerificationComponent } from 'src/app/feature-modules/administration/user-account-administration/verification/verification.component';
import { PasswordRecoveryComponent } from '../auth/password-recovery/password-recovery.component';
import { RecoverComponent } from '../auth/recover/recover.component';
import { WishlistOverviewComponent } from 'src/app/feature-modules/tour-authoring/wishlist-overview/wishlist-overview.component';
import { GiftCardComponent } from 'src/app/feature-modules/tour-authoring/gift-card/gift-card.component';
import { QuestionnaireComponent } from 'src/app/feature-modules/administration/questionnaire/questionnaire.component';
import { QuestionsOverviewComponent } from 'src/app/feature-modules/administration/questions-overview/questions-overview.component';
import { CreateQuestionComponent } from 'src/app/feature-modules/tourist/create-question/create-question.component';
import { FaqComponent } from 'src/app/feature-modules/tourist/faq/faq.component';

import { ProfileSettingsComponent } from 'src/app/feature-modules/administration/profile-settings/profile-settings.component';
import { AppUserProfileComponent } from 'src/app/feature-modules/administration/app-user-profile/app-user-profile.component';
import { ProfileSettings2Component } from 'src/app/feature-modules/administration/profile-settings2/profile-settings2.component';
import { AuthorReviewComponent } from 'src/app/feature-modules/tourist/author-review/author-review.component';
import { AuthorRequestsOverviewComponent } from 'src/app/feature-modules/administration/author-requests-overview/author-requests-overview.component';
import { CheckpointsComponent } from 'src/app/shared/checkpoints/checkpoints.component';
import { RegistrationCompletedComponent } from '../auth/registration-completed/registration-completed.component';

const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'password-recovery', component: PasswordRecoveryComponent},
  {path: 'recover/:token', component: RecoverComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'tour-problems', component: TourProblemsComponent, canActivate: [AuthGuard],},
  {path: 'checkpoint/:id', component: CheckpointComponent},
  {path: 'tour', component: TourComponent},
  {path: 'equipment/:id', component: TourEquipmentComponent},
  {path: 'object', component: ObjectComponent},
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
  {path: 'blog-form/:id', component: BlogFormComponent, canActivate: [AuthGuard],},
  {path: 'blog-single-post/:id', component: BlogSinglePostComponent,},
  {path: 'blog-review', component: BlogReviewComponent},
  {path: 'comments-review', component: CommentsReviewComponent},
  {path: 'blog-form', component: BlogFormComponent, canActivate: [AuthGuard],},
  {path: 'blog-form/:id', component: BlogFormComponent, canActivate: [AuthGuard], },
  {path: 'blog-form/tour-report/:tourId', component: BlogFormComponent, canActivate: [AuthGuard], },
  {path: 'blog-form/:id/tour-report/:tourId', component: BlogFormComponent, canActivate: [AuthGuard], },
  {path: 'tour/:id', component: TourOverviewComponent},
  {path: 'touristposition', component: TouristPositionComponent},
  {path: 'activeTour', component: ActiveTourComponent},
  {path: 'view-tours-author', component: ViewToursAuthorComponent},
  {path: 'view-tours-tourist', component: ViewToursComponent},
  {path: 'publicRequests', component: PublicRequestsComponent},
  {path: 'tour-problem/:id', component: TourProblemOverviewComponent},
  {path: 'tour-problem/:problemId/responses', component: TourProblemResponseComponent },
  {path: 'notifications', component: NotificationsOverviewComponent},
  {path: 'tour-problem-form/:id', component: TourProblemFormComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'find-people', component: ProfilesComponent},
  {path: 'find-people-autor', component: Profiles2Component},
  {path: 'view-purchased-tours', component: ViewPurchasedToursComponent},
  {path: 'complex-tour-creaton', component: ComplexTourCreationComponent},
  {path: 'view-complex-tours', component: ViewComposedTourComponent},
  {path: 'composed-tour/:id', component: ComposedTourOverviewComponent},
  {path: 'bundle-management', component: BundleManagementComponent},
  {path: 'bundle-form', component: BundleFormComponent},
  {path: 'wallets', component: WalletsOverviewComponent},
  {path: 'bundle-overview', component: BundleOverviewComponent},
  {path: 'purchase-reports', component: PurchaseReportComponent },
  {path: 'bundle-update-form/:id', component: BundleUpdateFormComponent},
  {path: 'bundle-view/:id', component: BundleViewComponent},
  {path: 'sale', component: SaleComponent},
  {path: 'addSale', component: SaleFormComponent},
  {path: 'editSale', component: EditSaleComponent},
  {path: 'active-encounter', component: ActiveEncounterComponent},
  {path: 'clubs/:clubId/inviteMembersToTour', component: InviteMembersToTourComponent},
  {path: 'verify/:token', component: VerificationComponent},
  {path: 'wishlist-overview', component: WishlistOverviewComponent},
  {path: 'gift-card', component: GiftCardComponent},
  {path: 'questions-overview', component: QuestionsOverviewComponent},
  {path: 'create-question', component: CreateQuestionComponent},
  {path: 'faq', component: FaqComponent},
  {path: 'profile-settings', component: ProfileSettingsComponent},
  {path: 'profile-settings2', component: ProfileSettings2Component},
  {path: 'app-user-profile/:id', component: AppUserProfileComponent},
  {path: 'registration-completed', component: RegistrationCompletedComponent},
  {path: 'authorReview', component: AuthorReviewComponent},
  {path: 'author-requests-overview', component: AuthorRequestsOverviewComponent},

  {path: 'create-tour', component: CheckpointsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
