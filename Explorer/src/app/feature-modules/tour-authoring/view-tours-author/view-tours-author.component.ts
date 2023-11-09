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
  constructor(private service: TourAuthoringService) {}
  
  ngOnInit(): void {
    this.getTour();
  }

  getTour(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResults<Tour>) =>
      {
        this.tours = result.results;
        console.log(this.tours)
      },
      error: () => {
      }     
    })
  }

}
