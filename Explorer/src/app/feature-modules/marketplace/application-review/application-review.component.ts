import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MarketplaceService } from '../marketplace.service';
import { ThisReceiver } from '@angular/compiler';
import { ApplicationReview } from '../model/application-review.model';

@Component({
  selector: 'xp-application-review',
  templateUrl: './application-review.component.html',
  styleUrls: ['./application-review.component.css']
})
export class ApplicationReviewComponent{

  @Input() applicationReview: ApplicationReview;
  @Input() shouldEdit: boolean = false;   ///
  @Output() applicationReviewUpdated = new EventEmitter<null>();

  constructor(private service: MarketplaceService) {
  }


  applicationReviewForm = new FormGroup({
    grade: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
  });

  addApplicationReview(): void {
    const applicationReview: ApplicationReview = {
      grade: Number(this.applicationReviewForm.value.grade) || 0,
      comment: this.applicationReviewForm.value.comment || "",
    };
  
    this.service.addApplicationReview(applicationReview).subscribe({
      next: () => { 
        this.applicationReviewUpdated.emit();
      }
    });
  }
  

  }