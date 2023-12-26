import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TourProblem } from '../model/tour-problem.model';
import { TourProblemService } from '../tour-problem.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourProblemResponseService } from '../tour-problem-response.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { TourProblemResponse } from '../model/tour-problem-response.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-tp-comment-form',
  templateUrl: './tp-comment-form.component.html',
  styleUrls: ['./tp-comment-form.component.css']
})
export class TpCommentFormComponent {

  @Output() tourProblemUpdated = new EventEmitter<null>();
  @Input() problem: TourProblem;
  @Input() shouldRender: boolean;
  @Output() shouldRenderUpdated = new EventEmitter<false>();
  addCommentForm: FormGroup;
  user: User;

  constructor(private tourProblemService: TourProblemService, private authService: AuthService, 
    private formBuilder: FormBuilder,private problemResponseService: TourProblemResponseService, private tourAuthService: TourAuthoringService, private snackBar: MatSnackBar) { 
    this.addCommentForm = this.formBuilder.group({
      comment: ['', Validators.required] 
    });  
  }

  ngOnInit(): void {

    this.authService.user$.subscribe(user =>{
      this.user = user;
    })

  }

  showNotification(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000, 
    });
  }

  onProblemUnsolved(tourProblem: TourProblem): void {
    this.problem = tourProblem;
    if(this.user && this.user.id === tourProblem.touristId) {
      this.problem.isResolved = false;

      this.tourProblemService.problemUnsolved(tourProblem).subscribe({
        next: () => {
        },
        error: () => {}
      })

      if (this.problem.id !== undefined) {
        const newComment: TourProblemResponse = {
          id: undefined,
          response: this.addCommentForm.value.comment,
          timeStamp: new Date(),
          tourProblemId: this.problem.id,
          commenterId: this.user.id
        };
        this.problemResponseService.touristRespond(this.problem.id, newComment).subscribe({
          next: () => {
            console.log("The comment has been successfully added!")
            this.showNotification('Tour Problem successfully reported again!');
            this.shouldRenderUpdated.emit();
          },
          error: () => {}
        });
      }
    }
  }

}
