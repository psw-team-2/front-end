import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { Profile } from '../model/profile.model';

@Component({
  selector: 'xp-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent {
  constructor(private service: AdministrationService) {}

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    profilePicture: new FormControl('', [Validators.required]),
    biography: new FormControl('', [Validators.required]),
    motto: new FormControl('', [Validators.required])
  })

  addProfile(): void{
    console.log(this.profileForm.value)
    const profile: Profile = {
      firstName: this.profileForm.value.firstName || "",
      lastName: this.profileForm.value.firstName || "",
      profilePicture: this.profileForm.value.firstName || "",
      biography: this.profileForm.value.firstName || "",
      motto: this.profileForm.value.firstName || ""
    }

    this.service.addProfile(profile).subscribe({
      next: (_) => {
        console.log("Uspesan zahtev!")
      }
    });
  }
}
