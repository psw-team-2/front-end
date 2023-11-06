import { Component, OnInit } from '@angular/core';
import { TourProblem } from '../model/tour-problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TourProblemService } from '../tour-problem.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';


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

  //adding deadline properties
  shouldRenderAddDeadlineForm: boolean
  addDeadlineForm: FormGroup;

  //show description
  shouldRenderShowDescription: boolean = false;
  
  constructor(private tourProblemService: TourProblemService, private authService: AuthService) { 

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
    this.tourProblemService.deleteTourProblem(id).subscribe({
      next: () => {
        this.getTourProblems();
        
      },
    });
  }

  getTourProblems(): void {

    if(this.user?.role == 'administrator'){
      this.tourProblemService.getTourProblemsAdministrator().subscribe({
        next: (result: PagedResults<TourProblem>) => {
          this.tourProblems = result.results;
        },
        error: () => {
          // Handle error if needed
        }
      });
    }
    else if(this.user?.role == 'tourist'){
      this.tourProblemService.getTourProblems().subscribe({
        next: (result: PagedResults<TourProblem>) => {
          this.tourProblems = result.results;
        },
        error: () => {
          // Handle error if needed
        }
      });
      }
      else if(this.user?.role == 'author'){

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
        
  }

  //Close Tour Problem button clicked
  onCloseClicked(tourProblem: TourProblem): void{
    tourProblem.isClosed = true;
    this.tourProblemService.updateTourProblem(tourProblem).subscribe({
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
    const timeDifference = currentTimeStamp.getTime() - tourProblem.timeStamp.getTime()
    
    //return result of isResolved, and if timeDifference calculated in days greater than 5
    return tourProblem.isResolved && ((timeDifference/(24 * 60 * 60 * 1000)) > 5);
  }

  
}
