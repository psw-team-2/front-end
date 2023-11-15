import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourProblem } from '../model/tour-problem.model';
import { TourProblemService } from '../tour-problem.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { Tour } from '../../tour-authoring/model/tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour-problem-form', 
  templateUrl: './tour-problem-form.component.html',
  styleUrls: ['./tour-problem-form.component.css']
})
export class TourProblemFormComponent implements OnInit {


  tourProblem: TourProblem;
  user: User;
  tourId: number;


  constructor(private service: TourProblemService, private tourAuthoringService :TourAuthoringService, 
    private authService: AuthService, private route: ActivatedRoute, private router: Router) {
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



  tourProblemForm = new FormGroup({
    problemCategory: new FormControl('', [Validators.required]),
    problemPriority: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    selectedTour: new FormControl(0, [Validators.required]) 
  });

  addTourProblem(): void {
    
    if(this.tourProblemForm.value.selectedTour == null){
      this.tourProblemForm.value.selectedTour = 0
    }

    if(this.tourId == undefined){
      error: () => {
      }     
      return
    }

    const tourProblem: TourProblem = {
      
      problemCategory: this.tourProblemForm.value.problemCategory || "",
      problemPriority: this.tourProblemForm.value.problemPriority || "",
      description: this.tourProblemForm.value.description || "",
      timeStamp: new Date(), 
      tourId: this.tourId,
      isClosed: false,
      isResolved: false,
      touristId: this.user.id,
      deadlineTimeStamp: undefined,
    };

    this.service.addTourProblemTourist(tourProblem).subscribe({
      next: () => {
        this.router.navigate(['/view-tours-tourist']);
      }
    });
  }

  updateTourProblem(): void {

    if(this.tourProblemForm.value.selectedTour == null){
      this.tourProblemForm.value.selectedTour = 0
    }

    const tourProblem: TourProblem = {
      problemCategory: this.tourProblemForm.value.problemCategory || "",
      problemPriority: this.tourProblemForm.value.problemPriority || "",
      description: this.tourProblemForm.value.description || "",
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
