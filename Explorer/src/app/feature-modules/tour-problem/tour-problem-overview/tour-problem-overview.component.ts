import { Component, OnInit, ViewChild } from '@angular/core';
import { TourProblem } from '../model/tour-problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FormGroup, Validators, FormControl, FormBuilder, NgForm } from '@angular/forms';
import { TourProblemService } from '../tour-problem.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ActivatedRoute } from '@angular/router';

import { TourProblemResponse } from '../model/tour-problem-response.model';
import { TourProblemResponseService } from '../tour-problem-response.service';

import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';

import { TourProblemResponseComponent } from '../tour-problem-response/tour-problem-response.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tour } from '../../tour-authoring/model/tour.model';

@Component({
    selector: 'xp-tour-problem-overview', 
    templateUrl: './tour-problem-overview.component.html',
    styleUrls: ['./tour-problem-overview.component.css'] 
  })
  export class TourProblemOverviewComponent implements OnInit {

    user: User;
    tour: Tour;
    tourProblemId: number | null;

    tourProblem: TourProblem;
    shouldEdit: boolean = false;
    shouldRenderTourProblemForm: boolean;

    //adding deadline properties
    shouldRenderAddDeadlineForm: boolean;
    addDeadlineForm: FormGroup;


    shouldRenderPenalization: boolean=false;
    shouldRenderClosure: boolean=false;
  
    isDeadlineAlreadyAdded: boolean=false;
    isDeadlinePreviouslyAdded: boolean=false;
  
    //show more description
    //shouldRenderSeeMoreDescription: boolean=false;


    shouldRenderAddResponseForm = true;
    addResponseForm: FormGroup;
    response: string;

    shouldRenderResponses: boolean=true;

    @ViewChild(TourProblemResponseComponent, { static: false }) tourProblemResponseComponent: TourProblemResponseComponent;



    constructor(private tourProblemService: TourProblemService, private authService: AuthService, private route: ActivatedRoute,
      private formBuilder: FormBuilder, private problemResponseService: TourProblemResponseService, private tourAuthService: TourAuthoringService, private snackBar: MatSnackBar) 
    { 

  
      this.addDeadlineForm = new FormGroup({
        deadlineDate: new FormControl('', Validators.required),
        deadlineTime: new FormControl('', Validators.required)
      })
      this.addResponseForm = this.formBuilder.group({
        response: ['', Validators.required] 
      });
    }
  
    ngOnInit(): void {
  
      this.authService.user$.subscribe(user =>{
        this.user = user;
      })
    

      this.route.paramMap.subscribe(params =>{
        const id = params.get('id');
        this.tourProblemId = id ? parseInt(id, 10) : null;
        if (this.tourProblemId !== null){
          if(this.user?.role == 'administrator'){
            this.tourProblemService.getTourProblemAdministrator(this.tourProblemId).subscribe({
              next: (result: TourProblem) => {
                  this.tourProblem = result;
                  this.tourProblemService.getTour(this.tourProblem.tourId)
                    .subscribe((tour) => {
                      this.tour = tour;
                    });
                  //fetching for comments should be implemented, once the comments are added
                  if(this.tourProblem.deadlineTimeStamp != null){
                    this.isDeadlineAlreadyAdded = true;
                    this.isDeadlinePreviouslyAdded = true;
                  }
              }
            });
          } else if(this.user?.role == 'author') {
            this.tourProblemService.getTourProblemForAuthor(this.tourProblemId).subscribe({
              next: (result: TourProblem) => {
                  this.tourProblem = result;
                  this.tourProblemService.getTour(this.tourProblem.tourId)
                  .subscribe((tour) => {
                    this.tour = tour;
                  });
                  if(this.tourProblem.deadlineTimeStamp != null){
                    this.isDeadlineAlreadyAdded = true;
                    this.isDeadlinePreviouslyAdded = true;
                  }
              }
            });
          } else if(this.user?.role == 'tourist'){
            this.tourProblemService.getTourProblemTourist(this.tourProblemId).subscribe({
              next: (result: TourProblem) => {
                  this.tourProblem = result;
                  this.tourProblemService.getTour(this.tourProblem.tourId)
                    .subscribe((tour) => {
                      this.tour = tour;
                    });
                  if(this.tourProblem.deadlineTimeStamp != null){
                    this.isDeadlineAlreadyAdded = true;
                    this.isDeadlinePreviouslyAdded = true;
                  }
              }
            })
          }
        
        }
      })
    }
      
    showNotification(message: string): void {
      this.snackBar.open(message, '', {
        duration: 3000, 
      });
    }

    onEditClicked(tourProblem: TourProblem): void {
      this.tourProblem = tourProblem;
      this.shouldRenderTourProblemForm = true;
      this.shouldEdit = true;
    }
  
    onAddClicked(): void {
      this.shouldEdit = false;
      this.shouldRenderTourProblemForm = true;
    }
  
    //Close Tour Problem button clicked
    onCloseConfirmClicked(): void{
      this.tourProblem.isClosed = true;
      this.tourProblemService.updateTourProblemAdministrator(this.tourProblem).subscribe({
        // There is currently no TourProblemUpdated emitter implemented
        // next: () => { this.tourProblemUpdated.emit()} 
      });
    }
  
  
    //See More button clicked
    /*onSeeMoreClicked(tourProblem: TourProblem): void{
      this.tourProblem = tourProblem;
      this.shouldRenderSeeMoreDescription = !this.shouldRenderSeeMoreDescription;
    }
  
    //See less button clicked
    onSeeLessClicked(): void{
      this.shouldRenderSeeMoreDescription = false;
    }*/
  
  
    //Add button Deadline button clicked
    onAddDeadlineClicked(): void {
      // this.shouldEdit = false;
      // this.shouldRenderTourProblemForm = true;
      this.shouldRenderAddDeadlineForm = !this.shouldRenderAddDeadlineForm;

    }
  
    //Close button in Add Deadline window clicked
    onCloseDeadlineClicked(): void {
      this.shouldRenderAddDeadlineForm = false;
    }
  
    onPenalizeClicked(): void{
      this.shouldRenderPenalization = !this.shouldRenderPenalization;
    }
  
    onPenalizeConfirmClicked(): void{
      
      this.tourAuthService.deleteTourAdministrator(this.tourProblem.tourId).subscribe({
      
  
      })
    }
    //Close Tour Problem button clicked
    onCloseClicked(): void{
      this.shouldRenderClosure = !this.shouldRenderClosure
    }
  
  
    //Save in Add Deadlline window clicked
    onSaveDeadline(): void {
      if (this.addDeadlineForm.valid && this.tourProblem) {
        const selectedDate = this.addDeadlineForm.value.deadlineDate;
        const selectedTime = this.addDeadlineForm.value.deadlineTime;

        const dateFormat = new Date(selectedDate)
        const year = dateFormat.getFullYear();
        const month = String(dateFormat.getMonth() + 1).padStart(2, '0');
        const day = String(dateFormat.getDate()).padStart(2, '0')
        
        const [hours, minutes] = selectedTime.split(':');
    
        let deadlineCombinedDate = new Date(year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':00');   
        // Check if the date is valid
        if (isNaN(deadlineCombinedDate.getTime())) {
          this.showNotification('Invalid date or time input!');
          console.error('Invalid date or time input.');
          
          return; // Exit the function early
        }    

        const currentTime = new Date();
        const timeDifference = (deadlineCombinedDate.getTime() - currentTime.getTime());

        console.log(timeDifference)
        if(timeDifference < 0){
          this.showNotification('Invalid date or time input!');
          console.error('Invalid date or time input.');
          
          return; // Exit the function early
        }

        // Update the selectedTourProblem's deadlineTimeStamp
        this.tourProblem.deadlineTimeStamp = deadlineCombinedDate;
    
        // You can proceed to use the updated selectedTourProblem as needed
        this.tourProblemService.updateTourProblemAdministrator(this.tourProblem).subscribe({
          // There is currently no TourProblemUpdated emitter implemented
          // next: () => { this.tourProblemUpdated.emit()} 
        });
        this.isDeadlineAlreadyAdded = true;
      }
    }
    

  
    isFiveDaysOld(): boolean{
      if(this.tourProblem && this.tourProblem.timeStamp instanceof Date)
      {
        const currentTimeStamp = new Date()
        const timeDifference = currentTimeStamp.getTime() - this.tourProblem.timeStamp.getTime()
        
        //return result of isResolved, and if timeDifference calculated in days greater than 5
        return this.tourProblem.isResolved && ((timeDifference/(24 * 60 * 60 * 1000)) > 5);
      }

      return false;
    } 
  
    onViewResponsesClicked(){
      this.shouldRenderResponses = !this.shouldRenderResponses;
    }

    onAddResponseClicked() {
      this.shouldRenderAddResponseForm = !this.shouldRenderAddDeadlineForm;
      this.response = '';
      
    }
  
    onSendResponse() {
      if (this.user && this.user.role === 'author' && this.tourProblem) {

        if (this.tourProblem.id !== undefined) {
          const problemResponse: TourProblemResponse = {
            id: undefined,
            response: this.response,
            timeStamp: new Date(),
            tourProblemId: this.tourProblem.id,
            commenterId: this.user.id
          };
          this.problemResponseService.authorRespond(this.tourProblem.id, problemResponse).subscribe({
            next: () => {
              console.log("The response has been successfully sent!")
              this.showNotification('Your response has been successfully sent!');
              this.tourProblemResponseComponent.getTourProblemResponses();
              this.response = '';
            },
            error: () => {}
          });
        }
      }
      else if (this.user && this.user.role === 'tourist' && this.user.id == this.tourProblem.touristId && this.tourProblem) {
        if (this.tourProblem.id !== undefined) {
          const problemResponse: TourProblemResponse = {
            id: undefined,
            response: this.response,
            timeStamp: new Date(),
            tourProblemId: this.tourProblem.id,
            commenterId: this.user.id
          };
          this.problemResponseService.touristRespond(this.tourProblem.id, problemResponse).subscribe({
            next: () => {
              console.log("The response has been successfully sent!")
              this.showNotification('Your response has been successfully sent!');
              this.tourProblemResponseComponent.getTourProblemResponses();
              this.response = '';
            },
            error: () => {}
          });
        }
      }
      else if (this.user && this.user.role === 'administrator' && this.tourProblem) {
        if (this.tourProblem.id !== undefined) {
          const problemResponse: TourProblemResponse = {
            id: undefined,
            response: this.response,
            timeStamp: new Date(),
            tourProblemId: this.tourProblem.id,
            commenterId: this.user.id
          };
          this.problemResponseService.administratorRespond(this.tourProblem.id, problemResponse).subscribe({
            next: () => {
              console.log("The response has been successfully sent!")
              this.showNotification('Your response has been successfully sent!');
              this.tourProblemResponseComponent.getTourProblemResponses();
              this.response = '';
            },
            error: () => {}
          });
        }
      }
    }
  
    onCancelResponse() {
      //this.shouldRenderAddResponseForm = false;
      this.response = '';
    }

    truncateText(text: string | undefined, maxLength: number): string {
      if (text === undefined) {
        return ''; 
      }

    
      if (text.length <= maxLength) {
        return text;
      } else {
        return text.substring(0, maxLength) + '...';
      }
    }
  
    isExpired(): boolean{

      if(this.tourProblem.deadlineTimeStamp){
        const currentTimeStamp = new Date();
        const tourProblemDeadlineTimeStamp = new Date(this.tourProblem.deadlineTimeStamp);
        return currentTimeStamp.getTime() - tourProblemDeadlineTimeStamp.getTime() > 0;
      }
      return false;
  
    }

    showTooltip = false;

    handleTitleClick() {
      console.log('Title clicked!');
    }

  }
  