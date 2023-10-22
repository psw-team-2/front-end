import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubRequest } from '../model/club-request.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.css']
})
export class ClubListComponent implements OnInit {

  clubs: Club[] = [];
  selectedClub: Club;
  shouldEdit: boolean = false;
  shouldRenderClubForm: boolean = false;
  currentUser: User; 
  
  constructor(private service: ClubService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getClubs();

    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
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

  deleteClub(id: number): void {
    this.service.deleteClub(id).subscribe({
      next: () => {
        this.getClubs();
      },
    })
  }

  onEditClicked(club: Club): void {
    this.selectedClub = club;
    this.shouldEdit = true;
    this.shouldRenderClubForm = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderClubForm = true;
  }

  onSendRequestClicked(): void {
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