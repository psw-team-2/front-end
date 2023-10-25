import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TourReview } from '../model/tour-review.model';
import { ThisReceiver } from '@angular/compiler';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css']
})

export class TourReviewFormComponent {
  
  constructor(private authService: AuthService, private service: MarketplaceService) {}

  @Input() tourReview: TourReview;
  @Input() shouldEdit: boolean = false;
  @Output() tourReviewUpdated = new EventEmitter<null>();
  public value = new Date();
  currentFile: File;
  currentFileURL: string | null = null;
  tourReviewForm = new FormGroup({
    grade: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
    images: new FormControl('', [Validators.required]),
    reviewDate: new FormControl('', [Validators.required]),
  });
  
  ngOnChanges(changes: SimpleChanges): void {
    this.tourReviewForm.reset();
    if (this.shouldEdit) {
      this.tourReviewForm.patchValue({
        grade: String(this.tourReview.grade) || null,
        comment: this.tourReview.comment || null,
        images: this.tourReview.images || null,
        reviewDate: this.tourReview.reviewDate ? this.tourReview.reviewDate.toISOString() : null
      });
    }
  }

  async addTourReview():  Promise<void> {
    const userId = this.authService.user$.value.id;
    const tourReview: TourReview = {
      grade: Number(this.tourReviewForm.value.grade) || 0,
      comment: this.tourReviewForm.value.comment || "",
      images: 'https://localhost:44333/Images/' + this.currentFile.name,
      userId: userId,
      reviewDate: this.value
 
    };
    await this.service.upload(this.currentFile).subscribe({
      next: (value) => {

      },
      error: (value) => {

      }, complete: () => {
      },
    });
    this.service.addTourReview(tourReview).subscribe({
      next: (_) => {
        this.tourReviewUpdated.emit()
      }});
  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
    if (this.currentFile) {
      // Create a URL for the selected file
      this.currentFileURL = window.URL.createObjectURL(this.currentFile);
    }
  }

  
  
  
}




