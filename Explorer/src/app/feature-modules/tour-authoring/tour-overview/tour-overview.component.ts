import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Checkpoint } from '../model/checkpoint.model';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css']
})
export class TourOverviewComponent {

  tour: Tour;
  tourId: number | null;
  checkpoints: Checkpoint[] = [];
  canRender: boolean = false;

  constructor(private tourService: TourAuthoringService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.tourId = id ? parseInt(id, 10) : null;
      if (this.tourId !== null) {
        this.tourService.getTour(this.tourId).subscribe({
          next: (result: Tour) => {
            this.tour = result;
            this.fetchCheckpointsForTour(this.tourId);
          }
        });
      } else {
        // Handle the case where id is null
      }
    });
  }

  fetchCheckpointsForTour(tourId: number | null): void {
    if (tourId === null) {
      // Handle the case where tourId is null
      return;
    }

    const checkpointIds: Number[] = this.tour.checkPoints;

    if (checkpointIds.length > 0) {
      const observables = checkpointIds.map(checkpointId =>
        this.tourService.getCheckpointById(checkpointId)
      );

      forkJoin(observables).subscribe({
        next: (checkpoints: Checkpoint[]) => {
          this.checkpoints = checkpoints;
          this.canRender = true; // Set canRender to true when all checkpoints are fetched.
          console.log(new Date());
        },
        error: (error) => {
          // Handle errors if necessary
        }
      });
    } else {
      this.canRender = true; // If there are no checkpoint IDs, set canRender to true immediately.
    }
  }
}