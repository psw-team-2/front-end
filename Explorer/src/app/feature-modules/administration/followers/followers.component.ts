import { Component, OnInit } from '@angular/core';
import { Profile } from '../model/profile.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
  loggedInProfile: Profile | null = null;
  followers: Profile[] = [];
  profiles: Profile[];
  selectedFollower: Profile | null = null; // Initialize as null

  constructor(private service: AdministrationService) {}
  
  ngOnInit(): void {
    // Get the currently logged-in user's profile
    this.service.getByUserId().subscribe({
      next: (loggedInProfile: Profile) => {
        this.loggedInProfile = loggedInProfile;

        // Get all profiles
        this.service.getProfiles().subscribe({
          next: (result: PagedResults<Profile>) => {
            // Filter out the currently logged-in profile
            this.profiles = result.results.filter((profile) => profile.id !== loggedInProfile.id);
          },
          error: (err: any) => {
            console.log(err);
          }
        });

        // Get follows after getting the logged-in user's profile
      this.service.getAllFollowers(this.loggedInProfile).subscribe({
        next: (result: PagedResults<Profile>) => {
          this.followers = result.results;
        },
        error: (err: any) => {
          console.error('Error while getting followers:', err);
        }
      });
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  sendMessageTo(follower: Profile): void {
    this.selectedFollower = follower;
    console.log(this.selectedFollower);
  }
  
}
