import { Component, OnInit } from '@angular/core';
import { TourModelService } from '../tour-problem-model.service';
import { TourProblem } from '../model/tour-problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-problems', 
  templateUrl: './tour-problem.component.html',
  styleUrls: ['./tour-problem.component.css'] 
})
export class TourProblemsComponent implements OnInit {

  tourProblems: TourProblem[] = [];
  selectedTourProblem: TourProblem;
  shouldRenderTourProblemForm: boolean = false;
  shouldEdit: boolean = false;
  
  constructor(private service: TourModelService) { }

  ngOnInit(): void {
    this.getTourProblems();
  }
  
  deleteTourProblem(id: number): void {
    this.service.deleteTourProblem(id).subscribe({
      next: () => {
        this.getTourProblems();
      },
    });
  }

  getTourProblems(): void {
    this.service.getTourProblems().subscribe({
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
}
