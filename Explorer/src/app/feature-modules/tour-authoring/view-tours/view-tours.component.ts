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

  constructor(private service: TourAuthoringService) {}
  
  async ngOnInit(): Promise<void> {
    await this.getTours();
  }

  async getTours(): Promise<void> {
    try {
      const result: PagedResults<Tour> | undefined = await this.service.getTours().toPromise();

      if (result) {
        this.tours = result.results;
        console.log(this.tours);
      } else {
        // Handle the case where result is undefined
      }
    } catch (error) {
      // Handle errors if needed
    }
  }
}
