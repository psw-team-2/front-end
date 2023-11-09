import { Component } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MarketplaceService } from '../../marketplace/marketplace.service';

@Component({
  selector: 'xp-view-tours',
  templateUrl: './view-tours.component.html',
  styleUrls: ['./view-tours.component.css']
})
export class ViewToursComponent {

  tours: Tour[] = [];
  tourAverageGrades: { [tourId: number]: number } = {};
  constructor(private service: TourAuthoringService, private marketService: MarketplaceService) {}
  
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
  
}
