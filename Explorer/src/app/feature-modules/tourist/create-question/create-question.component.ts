import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Question } from '../model/question.model';
import { TouristService } from '../tourist.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent {
  questionForm: FormGroup;
  @Input() question: Question;
  selectedQuestion: Question;
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private touristService: TouristService, private snackBar: MatSnackBar) {}
  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm(): void {
    this.questionForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
    });
  }


  async addQuestion(): Promise<void>{
    if(this.questionForm.value.text == ''){
      console.log("text not added")
      return;
    }
    const userId = this.authService.user$.value.id;

    const question: Question = {
      touristId: userId,
      text: this.questionForm.value.text || '',
      isAnswered: false
    }
    this.touristService.createQuestion(question).subscribe({
      next: (createdQuestion) => {
        this.selectedQuestion = createdQuestion; 
        this.showSuccessNotification('You will receive an email when the question gets answered!');
        this.questionForm.reset();
        this.router.navigate(['/faq']);
      },
      error: (error) => {
        console.error('Error while creating question:', error);
      }
    })

  }

  showSuccessNotification(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000, 
    });
  }
}