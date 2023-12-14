import { Component } from '@angular/core';
import { Profile } from '../model/profile.model';
import { Wallet } from '../model/wallet.model';
import { AdministrationService } from '../administration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent {

  profile: Profile;
  selectedProfile: Profile;
  showProfileForm: boolean = false;
  showPictureForm: boolean = false;
  showMessage: boolean = false;
  showProfilePictureForm: boolean = false;
  showEditProfileForm: boolean = false;
  showProfilePreferences: boolean = false;
  showPurchase: boolean = false;
  wallet: Wallet;

  toggleEditProfileForm() {
    this.showEditProfileForm =  true;
    this.showProfilePictureForm = false;
    this.showProfilePreferences = false;
    this.showPurchase = false;
  }

  toggleProfilePictureForm() {
    this.showProfilePictureForm =  true;;
    this.showEditProfileForm = false;
    this.showProfilePreferences = false;
    this.showPurchase = false;
  }  

  togglePreferencesForm() {
    this.showProfilePreferences = true;
    this.showEditProfileForm = false;
    this.showProfilePictureForm = false;
    this.showPurchase = false;
  }
  
  togglePurchaseForm() {
    this.showPurchase =  true;
    this.showEditProfileForm = false;
    this.showProfilePictureForm = false;
    this.showProfilePreferences = false;
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
        this.onEditClicked(this.profile)
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
  onTourPreferencesClicked() {
    this.togglePreferencesForm();
  }

  onPurchaseReportsClicked() {
    this.togglePurchaseForm();
  }
}
