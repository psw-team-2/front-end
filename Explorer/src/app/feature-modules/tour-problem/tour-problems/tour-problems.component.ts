import { Component, OnInit } from '@angular/core';
import { TourProblem } from '../model/tour-problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { TourProblemService } from '../tour-problem.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

import { TourProblemResponse } from '../model/tour-problem-response.model';
import { TourProblemResponseService } from '../tour-problem-response.service';

import { TourProblemOverviewComponent } from '../tour-problem-overview/tour-problem-overview.component';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'xp-tour-problems', 
  templateUrl: './tour-problems.component.html',
  styleUrls: ['./tour-problems.component.css'] 
})
export class TourProblemsComponent implements OnInit {

  user: User;

  tourProblems: TourProblem[] = [];
  selectedTourProblem: TourProblem;
  shouldRenderTourProblemForm: boolean = false; 
  shouldEdit: boolean = false;

  //filter options
  isResolved: string;
  priority: string;
  category: string;
  isFiltering: boolean;

  tourProblemsFiltered: TourProblem[] = [];


  //adding deadline properties
  shouldRenderAddDeadlineForm: boolean
  addDeadlineForm: FormGroup;

  //show description
  shouldRenderShowDescription: boolean = false;

  shouldRenderAddCommentForm = false;
  comment: string;
  selectedProblemForComment: TourProblem;

  shouldRenderPenalization: boolean=false;
  shouldRenderClosure: boolean=false;
  
  constructor(private tourProblemService: TourProblemService, private authService: AuthService, 
    private formBuilder: FormBuilder,private problemResponseService: TourProblemResponseService, private tourAuthService: TourAuthoringService, private snackBar: MatSnackBar) { 

    this.addDeadlineForm = new FormGroup({
      deadlineDate: new FormControl('', Validators.required),
      deadlineTime: new FormControl('', Validators.required)
    }) 
  }

  ngOnInit(): void {

    this.authService.user$.subscribe(user =>{
      this.user = user;
    })

    this.getTourProblems();
  }
  
  deleteTourProblem(id: number): void {
    this.tourProblemService.deleteTourProblemTourist(id).subscribe({
      next: () => {
        this.getTourProblems();
        
      },
    });
  }

  showNotification(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000, 
    });
  }

  getTourProblems(): void {
    if(this.user?.role === 'administrator'){
      this.tourProblemService.getTourProblemsAdministrator().subscribe({
        next: (result: PagedResults<TourProblem>) => {
          this.tourProblems = result.results;
          this.tourProblems = this.tourProblems.filter((tourProblem) => !tourProblem.isClosed);
          
        },
        error: () => {
        }
      });
    }

    else if(this.user?.role == 'tourist' && this.user?.id){
      this.tourProblemService.getTourProblemsTourist(this.user.id).subscribe({
        next: (result: PagedResults<TourProblem>) => {
          this.tourProblems = result.results.filter(problem => problem.touristId === this.user?.id);
          this.tourProblems = this.tourProblems.filter((tourProblem) => !tourProblem.isClosed);
          
        },
        error: () => {
        }
      });
    }
    else if(this.user?.role == 'author'){
      this.tourProblemService.getTourProblemsAuthor(this.user.id).subscribe({
        next: (result: PagedResults<TourProblem>) => {
          this.tourProblems = result.results;
          this.tourProblems = this.tourProblems.filter((tourProblem) => !tourProblem.isClosed);
        },
        error: () => {
        }
      })
    }

  }

  onEditClicked(tourProblem: TourProblem): void {
    this.selectedTourProblem = tourProblem;
    this.shouldRenderTourProblemForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderTourProblemForm = true;
  }

  onPenalizeClicked(tourProblem: TourProblem): void{
    this.shouldRenderPenalization = !this.shouldRenderPenalization;
  }

  onPenalizeConfirmClicked(tourProblem: TourProblem): void{
    
    this.tourAuthService.deleteTourAdministrator(tourProblem.tourId).subscribe({

      next: () => { this.getTourProblems();} 

    })
    this.showNotification('Author successfully penalized!');
    this.shouldRenderPenalization = !this.shouldRenderPenalization;
  }
  //Close Tour Problem button clicked
  onCloseClicked(tourProblem: TourProblem): void{
    this.shouldRenderClosure = !this.shouldRenderClosure
  }

  onCloseConfirmClicked(tourProblem: TourProblem): void{
    tourProblem.isClosed = true;
    this.tourProblemService.updateTourProblemAdministrator(tourProblem).subscribe({
      // There is currently no TourProblemUpdated emitter implemented
       next: () => { this.getTourProblems();} 

    });
    this.showNotification('Tour Problem successfully closed!');
    this.shouldRenderClosure = !this.shouldRenderClosure;
  }



  filter(): void{
      this.tourProblemsFiltered = this.tourProblems.filter((tourProblem) => {
        // Apply filtering based on filter criteria
        let isMatch = true;
    
        if (this.isFiltering) {

          // Apply filter based on isResolved (if selected)
          if (this.isResolved && this.priority !== 'Any') {

            if(this.priority === 'Resolved'){
              isMatch = isMatch && tourProblem.isResolved === true
            }
            else if(this.priority === 'Unresolved'){
              isMatch = isMatch && tourProblem.isResolved === false
            }
          }
    
          // Apply filter based on priority (if selected)
          if (this.priority && this.priority !== 'Any') {
            isMatch = isMatch && tourProblem.problemPriority === this.priority;
          }
    
          // Apply filter based on category (if selected)
          if (this.category && this.priority !== 'Any') {
            isMatch = isMatch && tourProblem.problemCategory === this.category;
          }
        }
    
        return isMatch;
      });
  }

  isFiveDaysOld(tourProblem: TourProblem): boolean{
    const currentTimeStamp = new Date()
    const tourProblemTimeStamp = new Date(tourProblem.timeStamp)
    const timeDifference = currentTimeStamp.getTime() - tourProblemTimeStamp.getTime()

    
    //return result of isResolved, and if timeDifference calculated in days greater than 5
    return !tourProblem.isResolved && ((timeDifference/(24 * 60 * 60 * 1000)) > 5);
  }


  onProblemSolved(tourProblem: TourProblem): void {
    this.selectedTourProblem = tourProblem;
    if(this.user && this.user.id === tourProblem.touristId) {
      this.selectedTourProblem.isResolved = true;

      this.tourProblemService.problemSolved(tourProblem).subscribe({
        next: () => {
          console.log("Tour problem has been solved")
          this.showNotification('Tour Problem successfully solved!');
          this.getTourProblems();
        },
        error: () => {}
      })
    }
  }

  onAddCommentClicked(selectedProblem: TourProblem): void {
    this.selectedProblemForComment = selectedProblem;
    this.shouldRenderAddCommentForm = true;
    //this.comment = '';
  }

  onProblemUnsolved(tourProblem: TourProblem): void {
    this.selectedTourProblem = tourProblem;
    if(this.user && this.user.id === tourProblem.touristId) {
      this.selectedTourProblem.isResolved = false;

      this.tourProblemService.problemUnsolved(tourProblem).subscribe({
        next: () => {
          console.log("Tour problem has been unsolved")
          this.showNotification('Tour Problem successfully reported again!');
          this.getTourProblems();
        },
        error: () => {}
      })

      if (this.selectedTourProblem.id !== undefined) {
        /**const newComment: TourProblemResponse = {
          id: undefined,
          response: this.comment,
          timeStamp: new Date(),
          tourProblemId: this.selectedTourProblem.id,
          commenterId: this.user.id
        };
        this.problemResponseService.touristRespond(this.selectedTourProblem.id, newComment).subscribe({
          next: () => {
            console.log("The comment has been successfully added!")
          },
          error: () => {}
        });**/
        this.shouldRenderAddCommentForm = true;
      }
    }
  }

  

  isExpired(tourProblem: TourProblem): boolean{
    if(tourProblem.deadlineTimeStamp){
      const currentTimeStamp = new Date();
      const tourProblemDeadlineTimeStamp = new Date(tourProblem.deadlineTimeStamp);
      return currentTimeStamp.getTime() - tourProblemDeadlineTimeStamp.getTime() > 0;
    }
    return false;

  }

  isProblemResolved(tourProblem: TourProblem): boolean{
    if(tourProblem.isResolved){
      return true;
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
  
  onCloseFormClicked(): void {
    this.shouldRenderAddCommentForm = !this.shouldRenderAddCommentForm;
  }

}
