import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Router } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Request } from '../model/request.model';
import { Profile } from '../model/profile.model';
import { User, UserRole } from '../model/user-account.model';
import { finalize, switchMap, catchError } from 'rxjs/operators';
import { forkJoin, throwError } from 'rxjs';

@Component({
  selector: 'xp-author-requests-overview',
  templateUrl: './author-requests-overview.component.html',
  styleUrls: ['./author-requests-overview.component.css']
})
export class AuthorRequestsOverviewComponent implements OnInit {
  requests: Request[];
  profiles: Profile[] = [];

  constructor(private service: AdministrationService, private router: Router) {}

  ngOnInit(): void {
    this.service.getAllUnderReviewRequests().subscribe({
      next: (result: PagedResults<Request>) => {
        this.requests = result.results;
        this.fetchProfiles();
      },
      error: (err: any) => {
        console.error('Error while getting requests:', err);
      }
    });
  }

  fetchProfiles(): void {
    const profileIds: number[] = this.requests
      .filter(request => request.profileId !== undefined)
      .map(request => request.profileId!) as number[];

    const profileRequests = profileIds.map(id => this.service.getByProfileUserId(id));

    forkJoin(profileRequests).pipe(
      catchError(error => {
        console.error('Error fetching profiles:', error);
        return throwError(error);
      }),
      finalize(() => {
        console.log('All profiles fetched:', this.profiles);
      })
    ).subscribe((profiles: Profile[]) => {
      this.profiles = profiles;
    });
  }

  onDeclineClicked(request: Request) {
    this.updateRequestStatus(request, 2);
    alert("You have declined this request!");
  }

  onAcceptClicked(request: Request) {
    this.updateRequestStatus(request, 1);
    this.updateUserRole(request);
    alert("You have accepted this request!");
  }

  updateRequestStatus(request: Request, status: number): void {
    const updatedRequest: Request = {
      ...request,
      status: status
    };

    this.service.updateRequest(updatedRequest).subscribe({
      next: (_) => {
        console.log('Request updated:', updatedRequest);
        // window.location.reload();
      },
      error: (error) => {
        console.error('Error updating request:', error);
      }
    });
  }

  updateUserRole(request: Request): void {
    const profile = this.profiles.find(profile => profile.id === request.profileId);

    if (profile && profile.userId) {
      this.service.getUserById(profile.userId).pipe(
        switchMap((user: User) => {
          user.id = profile.userId!;
          user.role = UserRole.Author;
          user.token = "iseubfuisf";
          console.log("User koji se salje", user)
          return this.service.updateUser(user);
        }),
        catchError(error => {
          console.error('Error updating user role:', error);
          return throwError(error);
        })
      ).subscribe(() => {
        console.log('User role updated successfully.');
        // Additional logic after user role update if needed
      });
    } else {
      console.error('Profile or UserID is undefined.');
    }
  }
}
