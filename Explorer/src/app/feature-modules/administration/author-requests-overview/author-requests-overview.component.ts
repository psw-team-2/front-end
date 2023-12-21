import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Router } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Request } from '../model/request.model';
import { Profile } from '../model/profile.model'; // Import the Profile model

@Component({
  selector: 'xp-author-requests-overview',
  templateUrl: './author-requests-overview.component.html',
  styleUrls: ['./author-requests-overview.component.css']
})
export class AuthorRequestsOverviewComponent implements OnInit {
  requests: Request[];
  profiles: Profile[] = []; // Add a profiles array to store fetched profiles

  constructor(private service: AdministrationService, private router: Router) {}

  ngOnInit(): void {
    this.service.getAllUnderReviewRequests().subscribe({
      next: (result: PagedResults<Request>) => {
        this.requests = result.results;
        console.log("REQUESTS:");
        console.log(this.requests);

        // Fetch profiles based on profileIds in the requests
        this.fetchProfiles();
      },
      error: (err: any) => {
        console.error('Error while getting requests:', err);
      }
    });
  }

  fetchProfiles(): void {
    const profileIds: number[] = this.requests
      .map(request => request.profileId)
      .filter(id => id !== undefined) as number[]; // Filter out undefined values
  
    profileIds.forEach(id => {
      this.service.getByProfileUserId(id).subscribe({
        next: (profile: Profile) => {
          this.profiles.push(profile);
        },
        error: (err: any) => {
          console.error(`Error while fetching profile ${id}:`, err);
        }
      });
    });
  }
  
  onDeclineClicked(request: Request) {
    const updatedRequest : Request = {
      id: request.id,
      profileId: request.profileId,
      status: 2
    }

    this.service.updateRequest(updatedRequest).subscribe({
      next: (_) => {
        window.location.reload();
        console.log(updatedRequest);
      },
      error: (error) => {
        console.error('Error updating request:', error);
      }
    });
  }

  onAcceptClicked(request: Request) {
    const updatedRequest: Request = {
      id: request.id,
      profileId: request.profileId,
      status: 1
    };
  
    if (updatedRequest.profileId !== undefined) {
      this.service.updateRequest(updatedRequest).subscribe({
        next: (_) => {
          if (typeof updatedRequest.profileId === 'number') {
            this.service.getByProfileUserId(updatedRequest.profileId).subscribe({
              next: (profile) => {
                console.log('Retrieved Profile:', profile);
  
                // Fetch the user based on profile's UserId
                if (profile.userId !== undefined) {
                  this.service.getUserById(profile.userId).subscribe({
                    next: (user) => {
                      console.log('Retrieved User role:', user);
                      user.role = 1;
                      console.log("User pre slanja: ", user)
                      this.service.updateUserAccount(user);
                    },
                    error: (error) => {
                      console.error('Error fetching user:', error);
                    }
                  });
                } else {
                  console.error('User ID is undefined in the profile.');
                }
              },
              error: (error) => {
                console.error('Error fetching profile:', error);
              }
            });
          }
    
          //window.location.reload();
          console.log(updatedRequest);
        },
        error: (error) => {
          console.error('Error updating request:', error);
        }
      });
    } else {
      console.error('Profile ID is undefined.');
    }
  }
  
  
  
}
