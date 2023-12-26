import { Component } from '@angular/core';
import { Question } from '../model/question.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../administration.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-questions-overview',
  templateUrl: './questions-overview.component.html',
  styleUrls: ['./questions-overview.component.css']
})
export class QuestionsOverviewComponent {
  questions: Question[] = [];
  selectedQuestionForAnswer: Question;
  shouldRenderAnswerForm = false;

  constructor(private administratorService: AdministrationService, private authService: AuthService, 
    private formBuilder: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getQuestions();
  }

  onReply(selectedQuestion: Question): void {
    this.selectedQuestionForAnswer = selectedQuestion;
    this.shouldRenderAnswerForm = true;
  }

  getQuestions(): void {
      this.administratorService.getQuestions().subscribe({
        next: (result) => {console.log(result)
          this.questions = result;
        },
        error: () => {
        }
      })

  }

  onCloseFormClicked(): void {
    this.shouldRenderAnswerForm = !this.shouldRenderAnswerForm;
  }
  
}
