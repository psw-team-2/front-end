import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Checkpoint } from '../model/checkpoint.model';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css']
})
export class TourOverviewComponent {

  tour: Tour;
  tourId: number | null; // Define a variable to store the parsed tourId as an integer or null
  checkpoints : Checkpoint[];

  constructor(private tourService: TourAuthoringService, private route: ActivatedRoute) {
    this.checkpoints = [];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); // Get the id as a string or null
      this.tourId = id ? parseInt(id, 10) : null;
      if (this.tourId !== null) {
        this.tourService.getTour(this.tourId).subscribe({
          next: (result: Tour) => {
            this.tour = result;
            // Now, fetch and add checkpoints
            this.fetchCheckpointsForTour(this.tourId);
          }
        });
      } else {
        // Handle the case where id is null (e.g., show an error or redirect)
      }
    });
  }

  fetchCheckpointsForTour(tourId: number | null): void {
    if (tourId === null) {
      // Handle the case where tourId is null (e.g., show an error or redirect)
      return;
    }

    // Assuming you have a method to get checkpoint IDs from this.tour (adjust it according to your data structure)
    const checkpointIds: Number[] = this.tour.checkPoints;

    if (checkpointIds.length > 0) {
      // Fetch and add checkpoints for each checkpoint ID
      checkpointIds.forEach(checkpointId => {
        this.tourService.getCheckpointById(checkpointId).subscribe({
          next: (checkpoint: Checkpoint) => {
            this.checkpoints.push(checkpoint);
          },
          error: (error) => {
            // Handle errors if necessary
          }
        });
      });
    }
  }
}
