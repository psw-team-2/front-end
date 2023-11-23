import { Component } from '@angular/core';

@Component({
  selector: 'xp-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent {
  onSubmit(): void {
    const radioGroups = ['historical', 'cultural', 'architectural', 'modern', 'culinary', 'art', 'nature', 'adventure'];
    const isFormIncomplete = radioGroups.some(group => !document.querySelector(`input[name=${group}]:checked`));

    if (isFormIncomplete) {
      alert('You need to fill in the whole questionnaire.');
    } else {
      // Handle form submission when everything is filled
      // For example, you can submit the form here
    }
  }
}
