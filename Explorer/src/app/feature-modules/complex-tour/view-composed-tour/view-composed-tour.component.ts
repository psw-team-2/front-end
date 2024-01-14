import { Component } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ComplexTourService } from '../complex-tour.service';
import { ComposedTour } from '../model/composed-tour.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { forkJoin } from 'rxjs';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'xp-view-composed-tour',
  templateUrl: './view-composed-tour.component.html',
  styleUrls: ['./view-composed-tour.component.css']
})
export class ViewComposedTourComponent {
  user: User | undefined;
  composedTours: ComposedTour[] = [];
  tours: Tour[] = [];
  images: string[] = [];
  canRender: boolean = false;
  checkpoints: Checkpoint[] = [];
  firstCheckpoints: Checkpoint[] = [];
  tourImagesMap: { [tourId: string]: string } = {};

  constructor(private service : ComplexTourService, private authService:  AuthService, private tourService: TourAuthoringService, private router: Router){}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      console.log(this.user);

      // Call the getAll method and filter the results
      this.service.getAll(0,0).subscribe((result: PagedResults<ComposedTour>) => {
        // Assuming ComposedTour has a property 'authorId'
        this.composedTours = result.results.filter(tour => tour.authorId === this.user?.id);
        console.log(this.composedTours);

        this.composedTours.forEach(composedTour => {
          const convertedTour = this.convertToTour(composedTour);
          console.log(convertedTour)
          this.tours.push(convertedTour);
        });
        this.fetchCheckpointsForTour();

      });
    });
  }


  convertToTour(composedTour: ComposedTour): Tour {
    return {
      id: composedTour.id,
      name: composedTour.name,
      description: composedTour.description,
      difficulty: composedTour.difficulty,
      tags: composedTour.tags,
      checkPoints : composedTour.checkPoints,
      equipment: composedTour.equipment,
      objects: composedTour.objects,
      status: composedTour.status,
      totalLength: composedTour.totalLength,
      footTime: composedTour.footTime,
      bicycleTime: composedTour.bicycleTime,
      carTime: composedTour.carTime,
      authorId: composedTour.authorId,
      publishTime: composedTour.publishTime,
      points: 0,
      price: 0,
      image: ''
    };
  }

fetchCheckpointsForTour(): void {
  this.tours.forEach((tour: Tour | undefined) => {
    if (tour) {
      const checkpointIds: number[] = tour.checkPoints;

      if (checkpointIds.length > 0) {
        const observables = checkpointIds.map(checkpointId =>
          this.tourService.getCheckpointById(checkpointId)
        );

        forkJoin(observables).subscribe({
          next: (checkpoints: Checkpoint[]) => {
            if (checkpoints.length > 0) {
              const firstCheckpoint = checkpoints[0];
              this.firstCheckpoints.push(firstCheckpoint);

              // Push the image of the first checkpoint to images array
              if(tour.id){
                this.tourImagesMap[tour.id] = firstCheckpoint.image;
              }
            }
            this.canRender = true; // Set canRender to true when all checkpoints are fetched for all tours.
            console.log(new Date());
            // You can handle other operations with fetched checkpoints here if needed.
          },
          error: (error) => {
            // Handle errors if necessary
          }
        });
      } else {
        this.canRender = true; // If there are no checkpoint IDs, set canRender to true immediately.
      }
    } else {
      this.canRender = true; // Set canRender to true if the tour is undefined.
    }
  });
}


redirectToComposedTour(tour: any) {
  if (tour && tour.id) {
    this.router.navigate(['/composed-tour', tour.id]);
  } else {
  }
}



}
