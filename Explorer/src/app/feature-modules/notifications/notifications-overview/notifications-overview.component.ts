import { Component, OnInit } from '@angular/core';
import { TourProblemResponse } from '../../tour-problem/model/tour-problem-response.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourProblemService } from '../../tour-problem/tour-problem.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable, catchError, map, of } from 'rxjs';
import { PublicRequest } from '../../tour-authoring/model/public-request.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { PaymentNotification } from '../../tour-authoring/model/paymentNotification.model';

@Component({
  selector: 'xp-notifications-overview',
  templateUrl: './notifications-overview.component.html',
  styleUrls: ['./notifications-overview.component.css']
})
export class NotificationsOverviewComponent implements OnInit {

  notifications: TourProblemResponse[] = [];
  currentUser: User;
  showNotifications: boolean = false;
  mappedUsername: { [key: number]: string } = {};
  publicRequests: PublicRequest[] =[];
  paymentNotifications: PaymentNotification[] = [];

  constructor(private service: TourProblemService, private authService: AuthService, private tourAuthoringService: TourAuthoringService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
    this.getPublicRequests();
    this.getNotifications();
    this.getPaymentNotifications();
  }

  getPaymentNotifications(): void {
    const userId = this.authService.user$.value.id;
    this.tourAuthoringService.getUnreadPaymentNotifications(userId).subscribe({
      next: (result: PagedResults<PaymentNotification>) => {
        // Assuming you want to extract the results array from PagedResults
        this.paymentNotifications = result.results;
      },
      error: (error) => {
        console.error('Error fetching unread payment notifications:', error);
      }
    });
  }

  getPublicRequests(): void {
    this.tourAuthoringService.getPublicRequestsByUserId(this.currentUser.id).subscribe({
      next: (result) => {
        //@ts-ignore
        this.publicRequests = result;
      }
    });
  }

  getNotifications(): void{
    if (this.currentUser && this.currentUser.role === 'author')
    {
      this.service.getTourProblemResponsesForAuthor(this.currentUser.id).subscribe({
        next: (result: PagedResults<TourProblemResponse>) => {
          //@ts-ignore
          this.notifications = result;
          this.mapUsernames();
        },
        error: () => {
        }
      })
    }
    else if (this.currentUser && this.currentUser.role === 'tourist')
    {
      this.service.getTourProblemResponsesForTourist(this.currentUser.id).subscribe({
        next: (result: PagedResults<TourProblemResponse>) => {
          //@ts-ignore
          this.notifications = result;
          this.mapUsernames();
        },
        error: () => {
        }
      })
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
    this.notifications.forEach(response => {
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

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }


  


}