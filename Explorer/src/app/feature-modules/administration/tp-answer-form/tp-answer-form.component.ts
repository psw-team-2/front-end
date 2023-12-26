import { Component, Input } from '@angular/core';
import { Answer, AnswerCategory } from '../../tourist/model/answer.model';
import { AdministrationService } from '../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { TourProblemResponseService } from '../../tour-problem/tour-problem-response.service';
import { Question } from '../model/question.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'xp-tp-answer-form',
  templateUrl: './tp-answer-form.component.html',
  styleUrls: ['./tp-answer-form.component.css']
})
export class TpAnswerFormComponent {
  addAnswerForm: FormGroup;
  @Input() question: Question | null = null;
  user: User;
  AnswerCategory = AnswerCategory;
  selectedCategory: AnswerCategory;


  constructor(private service: AdministrationService, private authService: AuthService, 
    private formBuilder: FormBuilder,private problemResponseService: TourProblemResponseService, private tourAuthService: TourAuthoringService, private snackBar: MatSnackBar, private router: Router,private activatedRoute: ActivatedRoute) { 
    this.addAnswerForm = this.formBuilder.group({
      answer: ['', Validators.required],
      answerCategory: new FormControl(AnswerCategory.Payment)
    });  
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user =>{
      this.user = user;
    })
  }


  onDone(): void {
    const answerText = this.addAnswerForm.get('answer')?.value;
    const visibility = this.addAnswerForm.get('visibility')?.value;
    if (this.question) {
      const newAnswer: Answer = {
        touristId: this.question.touristId,
        adminId: this.user.id,
        text: answerText,
        category: this.selectedCategory, 
        visability: true, 
        questionId: this.question?.id || 0,
        questionText: ''
      };

      this.service.createAnswer(newAnswer).subscribe(
        (createdAnswer: Answer) => {
          this.snackBar.open('Answer created successfully!', 'Close', { duration: 3000 });
          //window.history.back();       
        },
        (error) => {
          console.error('Error creating answer:', error);
          this.snackBar.open('Error creating answer. Please try again.', 'Close', { duration: 3000 });
        }
      );
    }

  }

}
