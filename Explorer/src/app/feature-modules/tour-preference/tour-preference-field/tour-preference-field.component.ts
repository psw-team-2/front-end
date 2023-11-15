import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourPreference } from '../model/tour-preference.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AdministrationService } from '../../administration/administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from '../../administration/model/user-account.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-preference-field',
  templateUrl: './tour-preference-field.component.html',
  styleUrls: ['./tour-preference-field.component.css'],
  animations: [
    trigger('expandForm', [
      state('collapsed', style({ maxHeight: '0', opacity: 0 })),
      state('expanded', style({ maxHeight: '1000px', opacity: 1 })),
      transition('collapsed => expanded', animate('300ms ease-in')),
      transition('expanded => collapsed', animate('300ms ease-out')),
    ]),
  ],
})
export class TourPreferenceFieldComponent implements OnInit {
  tourPreferenceForm: FormGroup;
  isEditing = false;
  user: User
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
        this.service.getUserAccountById(id).subscribe(
          (userAccount) => {
            this.user = userAccount;
            this.preference = userAccount.tourPreference;
            this.updateFormWithPreference();
          },
          (error) => {
            console.error('Error fetching user account:', error);
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
    if (this.tourPreferenceForm.valid) {
      const updatedPreference: TourPreference = {
        difficulty: this.tourPreferenceForm.get('difficulty')?.value,
        walkingRating: this.tourPreferenceForm.get('walkingRating')?.value,
        bicycleRating: this.tourPreferenceForm.get('bicycleRating')?.value,
        carRating: this.tourPreferenceForm.get('carRating')?.value,
        boatRating: this.tourPreferenceForm.get('boatRating')?.value,
        tags: this.preference.tags,
      };
      this.user.tourPreference = updatedPreference;

      this.service.updateUserAccount(this.user).subscribe({
        next: (result: User) => {
          console.log('User updated:', result);
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    } else {
      console.error('Form is invalid. Please fill out all fields.');
    }
  }
}
