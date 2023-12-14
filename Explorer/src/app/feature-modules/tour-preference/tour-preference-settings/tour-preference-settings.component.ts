import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourPreference } from '../model/tour-preference.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AdministrationService } from '../../administration/administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from '../../administration/model/user-account.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Profile } from '../../administration/model/profile.model';
@Component({
  selector: 'xp-tour-preference-settings',
  templateUrl: './tour-preference-settings.component.html',
  styleUrls: ['./tour-preference-settings.component.css']
})
export class TourPreferenceSettingsComponent {
  tourPreferenceForm: FormGroup;
  isEditing = false;
  user: Profile
  formState: 'collapsed' | 'expanded' = 'collapsed';
  preference: TourPreference = {
    difficulty: -1,
    walkingRating: -1,
    bicycleRating: -1,
    carRating: -1,
    boatRating: -1,
    tags: [],
  };

  constructor(private fb: FormBuilder, private service: AdministrationService, private authService: AuthService) {
    this.tourPreferenceForm = this.fb.group({
      difficulty: [this.preference.difficulty, [Validators.required, Validators.min(1), Validators.max(5)]],
      walkingRating: [this.preference.walkingRating, [Validators.required, Validators.min(1), Validators.max(3)]],
      bicycleRating: [this.preference.bicycleRating, [Validators.required, Validators.min(1), Validators.max(3)]],
      carRating: [this.preference.carRating, [Validators.required, Validators.min(1), Validators.max(3)]],
      boatRating: [this.preference.boatRating, [Validators.required, Validators.min(1), Validators.max(3)]],
      tagsInput: [''],
    });
  }


  
  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        const id = user.id;
        this.service.getByUserId().subscribe(
          (profile: Profile) => {
           this.user = profile; 
           this.preference = profile.tourPreference;
           this.updateFormWithPreference();
          },
          (error) => {
            // Handle errors here
            console.error('Error fetching profile:', error);
          }
        );
      }
    });
  }

  updateFormWithPreference() {
    this.tourPreferenceForm.patchValue({
      difficulty: this.preference.difficulty,
      walkingRating: this.preference.walkingRating,
      bicycleRating: this.preference.bicycleRating,
      carRating: this.preference.carRating,
      boatRating: this.preference.boatRating,
    });
  }

  addTag() {
    const tagsInput = this.tourPreferenceForm.get('tagsInput');

    if (tagsInput) {
      const newTag = tagsInput.value.trim();

      if (newTag) {
        this.preference.tags.push(newTag);
        tagsInput.setValue('');
      }
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (this.isEditing === false) {
      this.updatePreference();
    }
  }

  removeTag(index: number) {
    this.preference.tags.splice(index, 1);
    this.updatePreference();
  }

  toggleForm() {
    this.formState = this.formState === 'expanded' ? 'collapsed' : 'expanded';
  }

  updatePreference() {
    if (!this.user) {
      console.error('User is undefined. Cannot update tour preference.');
      return;
    }
    if (this.tourPreferenceForm.valid) {
      const updatedPreference: TourPreference = {
        difficulty: this.tourPreferenceForm.get('difficulty')?.value,
        walkingRating: this.tourPreferenceForm.get('walkingRating')?.value,
        bicycleRating: this.tourPreferenceForm.get('bicycleRating')?.value,
        carRating: this.tourPreferenceForm.get('carRating')?.value,
        boatRating: this.tourPreferenceForm.get('boatRating')?.value,
        tags: this.preference.tags,
      };
      console.log("CHANGING", updatedPreference)
      this.user.tourPreference = updatedPreference;

      this.service.updateProfile(this.user).subscribe(
        (updatedProfileResponse: Profile) => {
          this.isEditing = false;
          console.log('Updated Profile:', updatedProfileResponse);
        },
        (error) => {
          // Handle errors here
          console.error('Error updating profile:', error);
        }
      );
    } else {
      console.error('Form is invalid. Please fill out all fields.');
    }
  }
}
