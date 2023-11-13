import { Component } from '@angular/core';
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
export class ViewToursComponent {

  tours: Tour[] = [];
  tourAverageGrades: { [tourId: number]: number } = {};
  constructor(private service: TourAuthoringService, private marketService: MarketplaceService, private authService:AuthService, private router: Router) {}

  
  ngOnInit(): void {
    this.getTour();
  }

  getTour(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResults<Tour>) =>
      {
        this.tours = result.results;
        console.log(this.tours);
        this.calculateAverageGrades();
      },
      error: () => {
      }     
    })
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
      LastActivity: new Date()
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
