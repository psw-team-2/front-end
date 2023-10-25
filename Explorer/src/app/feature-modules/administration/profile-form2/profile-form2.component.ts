import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private service: AdministrationService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    this.profileForm.patchValue(this.profile);
  }

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    biography: new FormControl('', [Validators.required]),
    motto: new FormControl('', [Validators.required])
  })

  async updateProfile(): Promise<void> {
    const profile: Profile = {
      firstName: this.profileForm.value.firstName || "",
      lastName: this.profileForm.value.lastName || "",
      profilePicture: this.profile.profilePicture,
      biography: this.profileForm.value.biography || "",
      motto: this.profileForm.value.motto || "",
      isActive: true
    }
    profile.id = this.profile.id;
    profile.userId = this.profile.userId;

    this.service.updateProfile2(profile).subscribe({
      next: (_) => {
        this.profileUpdated.emit()
      }
    })
  }
}
