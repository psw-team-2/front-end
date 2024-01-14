import { Component } from '@angular/core';
import { Profile } from '../model/profile.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AdministrationService } from '../administration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Follow } from '../model/follow.model';

@Component({
  selector: 'xp-app-user-followers',
  templateUrl: './app-user-followers.component.html',
  styleUrls: ['./app-user-followers.component.css']
})
export class AppUserFollowersComponent {

  loggedInProfile: Profile | null = null;
  followers: Profile[] = [];
  profiles: Profile[];
  selectedFollower: Profile | null = null;
  id: number = -1;
  selectedId: number = -1;
  followedProfiles: { [key: number]: boolean } = {};
  profileFollowed="";
  alreadyFollow: any;
  hasFollowers: boolean = false;

  constructor(private service: AdministrationService,private router: Router,private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    // Get the currently logged-in user's profile
    
    this.route.params.subscribe(params => {
      this.id = params['id'];
      // Now you have the userId, you can use it to fetch the user's profile data.
      console.log('User ID:', this.id);
      this.service.getByProfileUserId(this.id).subscribe({
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
            console.log("FOLLOWERS");
            console.log(this.followers);
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
    });
    
  }

  sendMessageTo(follower: Profile): void {
    this.selectedFollower = follower;
    console.log(this.selectedFollower);
  }

  LinkToProfile(selectedId?: number) {
    if (selectedId !== undefined) {
      this.router.navigate(['/app-user-profile', selectedId]);
    }
  }

  onFollowClicked(profile: Profile) {
    if (this.loggedInProfile) {
      // Check if the logged-in profile already follows the selected profile
      this.service.alreadyFollows(profile.id!, this.loggedInProfile.id!).subscribe({
        next: (result: boolean) => {
          if (result) {
            // Display an alert if the combination already exists
            this.alreadyFollow = true;
            this.profileFollowed=`You already follow ${profile.firstName} ${profile.lastName}.`
            //alert(`You already follow ${profile.firstName} ${profile.lastName}`);
          } else {
            const follow: Follow = {
              profileId: profile.id!, // Id of the profile to be followed
              followerId: this.loggedInProfile!.id // Id of the logged-in user
            };
  
            this.service.addFollow(follow).subscribe({
              next: (newFollow: Follow) => {
                this.alreadyFollow=false;
                this.profileFollowed=`You have successfully followed ${profile.firstName} ${profile.lastName}`
                // alert(`You have successfully followed ${profile.firstName} ${profile.lastName}`);
                this.followedProfiles[profile.id!] = true;
              },
              error: (err: any) => {
                console.error('Error while following:', err);
              }
            });
          }
        },
        error: (err: any) => {
          console.error('Error while checking if already follows:', err);
        }
      });
    }
  }
  onFollowOKClicked() {
    this.profileFollowed=``
  }
}
