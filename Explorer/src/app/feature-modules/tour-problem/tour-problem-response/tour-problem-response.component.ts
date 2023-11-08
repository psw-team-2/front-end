import { Component, OnInit } from '@angular/core';
import { TourProblemResponse } from '../model/tour-problem-response.model';
import { TourProblemResponseService } from '../tour-problem-response.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-problem-response',
  templateUrl: './tour-problem-response.component.html',
  styleUrls: ['./tour-problem-response.component.css']
})
export class TourProblemResponseComponent implements OnInit {
   problemResponses: TourProblemResponse[] = [];
   currentUser: User;
   currentProblemId: number;

   constructor(private problemResponseService: TourProblemResponseService, private authService: AuthService, private route: ActivatedRoute) {  

   }

   ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });

    this.route.paramMap.subscribe(params => {
      const problemIdParam = params.get('problemId');
      if (problemIdParam !== null) {
        this.currentProblemId = +problemIdParam;
        console.log('Problem ID:', this.currentProblemId);
        this.getTourProblemResponses();
      } 
    });
  }

  getTourProblemResponses(): void {
    if (this.currentUser && this.currentUser?.role == 'author') {
      this.problemResponseService.getResponsesAuthor(this.currentProblemId).subscribe({
        next: (result: PagedResults<TourProblemResponse>) => {
          this.problemResponses = result.results;
          console.log('Responses for author:', this.problemResponses);
        },
        error: () => {}
      });
      
    }
    else if (this.currentUser && this.currentUser?.role == 'tourist') {
      this.problemResponseService.getResponsesTourist(this.currentProblemId).subscribe({
        next: (result: PagedResults<TourProblemResponse>) => {
          this.problemResponses = result.results;
          console.log('Responses for tourist:', this.problemResponses);
        },
        error: () => {}
      });
    }
    else if (this.currentUser && this.currentUser?.role == 'administrator') {
      this.problemResponseService.getResponsesAdministrator(this.currentProblemId).subscribe({
        next: (result: PagedResults<TourProblemResponse>) => {
          this.problemResponses = result.results;
          console.log('Responses for administrator:', this.problemResponses);
        },
        error: () => {}
      });
    }
  }
}