import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Router } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Request, RequestStatus } from '../model/request.model';
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
    this.service.getAllRequests().subscribe({
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
  
}
