import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourProblem } from '../model/tour-problem.model';
import { TourProblemService } from '../tour-problem.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-tp-form',
  templateUrl: './tp-form.component.html',
  styleUrls: ['./tp-form.component.css']
})
export class TpFormComponent {

  @Input() tour: Tour;
  @Input() shouldRender: boolean;
  @Output() shouldRenderUpdated = new EventEmitter<false>();
  userId = this.authService.user$.value.id;
  username = this.authService.user$.value.username;
  tourProblem: TourProblem;
  user: User;
  tourId: number;

  constructor(private service: TourProblemService, private tourAuthoringService :TourAuthoringService, 
    private authService: AuthService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void{

    this.route.params.subscribe(params => {
     this.tourId = params['id'];
      console.log('Retrieved ID:', this.tourId);
    });

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  tpForm = new FormGroup({
    problemCategory: new FormControl('', [Validators.required]),
    problemPriority: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    selectedTour: new FormControl(0, [Validators.required]) 
  });

  addTourProblem(): void {
    
    if(this.tpForm.value.selectedTour == null){
      this.tpForm.value.selectedTour = 0
    }

    if(this.tourId == undefined){
      error: () => {
      }     
      return
    }

    const tourProblem: TourProblem = {
      
      problemCategory: this.tpForm.value.problemCategory || "",
      problemPriority: this.tpForm.value.problemPriority || "",
      description: this.tpForm.value.description || "",
      timeStamp: new Date(), 
      tourId: this.tourId,
      isClosed: false,
      isResolved: false,
      touristId: this.user.id,
      deadlineTimeStamp: undefined,
    };

    this.service.addTourProblemTourist(tourProblem).subscribe({
      next: () => {
        this.showNotification('Tour Problem successfully reported!');
        this.shouldRenderUpdated.emit();
      }
    });
  }

  showNotification(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000, 
    });
  }

  updateTourProblem(): void {

    if(this.tpForm.value.selectedTour == null){
      this.tpForm.value.selectedTour = 0
    }

    const tourProblem: TourProblem = {
      problemCategory: this.tpForm.value.problemCategory || "",
      problemPriority: this.tpForm.value.problemPriority || "",
      description: this.tpForm.value.description || "",
      timeStamp: new Date(), 
      tourId: this.tourId,
      isClosed: false,
      isResolved: false,
      touristId: this.user.id,
      //Deadline TimeStamp is temporariliy undefined, no real update Tour Problem needed in current stage
      deadlineTimeStamp: undefined,
    };

    if (this.tourProblem) {
      tourProblem.id = this.tourProblem.id;
      this.service.updateTourProblemTourist(tourProblem).subscribe({
        next: () => {

        }
      });
    }
  }

  cancelTourProblem(): void{
    this.router.navigate(['/view-tours-tourist']);
  }


}
