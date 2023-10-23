import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { Profile } from '../model/profile.model';
import { HttpClient } from '@angular/common/http';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-profile2',
  templateUrl: './profile2.component.html',
  styleUrls: ['./profile2.component.css']
})
export class Profile2Component implements OnInit{
  profile: Profile[] = [];
  selectedProfile: Profile;
  showProfileForm: boolean = false;
  showPictureForm: boolean = false;

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getByUserId();
  }

  getByUserId(): void {
    this.service.getByUserId2().subscribe({
      next: (result: Profile) => {
        console.log('Result from API:', result);
        this.profile = [result]; // Wrap the result in an array, as it's a single Profile object
        console.log('Profile data in component:', this.profile);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onEditClicked(profile: Profile): void {
    this.selectedProfile = profile;
    console.log(this.selectedProfile);
    this.showProfileForm = true;
    this.showPictureForm = false;
  }

  onChangeClicked(profile: Profile): void {
    this.selectedProfile = profile;
    console.log(this.selectedProfile);
    this.showProfileForm = false;
    this.showPictureForm = true;
  }
}
