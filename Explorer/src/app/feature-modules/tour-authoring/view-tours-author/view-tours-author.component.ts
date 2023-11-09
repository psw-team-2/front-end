import { Component } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-view-tours-author',
  templateUrl: './view-tours-author.component.html',
  styleUrls: ['./view-tours-author.component.css']
})
export class ViewToursAuthorComponent {
  tours: Tour[] = [];
  allTours: Tour[] = [];
  draftTours: Tour[] = [];
  publishedTours: Tour[] = [];
  archivedTours: Tour[] = [];

  constructor(private service: TourAuthoringService) {}

  ngOnInit(): void {
    this.getTour();
  }

  getTour(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
        console.log(this.tours);
        this.filterTours();
      },
      error: () => {
        // Handle error if needed
      }
    });
  }

  filterTours(): void {
    this.allTours = this.tours;
    this.draftTours = this.tours.filter(tour => tour.status === 0);
    this.publishedTours = this.tours.filter(tour => tour.status === 1);
    this.archivedTours = this.tours.filter(tour => tour.status === 2);

    console.log(this.draftTours);
    console.log(this.publishedTours);
    console.log(this.archivedTours);

  }
}
