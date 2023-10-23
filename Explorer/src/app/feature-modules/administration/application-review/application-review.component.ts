import { Component,OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { ApplicationReview } from '../../marketplace/model/application-review.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-application-review',
  templateUrl: './application-review.component.html',
  styleUrls: ['./application-review.component.css']
})
export class ApplicationReviewComponent implements OnInit {
  applicationReview: ApplicationReview[] = [];
  selectedApplicationReview: ApplicationReview;
  shouldRenderApplicationReviewForm: boolean = false;
  shouldEdit: boolean = false;
  
  constructor(private service: AdministrationService) { }
  
  ngOnInit(): void {
    this.getApplicationReview();
  }
  
  deleteApplicationReview(id: number): void {
    this.service.deleteApplicationReview(id).subscribe({
      next: () => {
        this.getApplicationReview();
      },
    });
  }
  
  getApplicationReview(): void {
    this.service.getApplicationReview().subscribe({
      next: (result: PagedResults<ApplicationReview>) => {
        this.applicationReview = result.results;
      },
      error: () => {
        // Ovde možete obraditi greške ako je potrebno
      },
    });
  }
  
  onEditClicked(applicationReview: ApplicationReview): void {
    this.selectedApplicationReview = applicationReview;
    this.shouldRenderApplicationReviewForm = true;
    this.shouldEdit = true;
  }
  
  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderApplicationReviewForm = true;
  }
  
}
