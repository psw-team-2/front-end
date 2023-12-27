import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Profile } from '../model/profile.model';
import { AdministrationService } from '../administration.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-picture-form2',
  templateUrl: './picture-form2.component.html',
  styleUrls: ['./picture-form2.component.css']
})
export class PictureForm2Component {
  @Output() profileUpdated = new EventEmitter<null>();
  @Input() profile: Profile;

  currentFile: File;

  constructor(private service: AdministrationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.pictureForm.patchValue(this.profile);
  }

  pictureForm = new FormGroup({
    profilePicture: new FormControl('', [Validators.required]),
  })

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
  }

  async changePicture(): Promise<void> {
    if (!this.currentFile) {
      // Show an alert or some form of notification to the user
      alert('Please select a new profile picture from your device before commiting the changes!');
      return;
    }

    const profile: Profile = {
      firstName: this.profile.firstName || "",
      lastName: this.profile.lastName || "",
      profilePicture: 'https://localhost:44333/Images/' + this.currentFile.name || "",
      biography: this.profile.biography || "",
      motto: this.profile.motto || "",
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


    await this.service.upload2(this.currentFile).subscribe({
      next: (value) => {

      },
      error: (value) => {

      }, complete: () => {
      },
    });


    this.service.updateProfile2(profile).subscribe({
      next: (_) => {
        this.profileUpdated.emit()
        
        window.location.reload();
      }
    })
  }
}
