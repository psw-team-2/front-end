import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TourProblemResponse } from '../model/tour-problem-response.model';
import { TourProblemResponseService } from '../tour-problem-response.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable, catchError, map, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-tour-problem-response',
  templateUrl: './tour-problem-response.component.html',
  styleUrls: ['./tour-problem-response.component.css']
})
export class TourProblemResponseComponent implements OnInit {
  problemResponses: TourProblemResponse[] = [];
  currentUser: User;
  @Input() currentProblemId: number | null; //added | null
  @Output() responsesUpdated = new EventEmitter<null>();
  mappedUsername: { [key: number]: string } = {};

  constructor(private problemResponseService: TourProblemResponseService, private authService: AuthService, private route: ActivatedRoute, private snackBar: MatSnackBar) {  

  }

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });

  

    // this.route.paramMap.subscribe(params => {
    //   const problemIdParam = params.get('problemId');
    //   if (problemIdParam !== null) {
    //     this.currentProblemId = +problemIdParam;
    //     this.getTourProblemResponses();
    //   } 
    // });

    this.getTourProblemResponses();
    
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000, 
    });
  }

  getTourProblemResponses(): void {
    //ADDED != NULL CASE
    if(this.currentProblemId != null){
      if (this.currentUser && this.currentUser?.role === 'author') {
        this.problemResponseService.getResponsesAuthor(this.currentProblemId).subscribe({
          next: (result: PagedResults<TourProblemResponse>) => {
            //@ts-ignore
            this.problemResponses = result;
            console.log('Responses for author:', this.problemResponses);
            this.mapUsernames();
            this.responsesUpdated.emit();
          },
          error: () => {}
        });
        
      }
      else if (this.currentUser && this.currentUser?.role === 'tourist') {
        this.problemResponseService.getResponsesTourist(this.currentProblemId).subscribe({
          next: (result: PagedResults<TourProblemResponse>) => {
            //@ts-ignore
            this.problemResponses = result;
            console.log('Responses for tourist:', this.problemResponses);
            this.mapUsernames();
            this.responsesUpdated.emit();
          },
          error: () => {}
        });
      }
      else if (this.currentUser && this.currentUser?.role === 'administrator') {
        this.problemResponseService.getResponsesAdministrator(this.currentProblemId).subscribe({
          next: (result: PagedResults<TourProblemResponse>) => {
            //@ts-ignore
            this.problemResponses = result;
            console.log('Responses for administrator:', this.problemResponses);
            this.mapUsernames();
            this.responsesUpdated.emit();
          },
          error: () => {}
        });
      }
    }
    //ADDED ELSE FOR CURRENTPROBLEMID == NULL CASE
    else{
      error:() => {}
    }
  }

  getMappedUsername(userId: number): Observable<string> {
    return this.authService.getUsername(userId).pipe(
        map((userData: any) => {
            if (userData && userData.username) {
                return userData.username;
            } else {
                return 'Unknown';
            }
        }),
        catchError(error => {
            console.error('Error fetching username:', error);
            return of('Unknown');
        })
    );
  }

  mapUsernames(): void {
    this.problemResponses.forEach(response => {
      const commenterId = response.commenterId;
      this.getMappedUsername(commenterId).subscribe(
        (username: string) => {
          this.mappedUsername[commenterId] = username;
        },
        (error: any) => {
          console.error(error);
        }
      );
    });
  }

}