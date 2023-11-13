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


  onPublishClicked(tour: Tour): void {
    tour.status = 1;
    this.service.updateTour(tour).subscribe({
      next: (publishedTour: Tour) => {
        // Handle the success case here, if needed
        
        // You can perform additional actions or update the UI as needed
      },
      error: (error) => {
        // Handle the error case here
        console.error('Error publishing tour:', error);
        // You can display an error message or perform other error handling actions
      }
    });
  }
  
  onArchiveClicked(tour: Tour): void {
    tour.status = 2;
    this.service.updateTour(tour).subscribe({
      next: (archivedTour: Tour) => {
        // Handle the success case here, if needed
        
        // You can perform additional actions or update the UI as needed
      },
      error: (error) => {
        // Handle the error case here
        console.error('Error archiving tour:', error);
        // You can display an error message or perform other error handling actions
      }
    });
  }
  getStatusWord(status: Number): string {
    switch (status) {
      case 0:
        return 'Draft';
      case 1:
        return 'Published';
      case 2:
        return 'Archived';
      default:
        return 'Unknown';
    }
  }
  
}
