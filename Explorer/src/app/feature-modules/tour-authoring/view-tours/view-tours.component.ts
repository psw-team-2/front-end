import { Component, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MarketplaceService } from '../../marketplace/marketplace.service';

import { TourExecution } from '../../tour-execution/model/tourexecution.model';
import { Checkpoint } from '../model/checkpoint.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'xp-view-tours',
  templateUrl: './view-tours.component.html',
  styleUrls: ['./view-tours.component.css']
})
export class ViewToursComponent implements OnInit {
  tours: Tour[] = [];
  allTours: Tour[] = [];
  selectedTour: Tour | null = null; // Store the selected tour
  tourAverageGrades: { [tourId: number]: number } = {};
  constructor(private service: TourAuthoringService, private marketService: MarketplaceService, private authService:AuthService, private router: Router) {}


  async ngOnInit(): Promise<void> {
    await this.getTours();
  }

  async getTours(): Promise<void> {
    try {
      const result: PagedResults<Tour> | undefined = await this.service.getTours().toPromise();

      if (result) {
        this.allTours = result.results;
        this.tours = result.results;
        this.calculateAverageGrades();
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

  calculateAverageGrades(): void {
    for (const tour of this.tours) {
      if (tour.id !== undefined) {
        this.service.getAverageGrade(tour.id).subscribe((averageGrade) => {
          if (tour.id !== undefined) {
            this.tourAverageGrades[tour.id] = averageGrade.averageGrade;
          }
        });
      }
    }
  }
  
  async startTour(tour:Tour) {
    let tourExecution:TourExecution = {
      tourId:tour.id!,
      TouristId:this.authService.user$.value.id,
      StartTime:new Date(),
      EndTime: undefined,
      Completed: false,
      Abandoned: false,
      CurrentLatitude: 0,
      CurrentLongitude: 0,
      LastActivity: new Date(),
      visitedCheckpoints : [tour.checkPoints[0]],
      touristDistance: 0,
    };
    await this.service.getCheckpointById(tour.checkPoints[0]).subscribe((checkpoint:Checkpoint)=>{
      tourExecution.CurrentLatitude = checkpoint.latitude;
      tourExecution.CurrentLongitude = checkpoint.longitude;
      this.service.startTour(tourExecution).subscribe((value)=>{
      localStorage.setItem(tourExecution.TouristId.toString(),JSON.stringify({userId:tourExecution.TouristId,latitude:tourExecution.CurrentLatitude,longitude:tourExecution.CurrentLongitude}))
      this.router.navigate(['activeTour']);
      })
    })
  }
}
