import { Component, OnInit } from '@angular/core';
import { TourProblem } from '../model/tour-problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TourProblemService } from '../tour-problem.service';


@Component({
  selector: 'xp-tour-problems', 
  templateUrl: './tour-problems.component.html',
  styleUrls: ['./tour-problems.component.css'] 
})
export class TourProblemsComponent implements OnInit {



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
  shouldRenderShowDescription: boolean
  
  constructor(private tourProblemService: TourProblemService) { 

    this.addDeadlineForm = new FormGroup({
      deadlineDate: new FormControl('', Validators.required),
      deadlineTime: new FormControl('', Validators.required)
    })

  }

  ngOnInit(): void {
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
    this.tourProblemService.getTourProblems().subscribe({
      next: (result: PagedResults<TourProblem>) => {
        this.tourProblems = result.results;
      },
      error: () => {
        // Handle error if needed
      }
    });
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

  //Close Tour Problem button clicked
  onCloseClicked(tourProblem: TourProblem): void{
    tourProblem.isClosed = true;
    this.tourProblemService.updateTourProblem(tourProblem).subscribe({
      // There is currently no TourProblemUpdated emitter implemented
      // next: () => { this.tourProblemUpdated.emit()} 
    });
  }

  onPenalizeClicked(tourProblem: TourProblem): void{
        
  }

  //See More button clicked
  onSeeMoreClicked(tourProblem: TourProblem): void{
    this.selectedTourProblem = tourProblem;
    this.shouldRenderShowDescription = true;
  }

  //See less button clicked
  onSeeLessClicked(): void{
    this.shouldRenderShowDescription = false;
  }


  //Add button Deadline button clicked
  onAddDeadlineClicked(tourProblem: TourProblem): void {
    this.shouldEdit = false;
    this.shouldRenderTourProblemForm = true;
    this.shouldRenderAddDeadlineForm = true;
    this.selectedTourProblem = tourProblem;
  }

  //Close button in Add Deadline window clicked
  onCloseDeadlineClicked(): void {
    this.shouldRenderAddDeadlineForm = false;
  }


  //Save in Add Deadlline window clicked
  onSaveDeadline(): void {
    if (this.addDeadlineForm.valid && this.selectedTourProblem) {
      // Combine the date and time values as needed
      const selectedDate = this.addDeadlineForm.value.deadlineDate;
      const selectedTime = this.addDeadlineForm.value.deadlineTime;
  
      // Now you have the selected date and time, and you can handle them as necessary
      const deadlineCombinedDate = new Date(selectedDate + 'T' + selectedTime);
  
      // Update the selectedTourProblem's deadlineTimeStamp
      this.selectedTourProblem.deadlineTimeStamp = deadlineCombinedDate;
  
      // You can proceed to use the updated selectedTourProblem as needed
    }
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
