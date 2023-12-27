import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile } from '../../administration/model/profile.model';
import { AdministrationService } from '../../administration/administration.service';

@Component({
  selector: 'xp-start-your-journey',
  templateUrl: './start-your-journey.component.html',
  styleUrls: ['./start-your-journey.component.css']
})
export class StartYourJourneyComponent {
  profile: Profile[] = [];
  currentProfile: string
 
  
  constructor(private service: AdministrationService , private router: Router) { }

  ngOnInit(): void {
    
    this.getByUserId();

  }
  getByUserId(): void {
    this.service.getByUserId().subscribe({
      next: (result: Profile) => {
        console.log('Result from API:', result);
        this.profile = [result]; // Wrap the result in an array, as it's a single Profile object
        console.log('Profile data in component:', this.profile);
        this.currentProfile= this.profile[0].firstName;
        this.currentProfile = this.profile[0].firstName.toUpperCase();

      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
