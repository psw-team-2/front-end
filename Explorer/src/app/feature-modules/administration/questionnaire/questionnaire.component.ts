import { Component, OnInit } from '@angular/core';
import { Profile } from '../model/profile.model';
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit{
  loggedInProfile: Profile | null = null;
  showSubmitButton: boolean = true; // Control property for the submit button

  constructor(private service: AdministrationService) {}

  ngOnInit(): void {
    // Get the currently logged-in user's profile
    this.service.getByUserId().subscribe({
      next: (loggedInProfile: Profile) => {
        this.loggedInProfile = loggedInProfile;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onSubmit(): void {
    const radioGroups = ['historical', 'cultural', 'architectural', 'modern', 'culinary', 'art', 'nature', 'adventure'];
    const isFormIncomplete = radioGroups.some(group => !document.querySelector(`input[name=${group}]:checked`));
  
    if (isFormIncomplete) {
      alert('You need to fill in the whole questionnaire.');
    } else {
      const preferences: string[] = [];
  
      radioGroups.forEach(group => {
        const selectedValue = document.querySelector(`input[name=${group}]:checked`) as HTMLInputElement;
        if (selectedValue && (selectedValue.value === 'prefer' || selectedValue.value === 'strongly-prefer')) {
          preferences.push(group); // Collecting preferences that the user prefers or strongly prefers
        }
      });
  
      if (preferences.length === 0) {
        alert('You need to prefer at least one type of tour.');
      } else {
        // Assuming this.loggedInProfile exists and has the appropriate structure
        preferences.forEach(preference => {
          // Assuming the tour preference tags are lowercase and match the radio group names
          if (!this.loggedInProfile?.tourPreference.tags.includes(preference)) {
            this.loggedInProfile!.tourPreference.tags.push(preference);
          }
        });
  
        // Set questionnaireDone to true before updating the profile
        this.loggedInProfile!.questionnaireDone = true;
  
        // Assuming updateProfile accepts the modified profile object
        this.service.updateProfile(this.loggedInProfile!).subscribe({
          next: (updatedProfile: Profile) => {
            // Handle success if needed
            this.loggedInProfile = updatedProfile; // Update the local profile after successful update
            alert('Questionnaire completed successfully!');
          },
          error: (err: any) => {
            console.log(err); // Handle error
          }
        });

        this.showSubmitButton = false;
      }
    }
  }
  
  
  
}
