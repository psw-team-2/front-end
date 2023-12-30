import { Component,OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { ApplicationReview } from '../../marketplace/model/application-review.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model'; 
import { StarComponent } from '../star/star.component';

@Component({
  selector: 'xp-application-review',
  templateUrl: './application-review.component.html',
  styleUrls: ['./application-review.component.css']
})
export class ApplicationReviewComponent implements OnInit {
  applicationReview: ApplicationReview[] = [];
  userNames: { [key: number]: string } = {};
  
  
  constructor(private authService: AuthService,private service: AdministrationService) { }
  
  ngOnInit(): void {
    this.getApplicationReview();
  }

  
  
  
  getApplicationReview(): void {
    this.service.getApplicationReview().subscribe({
      next: (result: PagedResults<ApplicationReview>) => {
        this.applicationReview = result.results;
        this.loadUserNames();
      },
      error: () => {
        
      },
    });
  }

  loadUserNames(): void {
    this.applicationReview.forEach((applicationReview) => {
      this.authService.getUserById(applicationReview.userId).subscribe((user: User) => {
        this.userNames[applicationReview.userId] = user.username;
      });
    });
  }

  getStars(grade: number): number[] {
    return Array(Math.round(grade)).fill(0);
  }

  getUserName(userId: number): string {
    if (this.userNames[userId]) {
      return this.userNames[userId];
    }
    return 'Nepoznato';
  }

  
}
