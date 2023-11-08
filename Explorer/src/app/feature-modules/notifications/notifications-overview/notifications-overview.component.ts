import { Component, OnInit } from '@angular/core';
import { TourProblemResponse } from '../../tour-problem/model/tour-problem-response.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourProblemService } from '../../tour-problem/tour-problem.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-notifications-overview',
  templateUrl: './notifications-overview.component.html',
  styleUrls: ['./notifications-overview.component.css']
})
export class NotificationsOverviewComponent implements OnInit {

  notifications: TourProblemResponse[] = [];
  currentUser: User;
  showNotifications: boolean = false;

  constructor(private service: TourProblemService, private authService: AuthService) {}

  ngOnInit(): void {
    
    this.getNotifications();

    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  getNotifications(): void{
    if (this.currentUser.role == 'author')
    {
      this.service.getTourProblemResponsesForAuthor(this.currentUser.id).subscribe({
        next: (result: PagedResults<TourProblemResponse>) => {
          this.notifications = result.results;
        },
        error: () => {
        }
      })
    }
    else if (this.currentUser.role == 'tourist')
    {
      this.service.getTourProblemResponsesForTourist(this.currentUser.id).subscribe({
        next: (result: PagedResults<TourProblemResponse>) => {
          this.notifications = result.results;
        },
        error: () => {
        }
      })
    }
    
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

}
