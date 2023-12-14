import { Component } from '@angular/core';
import { Profile } from '../model/profile.model';
import { Wallet } from '../model/wallet.model';
import { AdministrationService } from '../administration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-app-user-profile',
  templateUrl: './app-user-profile.component.html',
  styleUrls: ['./app-user-profile.component.css']
})
export class AppUserProfileComponent {
  profile: Profile;
  selectedProfile: Profile;
  showProfileForm: boolean = false;
  showPictureForm: boolean = false;
  showMessage: boolean = false;
  showProfilePictureForm: boolean = false;
  showEditProfileForm: boolean = false;
  wallet: Wallet;

  toggleEditProfileForm() {
    this.showEditProfileForm = !this.showEditProfileForm;
  }

  toggleProfilePictureForm() {
    this.showProfilePictureForm = !this.showProfilePictureForm;
  }  
  
  constructor(private service: AdministrationService , private router: Router) { }

  ngOnInit(): void {
    this.getByUserId();
    this.getWalletByUserId();
  }

  getByUserId(): void {
    this.service.getByUserId().subscribe({
      next: (result: Profile) => {
        console.log('Result from API:', result);
        this.profile = result; // Wrap the result in an array, as it's a single Profile object
        console.log('Profile data in component:', this.profile);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getWalletByUserId(): void {
    this.service.getWalletByUserId().subscribe({
      next: (result: Wallet) => {
        console.log('Result from API:', result);
        this.wallet = result; // Wrap the result in an array, as it's a single Profile object
        console.log('Wallet:', this.wallet);
      },
      error: (err: any) => {
        console.log("NE RADI");
      }
    });
  }
  onEditClicked(profile: Profile): void {
    this.selectedProfile = profile;
    console.log(this.selectedProfile);   
    this.toggleEditProfileForm();
  }

  onChangeClicked(profile: Profile): void {
    this.selectedProfile = profile;
    console.log(this.selectedProfile);
    this.toggleProfilePictureForm();
  }

  onPurchaseReports(): void {
    this.router.navigate(['/purchase-reports']);
  }
}
