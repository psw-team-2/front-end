import { Component, OnInit } from '@angular/core';
import { TourProblem } from '../model/tour-problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TourProblemService } from '../tour-problem.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ActivatedRoute } from '@angular/router';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';


@Component({
    selector: 'xp-tour-problem-overview', 
    templateUrl: './tour-problem-overview.component.html',
    styleUrls: ['./tour-problem-overview.component.css'] 
  })
  export class TourProblemOverviewComponent implements OnInit {

    user: User | undefined;
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
  
    //show more description
    shouldRenderSeeMoreDescription: boolean=false;

    constructor(private tourProblemService: TourProblemService, private authService: AuthService, private route: ActivatedRoute,
      private tourAuthService: TourAuthoringService) { 
  
      this.addDeadlineForm = new FormGroup({
        deadlineDate: new FormControl('', Validators.required),
        deadlineTime: new FormControl('', Validators.required)
      })
  
    }
  
    ngOnInit(): void {
  
      this.authService.user$.subscribe(user =>{
        this.user = user;
      })


      this.route.paramMap.subscribe(params =>{
        const id = params.get('id');
        this.tourProblemId = id ? parseInt(id, 10) : null;
        if (this.tourProblemId !== null){
            this.tourProblemService.getTourProblemAdministrator(this.tourProblemId).subscribe({
                next: (result: TourProblem) => {
                    this.tourProblem = result;
                    
                    //fetching for comments should be implemented, once the comments are added

                    if (this.tourProblem.deadlineTimeStamp !== null && this.tourProblem.deadlineTimeStamp !== undefined) {
                      this.isDeadlineAlreadyAdded = true;
                    }

                }
            })
        }
      })





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
    onSeeMoreClicked(tourProblem: TourProblem): void{
      this.tourProblem = tourProblem;
      this.shouldRenderSeeMoreDescription = !this.shouldRenderSeeMoreDescription;
    }
  
    //See less button clicked
    onSeeLessClicked(): void{
      this.shouldRenderSeeMoreDescription = false;
    }
  
  
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

  }
  