import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourReview } from '../model/tour-review.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';

import { ActivatedRoute } from '@angular/router'; 
@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css']
})

export class TourReviewFormComponent implements OnChanges {
  
  constructor(private authService: AuthService, private service: MarketplaceService, private tourAuthoringService: TourAuthoringService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.tourId = +params['id']; // Read the tourId from the URL
    });
  }

  @Input() tourReview: TourReview;
  @Input() shouldEdit: boolean = false;
  @Output() tourReviewUpdated = new EventEmitter<null>();
  
  public value = new Date();
  currentFile: File;
  currentFileURL: string | null = null;
  tourId: number;
  userId = this.authService.user$.value.id;
  
  tourReviewForm = new FormGroup({
    grade: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
    images: new FormControl('', [Validators.required]),
    reviewDate: new FormControl('', [Validators.required]),
    tourId: new FormControl('', [Validators.required])
  });
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.shouldEdit && this.tourReview) {
      this.tourReviewForm.patchValue({
        grade: this.tourReview.grade.toString(),
        comment: this.tourReview.comment || null,
        images: this.tourReview.images || null,
        reviewDate: this.tourReview.reviewDate instanceof Date ? this.tourReview.reviewDate.toISOString() : null,
        tourId : this.tourReview.grade.toString() || null,
      });
  }
}


  async addTourReview():  Promise<void> {
    
    const tourReview: TourReview = {
      grade: Number(this.tourReviewForm.value.grade) || 0,
      comment: this.tourReviewForm.value.comment || "",
      images: 'https://localhost:44333/Images/' + this.currentFile.name,
      userId: this.userId,
      reviewDate: this.value,
      tourId: this.tourId
 
    };
    await this.service.upload(this.currentFile).subscribe({
      next: (value) => {

      },
      error: (value) => {

      }, complete: () => {
      },
    });
    this.service.addTourReview(tourReview,this.userId).subscribe({
      next: (_) => {
        this.tourReviewUpdated.emit();
      }});
  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
    if (this.currentFile) {
      // Create a URL for the selected file
      this.currentFileURL = window.URL.createObjectURL(this.currentFile);
    }
  }
  async updateTourReview(): Promise<void> {
    const userId = this.authService.user$.value.id;
    if (this.tourReview.id !== null) {
      if (!this.currentFile) {
        const tourReview: TourReview = {
          userId : userId,
          comment: this.tourReviewForm.value.comment || "",
          grade: Number(this.tourReviewForm.value.grade) || 0,
          reviewDate:  this.value,
          id: this.tourReview.id,
          images: this.tourReviewForm.value.images || "",
          tourId: this.tourId
        };
        this.service.updateTourReview(tourReview).subscribe({
          next: (_) => {
            this.tourReviewUpdated.emit();
          }
        });
      } else {
        const tourReview: TourReview = {
          userId : userId,
          comment: this.tourReviewForm.value.comment || "",
          grade: Number(this.tourReviewForm.value.grade) || 0,
          reviewDate:  this.value,
          id: this.tourReview.id,
          images: 'https://localhost:44333/Images/' + this.currentFile.name,
          tourId: this.tourId
        };
        await this.service.upload(this.currentFile).subscribe({
          next: (value) => {
  
          },
          error: (value) => {
  
          }, complete: () => {
          },
        });
        this.service.updateTourReview(tourReview).subscribe({
          next: (_) => { this.tourReviewUpdated.emit() }
        });
      }
    }
  }

  
}




