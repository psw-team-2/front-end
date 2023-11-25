import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubRequest } from '../model/club-request.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'xp-clubs-overview',
  templateUrl: './clubs-overview.component.html',
  styleUrls: ['./clubs-overview.component.css']
})
export class ClubsOverviewComponent implements OnInit {
  clubs: Club[] = [];
  selectedClub: Club;
  shouldRenderClubForm: boolean = false;
  shouldEdit: boolean = false;
  currentUser: User;

  constructor(private service: ClubService, private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
    this.getClubs();

    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  deleteClub(id: number): void {
    this.service.deleteClub(id).subscribe({
      next: () => {
        this.getClubs();
      },
    })
  }

  getClubs(): void {
    this.service.getClubs().subscribe({
      next: (result: PagedResults<Club>) => {
        this.clubs = result.results;
      },
      error: () => {
      }
    })
  }

  onEditClicked(club: Club): void {
    this.selectedClub = club;
    this.shouldRenderClubForm = !this.shouldRenderClubForm;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderClubForm = !this.shouldRenderClubForm;
  }

  viewClub(club: Club): void {
    this.selectedClub = club;
  }

  onSendRequestClicked(club: Club): void {
    this.selectedClub = club;
    if (this.currentUser && this.currentUser.role === 'tourist') {
      const clubRequest: ClubRequest = {
        id: undefined, 
        clubId: this.selectedClub.id || undefined,
        accountId: this.currentUser.id,
        requestStatus: 0,
        requestType: 1
      };
  
      this.service.sendRequest(clubRequest).subscribe({
        next: () => {
           console.log("The request for joining the club has been successfully sent!")
        },
        error: () => {}
      });
    }
  }
}
