import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { Profile } from '../model/profile.model';
import { HttpClient } from '@angular/common/http';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Wallet } from '../model/wallet.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  profile: Profile[] = [];
  selectedProfile: Profile;
  showProfileForm: boolean = false;
  showPictureForm: boolean = false;
  showMessage: boolean = false;
  showProfilePictureForm: boolean = false;
  showEditProfileForm: boolean = false;
  wallet: Wallet;
  shouldRender: boolean = false;
  
  toggleEditProfileForm() {
    this.showEditProfileForm = !this.showEditProfileForm;
  }

  toggleProfilePictureForm() {
    this.showProfilePictureForm = !this.showProfilePictureForm;
  }  
  
  constructor(private service: AdministrationService , private router: Router) { }

  ngOnInit(): void {
    
    this.getByUserId();
    this.delayedShowMessage();
    this.getWalletByUserId();

    console.log("SELECTED PROFILE U KLASI PROFIL");
    console.log(this.selectedProfile);
  }
  
  delayedShowMessage() {
    setTimeout(() => {
      this.showMessage = true;
    }, 1000);
  }
  
  getByUserId(): void {
    this.service.getByUserId().subscribe({
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