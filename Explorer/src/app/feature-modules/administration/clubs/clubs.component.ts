import { Component, OnInit } from '@angular/core';
import { Club } from '../../club/model/club.model';
import { Profile } from '../model/profile.model';
import { AdministrationService } from '../administration.service';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ClubService } from '../../club/club.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements OnInit{
  loggedInProfile: Profile | null = null;
  clubs: Club[] = [];
  selectedClub: Club | null = null; 
  hasClubs: Boolean = false;

  constructor(private service: AdministrationService, private clubService: ClubService, private router: Router) {}

  ngOnInit(): void {
    this.getLoggedInProfile();
    this.getClubsByUserId();
    
  }

  
  private getLoggedInProfile(): void {
    this.service.getByUserId().subscribe({
      next: (loggedInProfile: Profile) => {
        this.loggedInProfile = loggedInProfile;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getClubsByUserId(): void {
    this.service.getByUserId().subscribe({
      next: (profileResult: Profile) => {
        const memberId = profileResult?.id;
  
        if (memberId === undefined) {
          return;
        }

        this.clubService.getClubs().subscribe({
          next: (result: PagedResults<Club>) => {
            this.clubs = result.results.filter(club =>
              club.memberIds.includes(memberId)
            );
            console.log("KLUBOVI");
            console.log(this.clubs);

            if(this.clubs.length==0){
              this.hasClubs=true;
            }
            
          },
        });
      },
    });
  }

  seeClub(individualClub: Club): void{
    this.selectedClub = individualClub;
  }
  


}
