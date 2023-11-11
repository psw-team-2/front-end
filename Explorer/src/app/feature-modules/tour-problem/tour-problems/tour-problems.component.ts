import { Component, OnInit } from '@angular/core';
import { TourProblem } from '../model/tour-problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TourProblemService } from '../tour-problem.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourProblemOverviewComponent } from '../tour-problem-overview/tour-problem-overview.component';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';


@Component({
  selector: 'xp-tour-problems', 
  templateUrl: './tour-problems.component.html',
  styleUrls: ['./tour-problems.component.css'] 
})
export class TourProblemsComponent implements OnInit {

  user: User | undefined;

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

  shouldRenderPenalization: boolean=false;
  shouldRenderClosure: boolean=false;
  
  constructor(private tourProblemService: TourProblemService, private authService: AuthService, private tourAuthService: TourAuthoringService) { 


  }

  ngOnInit(): void {

    this.authService.user$.subscribe(user =>{
      this.user = user;
    })

    this.getTourProblems();
  }
  
  deleteTourProblem(id: number): void {
    this.tourProblemService.deleteTourProblem(id).subscribe({
      next: () => {
        this.getTourProblems();
        
      },
    });
  }

  getTourProblems(): void {

    if(this.user?.role === 'administrator'){
      this.tourProblemService.getTourProblemsAdministrator().subscribe({
        next: (result: PagedResults<TourProblem>) => {
          this.tourProblems = result.results;
        },
        error: () => {
          // Handle error if needed
        }
      });
    }

    else if(this.user?.role === 'tourist'){
      this.tourProblemService.getTourProblemsTourist(this.user.id).subscribe({
        next: (result: PagedResults<TourProblem>) => {
          this.tourProblems = result.results;
        },
        error: () => {
          // Handle error if needed
        }
      });
      }
    else if(this.user?.role === 'author'){
        this.tourProblemService.getTourProblemAuthor(this.user.id).subscribe({
          next: (result: PagedResults<TourProblem>) => {
            this.tourProblems = result.results;
          },
          error: () => {
            // Handle error if needed
          }
        });
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

    })
  }
  //Close Tour Problem button clicked
  onCloseClicked(tourProblem: TourProblem): void{
    this.shouldRenderClosure = !this.shouldRenderClosure
  }

  onCloseConfirmClicked(tourProblem: TourProblem): void{
    tourProblem.isClosed = true;
    this.tourProblemService.updateTourProblemAdministrator(tourProblem).subscribe({
      // There is currently no TourProblemUpdated emitter implemented
      // next: () => { this.tourProblemUpdated.emit()} 
    });
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

  isExpired(tourProblem: TourProblem): boolean{

    if(tourProblem.deadlineTimeStamp){
      const currentTimeStamp = new Date();
      const tourProblemDeadlineTimeStamp = new Date(tourProblem.deadlineTimeStamp);
      return currentTimeStamp.getTime() - tourProblemDeadlineTimeStamp.getTime() > 0;
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
  

}
