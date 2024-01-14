import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplicationReviewComponent } from './application-review/application-review.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ProfileComponent } from './profile/profile.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { PictureFormComponent } from './picture-form/picture-form.component';
import { Profile2Component } from './profile2/profile2.component';
import { ProfileForm2Component } from './profile-form2/profile-form2.component';
import { PictureForm2Component } from './picture-form2/picture-form2.component';
import { TourPreferenceModule } from '../tour-preference/tour-preference.module';
import { UserAccountAdministrationComponent } from './user-account-administration/user-account-administration.component';
import { PublicRequestsComponent } from './public-requests/public-requests.component';
import { ModalComponent } from './public-requests/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProfilesComponent } from './profiles/profiles.component';
import { FollowersComponent } from './followers/followers.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { MessageComponent } from './message/message.component';
import { Followers2Component } from './followers2/followers2.component';
import { Message2Component } from './message2/message2.component';
import { MessageForm2Component } from './message-form2/message-form2.component';
import { Profiles2Component } from './profiles2/profiles2.component';
import { TouristPostsComponent } from './tourist-posts/tourist-posts.component';
import { TouristPosts2Component } from './tourist-posts2/tourist-posts2.component';
import { WalletsOverviewComponent } from './wallets-overview/wallets-overview.component';
import { AcFormComponent } from './ac-form/ac-form.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { AppUserProfileComponent } from './app-user-profile/app-user-profile.component';
import { RouterModule } from '@angular/router';
import { QuestionsOverviewComponent } from './questions-overview/questions-overview.component';
import { TpAnswerFormComponent } from './tp-answer-form/tp-answer-form.component';
import { PurchaseReportComponent } from '../tourist/purchase-report/purchase-report.component';
import { TouristModule } from '../tourist/tourist.module';
import { AppUserPostsComponent } from './app-user-posts/app-user-posts.component';
import { AppUserFollowersComponent } from './app-user-followers/app-user-followers.component';
import { ProfileSettings2Component } from './profile-settings2/profile-settings2.component';
import { ClubsComponent } from './clubs/clubs.component';
import { Clubs2Component } from './clubs2/clubs2.component';
import { AppUserClubsComponent } from './app-user-clubs/app-user-clubs.component';
import { VerificationComponent } from './user-account-administration/verification/verification.component';
import { StarComponent } from './star/star.component';
import { AuthorRequestsOverviewComponent } from './author-requests-overview/author-requests-overview.component';
import { TouristToAuthorComponent } from './tourist-to-author/tourist-to-author.component';


@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ApplicationReviewComponent,
    ProfileComponent,
    ProfileFormComponent,
    PictureFormComponent,
    Profile2Component,
    ProfileForm2Component,
    PictureForm2Component,
    UserAccountAdministrationComponent,
    PublicRequestsComponent,
    ModalComponent,
    ProfilesComponent,
    FollowersComponent,
    MessageFormComponent,
    MessageComponent,
    Followers2Component,
    Message2Component,
    MessageForm2Component,
    Profiles2Component,
    TouristPostsComponent,
    TouristPosts2Component,
    WalletsOverviewComponent,
    AcFormComponent,
    QuestionnaireComponent,
    ProfileSettingsComponent,
    AppUserProfileComponent,
    AppUserPostsComponent,
    AppUserFollowersComponent,
    ProfileSettings2Component,
    ClubsComponent,
    QuestionsOverviewComponent,
    TpAnswerFormComponent,
    Clubs2Component,
    AppUserClubsComponent,
    VerificationComponent,
    QuestionsOverviewComponent,
    TpAnswerFormComponent,
    StarComponent,
    AuthorRequestsOverviewComponent,
    TouristToAuthorComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    TourPreferenceModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule,
    TouristModule
  ],
  exports: [
    EquipmentComponent,
    QuestionnaireComponent,
    EquipmentFormComponent,
    ApplicationReviewComponent,
    ProfileComponent,
    Profile2Component,
    UserAccountAdministrationComponent,
    PublicRequestsComponent,
    ProfilesComponent,
    Profiles2Component,
    TouristPostsComponent,
    ProfileSettingsComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AdministrationModule { }
