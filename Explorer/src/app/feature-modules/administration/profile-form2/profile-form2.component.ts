import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourPreferenceFieldComponent } from '../../tour-preference/tour-preference-field/tour-preference-field.component';
import { AdministrationService } from '../administration.service';
import { Profile } from '../model/profile.model';

@Component({
  selector: 'xp-profile-form2',
  templateUrl: './profile-form2.component.html',
  styleUrls: ['./profile-form2.component.css']
})
export class ProfileForm2Component implements OnChanges {
  @Output() profileUpdated = new EventEmitter<null>();
  @Input() profile: Profile;

  currentFile: File;
  changeImage: boolean=false;

  constructor(private service: AdministrationService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    this.profileForm.patchValue(this.profile);
    this.changeImage=false;
  }
  onImageClick() {
    this.changeImage=true;
    }
  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    biography: new FormControl('', [Validators.required]),
    motto: new FormControl('', [Validators.required])
  })

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
  }

  async updateProfile(): Promise<void> {
    const profile: Profile = {
      firstName: this.profileForm.value.firstName || "",
      lastName: this.profileForm.value.lastName || "",
      profilePicture: this.profile.profilePicture,
      biography: this.profileForm.value.biography || "",
      motto: this.profileForm.value.motto || "",
      isActive: true,
      follows: this.profile.follows,
      tourPreference: this.profile.tourPreference,
      questionnaireDone: this.profile.questionnaireDone,
      xp:this.profile.xp,
      isFirstPurchased:false,
      numberOfCompletedTours: this.profile.numberOfCompletedTours,
      requestSent: this.profile.requestSent
    }
    profile.id = this.profile.id;
    profile.userId = this.profile.userId;


    this.service.updateProfile2(profile).subscribe({
      next: (_) => {
        this.profileUpdated.emit()
        window.location.reload();
      }
    })
  }
}
