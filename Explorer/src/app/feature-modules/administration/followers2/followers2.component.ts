import { Component, OnInit } from '@angular/core';
import { Profile } from '../model/profile.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-followers2',
  templateUrl: './followers2.component.html',
  styleUrls: ['./followers2.component.css']
})
export class Followers2Component {
  loggedInProfile: Profile | null = null;
  followers: Profile[] = [];
  profiles: Profile[];
  selectedFollower: Profile | null = null; // Initialize as null
  showMessageForm: boolean = false;
  hasFollowers: boolean = false;

  toggleChat() {
    this.showMessageForm = !this.showMessageForm;
  }

  closeChat() {
    this.showMessageForm = false;
  }

  constructor(private service: AdministrationService,private router: Router) {}
  
  ngOnInit(): void {
    // Get the currently logged-in user's profile
    this.service.getByUserId2().subscribe({
      next: (loggedInProfile: Profile) => {
        this.loggedInProfile = loggedInProfile;

        // Get all profiles
        this.service.getProfiles2().subscribe({
          next: (result: PagedResults<Profile>) => {
            // Filter out the currently logged-in profile
            this.profiles = result.results.filter((profile) => profile.id !== loggedInProfile.id);
          },
          error: (err: any) => {
            console.log(err);
          }
        });

        // Get follows after getting the logged-in user's profile
      this.service.getAllFollowers2(this.loggedInProfile).subscribe({
        next: (result: PagedResults<Profile>) => {
          this.followers = result.results;
          if(this.followers.length==0){
            this.hasFollowers=true;
            console.log("NEMA FOLLOWERA")
          }
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
    this.showMessageForm = true;
    console.log(this.selectedFollower);
  }
  findPeople() {
    this.router.navigate(['find-people-autor']);
  }
}
