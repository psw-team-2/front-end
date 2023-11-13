import { Component, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-view-tours',
  templateUrl: './view-tours.component.html',
  styleUrls: ['./view-tours.component.css']
})
export class ViewToursComponent implements OnInit {
  tours: Tour[] = [];
  allTours: Tour[] = [];
  selectedTour: Tour | null = null; // Store the selected tour

  constructor(private service: TourAuthoringService) {}
  
  async ngOnInit(): Promise<void> {
    await this.getTours();
  }

  async getTours(): Promise<void> {
    try {
      const result: PagedResults<Tour> | undefined = await this.service.getTours().toPromise();

      if (result) {
        this.allTours = result.results;
        this.tours = result.results;
      } else {
        // Handle the case where result is undefined
      }
    } catch (error) {
      // Handle errors if needed
    }
  }

  selectTour(tour: Tour): void {
    this.selectedTour = tour;
  }

  handleSearchResults(data: { tours: Tour[], searchActive: boolean }) {
    const searchActive = data.searchActive;
    
    if (searchActive) {
      // Display search results when search is active
      this.tours = data.tours;
    } else {
      // Display all tours when search is not active
      this.getTours(); // Refresh the tours to display all of them
    }
  
    // You can use this.tours in your component's template to display the updated results.
  }
}
