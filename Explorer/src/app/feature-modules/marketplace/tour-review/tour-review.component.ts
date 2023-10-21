import { Component, OnInit } from '@angular/core';
import { TourReview } from '../model/tour-review.model';
import { MarketplaceService } from '../marketplace.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent implements OnInit {
  tourReview: TourReview[] = [];
  shouldRenderTourReviewForm: boolean = false;
  shouldEdit: boolean = false;
  selectedTourReview: TourReview;

  constructor(private service: MarketplaceService) { }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderTourReviewForm = true;
  }

  ngOnInit(): void {
    this.getTourReview();
  }
  getTourReview(): void {
    this.service.getTourReview().subscribe({
      next: (result: PagedResults<TourReview>) => {
        this.tourReview = result.results;
      },
      error: () => {
      }
    })
  }

  deleteTourReview(id: number): void {
    this.service.deleteTourReview(id).subscribe({
      next: () => {
        this.getTourReview();
      },
    })
  }


}
