import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Club } from '../../club/model/club.model';
import { Profile } from '../model/profile.model';
import { AdministrationService } from '../administration.service';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ClubService } from '../../club/club.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-app-user-clubs',
  templateUrl: './app-user-clubs.component.html',
  styleUrls: ['./app-user-clubs.component.css']
})
export class AppUserClubsComponent {
  @Input() selectedProfile: Profile;
  clubs: Club[] = [];
  selectedClub: Club | null = null; 
  hasClubs: Boolean = false;

  constructor(private service: AdministrationService, private clubService: ClubService, private router: Router) {}

  ngOnInit(): void {
    if (this.selectedProfile === undefined){
      console.log("No one is logged in.")
    }
    const profId=this.selectedProfile.userId || -1;
    this.clubService.getClubs().subscribe({
      next: (result: PagedResults<Club>) => {
        this.clubs = result.results.filter(club =>
          club.memberIds.includes(profId)
        );
        console.log("KLUBOVI");
        console.log(this.clubs);
        if(this.clubs.length==0){
          this.hasClubs=true;
        }
      },
    });
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProfile'] && !changes['selectedProfile'].firstChange) {
      this.updateClubs();
    }
  }

  private updateClubs(): void {
    if (!this.selectedProfile) {
      console.log("No one is logged in.");
      return;
    }

    const profId = this.selectedProfile.userId || -1;
    this.clubService.getClubs().subscribe({
      next: (result: PagedResults<Club>) => {
        this.clubs = result.results.filter(club =>
          club.memberIds.includes(profId)
        );
        console.log("KLUBOVI");
        console.log(this.clubs);

      },
    });
  }

  seeClub(individualClub: Club): void{
    this.selectedClub = individualClub;
  }
}
