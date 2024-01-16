import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MarketplaceService } from '../marketplace.service';
import { ApplicationReview } from '../model/application-review.model';
import { AuthService } from '../../../infrastructure/auth/auth.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'xp-application-review-form',
  templateUrl: './application-review-form.component.html',
  styleUrls: ['./application-review-form.component.css']
})
export class ApplicationReviewFormComponent{

  @Input() applicationReview: ApplicationReview;
  @Input() shouldEdit: boolean = false;  
  @Output() applicationReviewUpdated = new EventEmitter<null>();

  selectedStars: number = 0;


  constructor(private service: MarketplaceService, 
              private authService: AuthService,
              private snackBar: MatSnackBar, 
              private router: Router,
              public dialogRef: MatDialogRef<ApplicationReviewFormComponent>) {
  }

  applicationReviewForm = new FormGroup({
    grade: new FormControl('', [Validators.required]),
    comment: new FormControl(''),
  });

  setRating(n: number): void {
    this.selectedStars = n;
    this.applicationReviewForm.patchValue({ grade: n.toString() });
  }

  getStarImage(): string {
    const starImages = [
      'assets/images/star1.jpg',
      'assets/images/star2.jpg',
      'assets/images/star3.jpg',
      'assets/images/star5.jpg',
      'assets/images/star4.jpg',
    ];
  
    return this.selectedStars > 0 && this.selectedStars <= starImages.length
      ? starImages[this.selectedStars - 1]
      : 'assets/images/star4.jpg';  
  }


  addApplicationReview(): void {
    const userId = this.authService.user$.value.id;
    const applicationReview: ApplicationReview = {
      grade: Number(this.applicationReviewForm.value.grade) || 0,
      comment: this.applicationReviewForm.value.comment || "",
      userId: userId
    };
  
    this.service.addApplicationReview(applicationReview).subscribe({
      next: () => { 
        this.applicationReviewUpdated.emit();
        //this.router.navigate(['/profile']);
        this.onCloseClick();
        this.showSuccessNotification('Thank you for rating our application! Your feedback is valuable and helps us improve.');       
      },
      error: (error) => {
        console.error('Error adding application review:', error);
  
        // Prikazivanje poruke korisniku o grešci
        this.showErrorNotification('An error occurred while adding the review. Please try again.');
      }
    });
  }
  
  showSuccessNotification(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000, // Set the duration for which the notification should be visible (in milliseconds)
    });
  }

  showErrorNotification(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['error-snackbar'] // Dodajte stilizaciju za poruku o grešci
    });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}