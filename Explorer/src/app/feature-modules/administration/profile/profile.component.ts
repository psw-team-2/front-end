import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { Profile } from '../model/profile.model';
import { Request } from '../model/request.model';
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
  formState: 'collapsed' | 'expanded' = 'collapsed';
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
    this.router.navigate(['/profile-settings']);
  }

  onChangeClicked(profile: Profile): void {
    this.selectedProfile = profile;
    console.log(this.selectedProfile);
    this.toggleProfilePictureForm();
  }

  onPurchaseReports(): void {
    this.router.navigate(['/purchase-reports']);
  }

  toggleForm() {
    this.formState = this.formState === 'expanded' ? 'collapsed' : 'expanded';
  }
}






// import { Component, OnInit } from '@angular/core';
// import { Equipment } from '../model/equipment.model';
// import { Profile } from '../model/profile.model';
// import { Request } from '../model/request.model';
// import { HttpClient } from '@angular/common/http';
// import { AdministrationService } from '../administration.service';
// import { PagedResults } from 'src/app/shared/model/paged-results.model';
// import { Wallet } from '../model/wallet.model';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'xp-profile',
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.css']
// })
// export class ProfileComponent implements OnInit{
//   profile: Profile[] = [];
//   selectedProfile: Profile;
//   showProfileForm: boolean = false;
//   showPictureForm: boolean = false;
//   showMessage: boolean = false;
//   showProfilePictureForm: boolean = false;
//   showEditProfileForm: boolean = false;
//   wallet: Wallet;
//   formState: 'collapsed' | 'expanded' = 'collapsed';
//   shouldRender: boolean = false;
  
//   toggleEditProfileForm() {
//     this.showEditProfileForm = !this.showEditProfileForm;
//   }

//   toggleProfilePictureForm() {
//     this.showProfilePictureForm = !this.showProfilePictureForm;
//   }  
  
//   constructor(private service: AdministrationService , private router: Router) { }

//   ngOnInit(): void {
    
//     this.getByUserId();
//     this.delayedShowMessage();
//     this.getWalletByUserId();

//     console.log("SELECTED PROFILE U KLASI PROFIL");
//     console.log(this.selectedProfile);
//   }
  
//   delayedShowMessage() {
//     setTimeout(() => {
//       this.showMessage = true;
//     }, 1000);
//   }
  
//   getByUserId(): void {
//     this.service.getByUserId().subscribe({
//       next: (result: Profile) => {
//         console.log('Result from API:', result);
//         this.profile = [result]; // Wrap the result in an array, as it's a single Profile object
//         console.log('Profile data in component:', this.profile);
//         this.shouldRender = true;
//       },
//       error: (err: any) => {
//         console.log(err);
//       }
//     });
//   }

//   getWalletByUserId(): void {
//     this.service.getWalletByUserId().subscribe({
//       next: (result: Wallet) => {
//         console.log('Result from API:', result);
//         this.wallet = result; // Wrap the result in an array, as it's a single Profile object
//         console.log('Wallet:', this.wallet);
//       },
//       error: (err: any) => {
//         console.log("NE RADI");
//       }
//     });
//   }

//   onEditClicked(profile: Profile): void {
//     this.selectedProfile = profile;
//     this.router.navigate(['/profile-settings']);
//   }

//   onChangeClicked(profile: Profile): void {
//     this.selectedProfile = profile;
//     console.log(this.selectedProfile);
//     this.toggleProfilePictureForm();
//   }

//   onPurchaseReports(): void {
//     this.router.navigate(['/purchase-reports']);
//   }

//   toggleForm() {
//     this.formState = this.formState === 'expanded' ? 'collapsed' : 'expanded';
//   }
  
//   onSendRequestClick(): void {
//     // Hiding the button immediately
//   this.profile[0].requestSent = true;

//   const request: Request = {
//     id: 0,
//     profileId: this.profile[0].id,
//     status: 0
//   }

//   this.service.addRequest(request).subscribe({
//     next: (newRequest: Request) => {
//       alert('You have successfully sent a request to become an author!');
//       console.log(request);
//     },
//     error: (err: any) => {
//       console.error('Error while sending a request:', err);
//       // If an error occurs, revert the requestSent flag back to false to display the button again
//       this.profile[0].requestSent = false;
//     }
//   });

//     const profile: Profile = {
//       id: this.profile[0].id,
//       firstName: this.profile[0].firstName,
//       lastName: this.profile[0].lastName,
//       profilePicture: this.profile[0].profilePicture,
//       biography: this.profile[0].biography,
//       motto: this.profile[0].motto,
//       userId: this.profile[0].userId,
//       isActive: this.profile[0].isActive,
//       follows: this.profile[0].follows,
//       tourPreference: this.profile[0].tourPreference,
//       questionnaireDone: this.profile[0].questionnaireDone,
//       numberOfCompletedTours: this.profile[0].numberOfCompletedTours,
//       requestSent: true,
//       xp: this.profile[0].xp,
//       isFirstPurchased: this.profile[0].isFirstPurchased
//     }

//     this.service.updateProfile(profile).subscribe({
//       next: () => {
//         console.log(profile);
//       },
//       error: (err: any) => {
//         console.error('Error while updating profile:', err);
//       }
//     });
//   }
// }