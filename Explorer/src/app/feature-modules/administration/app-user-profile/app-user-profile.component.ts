import { Component } from '@angular/core';
import { Profile } from '../model/profile.model';
import { Wallet } from '../model/wallet.model';
import { AdministrationService } from '../administration.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-app-user-profile',
  templateUrl: './app-user-profile.component.html',
  styleUrls: ['./app-user-profile.component.css']
})
export class AppUserProfileComponent {
  profile: Profile[] = [];
  selectedProfile: Profile;
  showMessage: boolean = false;
  wallet: Wallet;
  formState: 'collapsed' | 'expanded' = 'collapsed';
  userId: number;  
  shouldRender: boolean = false;
  
  constructor(private service: AdministrationService , private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      // Now you have the userId, you can use it to fetch the user's profile data.
      console.log('User ID:', this.userId);
      this.getByUserId();
      this.delayedShowMessage();
    });
  }
  
  delayedShowMessage() {
    setTimeout(() => {
      this.showMessage = true;
    }, 1000);
  }
  
  getByUserId(): void {
    this.service. getByProfileUserId(this.userId).subscribe({
      next: (result: Profile) => {
        console.log('Result from API:', result);
        this.profile = [result]; // Wrap the result in an array, as it's a single Profile object
        console.log('Profile data in component:', this.profile);
        this.shouldRender = true;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
