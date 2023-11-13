import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Checkpoint } from '../model/checkpoint.model';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { forkJoin } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { TourReview } from '../../marketplace/model/tour-review.model';
import { MarketplaceService } from '../../marketplace/marketplace.service';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class TourOverviewComponent {
  tour: Tour;
  tourId: number | null;
  checkpoints: Checkpoint[] = [];
  canRender: boolean = false;
  images: string[] = [];
  currentIndex: number = 0;
  reviews: TourReview[] = [];

  constructor(private tourService: TourAuthoringService, private route: ActivatedRoute, private marketplaceService: MarketplaceService) { }

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
        this.fetchTourReviews();
      } else {
        // Handle the case where id is null
      }
    });
  }

  difficultyStars(difficulty: number): number[] {
    return Array(difficulty).fill(1);
  }

  fetchTourReviews(): void {
    this.marketplaceService.getTourReview().subscribe({
      next: (result) => {
        this.reviews = result.results;
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
          this.images = this.checkpoints.map(checkpoint => checkpoint.image);
        },
        error: (error) => {
          // Handle errors if necessary
        }
      });
    } else {
      this.canRender = true; // If there are no checkpoint IDs, set canRender to true immediately.
    }
  }

  getCurrentImage(): string {
    return this.images[this.currentIndex];
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
}