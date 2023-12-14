import { Component, OnInit } from '@angular/core';
import { Profile } from '../model/profile.model';
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {
  loggedInProfile: Profile | null = null;
  showSubmitButton: boolean = false;
  finished: boolean = false;
  done: boolean = false;
  preferences: string[] = [];
  questions: any[] = [
    {
      id: 'historical',
      text: '🏰 How much do you prefer historical tours?',
      options: [
        { value: 'strongly-dont-prefer', label: 'I strongly don\'t prefer them' },
        { value: 'dont-prefer', label: 'I don\'t prefer them' },
        { value: 'dont-mind', label: 'I don\'t mind them' },
        { value: 'prefer', label: 'I prefer them' },
        { value: 'strongly-prefer', label: 'I strongly prefer them' }
      ]
    },
    {
      id: 'cultural',
      text: '🎭 How much do you prefer cultural tours?',
      options: [
        { value: 'strongly-dont-prefer', label: 'I strongly don\'t prefer them' },
        { value: 'dont-prefer', label: 'I don\'t prefer them' },
        { value: 'dont-mind', label: 'I don\'t mind them' },
        { value: 'prefer', label: 'I prefer them' },
        { value: 'strongly-prefer', label: 'I strongly prefer them' }
      ]
    },
    {
      id: 'architectural',
      text: '🏛️ How much do you prefer architectural tours?',
      options: [
        { value: 'strongly-dont-prefer', label: 'I strongly don\'t prefer them' },
        { value: 'dont-prefer', label: 'I don\'t prefer them' },
        { value: 'dont-mind', label: 'I don\'t mind them' },
        { value: 'prefer', label: 'I prefer them' },
        { value: 'strongly-prefer', label: 'I strongly prefer them' }
      ]
    },
    {
      id: 'modern',
      text: '🏙️ How much do you prefer modern tours?',
      options: [
        { value: 'strongly-dont-prefer', label: 'I strongly don\'t prefer them' },
        { value: 'dont-prefer', label: 'I don\'t prefer them' },
        { value: 'dont-mind', label: 'I don\'t mind them' },
        { value: 'prefer', label: 'I prefer them' },
        { value: 'strongly-prefer', label: 'I strongly prefer them' }
      ]
    },
    {
      id: 'culinary',
      text: '🍲 How much do you prefer culinary tours?',
      options: [
        { value: 'strongly-dont-prefer', label: 'I strongly don\'t prefer them' },
        { value: 'dont-prefer', label: 'I don\'t prefer them' },
        { value: 'dont-mind', label: 'I don\'t mind them' },
        { value: 'prefer', label: 'I prefer them' },
        { value: 'strongly-prefer', label: 'I strongly prefer them' }
      ]
    },
    {
      id: 'art',
      text: '🎨 How much do you prefer art tours?',
      options: [
        { value: 'strongly-dont-prefer', label: 'I strongly don\'t prefer them' },
        { value: 'dont-prefer', label: 'I don\'t prefer them' },
        { value: 'dont-mind', label: 'I don\'t mind them' },
        { value: 'prefer', label: 'I prefer them' },
        { value: 'strongly-prefer', label: 'I strongly prefer them' }
      ]
    },
    {
      id: 'nature',
      text: '🌳 How much do you prefer nature tours?',
      options: [
        { value: 'strongly-dont-prefer', label: 'I strongly don\'t prefer them' },
        { value: 'dont-prefer', label: 'I don\'t prefer them' },
        { value: 'dont-mind', label: 'I don\'t mind them' },
        { value: 'prefer', label: 'I prefer them' },
        { value: 'strongly-prefer', label: 'I strongly prefer them' }
      ]
    },
    {
      id: 'adventure',
      text: '⛰️ How much do you prefer adventure tours?',
      options: [
        { value: 'strongly-dont-prefer', label: 'I strongly don\'t prefer them' },
        { value: 'dont-prefer', label: 'I don\'t prefer them' },
        { value: 'dont-mind', label: 'I don\'t mind them' },
        { value: 'prefer', label: 'I prefer them' },
        { value: 'strongly-prefer', label: 'I strongly prefer them' }
      ]
    },
    {
      id: 'end',
      text: '🏁 Submit your answers!',
    },
    {
      id: 'confirm',
      text: '🚩 Your answers have been submitted!',
    }
  ];
  
  currentQuestionIndex: number = 0;
  currentQuestion: any = this.questions[0];

  constructor(private service: AdministrationService) {}

  ngOnInit(): void {
    this.service.getByUserId().subscribe({
      next: (loggedInProfile: Profile) => {
        this.loggedInProfile = loggedInProfile;
        this.done=this.loggedInProfile.questionnaireDone;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onSubmit(): void {
    console.log("SUBMITING")
    if (this.preferences.length === 0) {
      console.log('You need to prefer at least one type of tour.');
    } else {
      this.preferences.forEach(preference => {
        if (!this.loggedInProfile?.tourPreference.tags.includes(preference)) {
          this.loggedInProfile!.tourPreference.tags.push(preference);
        }
      });

      this.loggedInProfile!.questionnaireDone = true;

      this.service.updateProfile(this.loggedInProfile!).subscribe({
        next: (updatedProfile: Profile) => {
          this.loggedInProfile = updatedProfile;
          console.log('Questionnaire completed successfully!');
        },
        error: (err: any) => {
          console.log(err);
        }
      });
      
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      
      this.showSubmitButton=false;
      this.finished=true;
      console.log('Questionnaire completed successfully!');
    }
  }

  nextQuestion(): void {
    const selectedValue = document.querySelector(`input[name=${this.currentQuestion.id}]:checked`) as HTMLInputElement;
  
    if (selectedValue && (selectedValue.value === 'prefer' || selectedValue.value === 'strongly-prefer')) {
      if (!this.loggedInProfile?.tourPreference.tags.includes(this.currentQuestion.id)) {
        this.preferences.push(this.currentQuestion.id);
      }
    }
    
    if (this.currentQuestionIndex < 7) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.showSubmitButton=false;
    }
    else if(this.currentQuestionIndex===7){
      this.showSubmitButton=true;
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    }
  }
  

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.showSubmitButton=false;
    }
  }
}
