import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit{

  tour: Tour[] = [];
  selectedTour: Tour;
  shouldEdit: boolean = false;
  shouldRenderTourForm: boolean = false;

  constructor(private service: TourAuthoringService) {}

  ngOnInit(): void {
    this.getTour();
  }

  getTour(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResults<Tour>) =>
      {
        this.tour = result.results;
      },
      error: () => {
      }     
    })
  }

  onEditClicked(tour: Tour): void{
    this.shouldRenderTourForm = true;
    this.shouldEdit = true;
    this.selectedTour = tour;
  }

  onAddClicked(): void {
    this.shouldRenderTourForm = true;
    this.shouldEdit = false;
  }

  deleteTour(id: number):void {
    this.service.deleteTour(id).subscribe({
      next: () => {
        this.getTour();
      },
    })
  }
  
}