import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketplaceService } from '../marketplace.service';
import { ApplicationReview } from '../model/application-review.model';
import { AuthService } from '../../../infrastructure/auth/auth.service'; 

@Component({
  selector: 'xp-application-review-form',
  templateUrl: './application-review-form.component.html',
  styleUrls: ['./application-review-form.component.css']
})
export class ApplicationReviewFormComponent{

  @Input() applicationReview: ApplicationReview;
  @Input() shouldEdit: boolean = false;  
  @Output() applicationReviewUpdated = new EventEmitter<null>();

  constructor(private service: MarketplaceService, private authService: AuthService) {
  }


  applicationReviewForm = new FormGroup({
    grade: new FormControl('', [Validators.required]),
    comment: new FormControl(''),
  });

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
      }
    });
  }
  

  }