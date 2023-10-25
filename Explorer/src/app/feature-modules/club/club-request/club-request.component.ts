import { Component, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubRequest } from '../model/club-request.model';
import { ClubRequestService } from '../club-request.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Club } from '../model/club.model';
import { ClubService } from '../club.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-club-request',
  templateUrl: './club-request.component.html',
  styleUrls: ['./club-request.component.css']
})
export class ClubRequestComponent implements OnInit {

  clubRequest: ClubRequest[] = [];
  selectedRequest: ClubRequest;
  clubs: Club[] = [];
  currentUser: User;

  constructor(private service: ClubRequestService, private authService: AuthService, private clubService: ClubService) {}

  ngOnInit(): void {
    this.getClubRequests();
    this.getClubs();

    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });
  }  
  
  getClubRequests(): void {
    this.service.getClubRequests().subscribe({
      next: (result: PagedResults<ClubRequest>) => {
        this.clubRequest = result.results;
      },
      error: () => {
      }
    })
  }

  onWithdrawRequestClicked(id: number): void {
    this.service.withdrawRequest(id).subscribe({
      next: () => {
        console.log("The request for joining the club has been successfully withdraw!");
        this.getClubRequests();
      },
      error: () => {
      } 
    })
  }

  getMappedRequestStatus(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Accepted';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  }
  
  getMappedRequestType(type: number): string {
    switch (type) {
      case 0: return 'Invitation';
      case 1: return 'Request';
      default: return 'Unknown';
    }
  }

  getClubs(): void {
    this.clubService.getClubs().subscribe((result) => {
      this.clubs = result.results;
    });
  }

  getMappedClubName(clubId?: number): string {
    const club = this.clubs. find(c => c.id === clubId);
    return club ? club.name : 'Unknown';
  }

  onAcceptRequestClicked(clubRequest: ClubRequest): void {
    this.selectedRequest = clubRequest;
    const club = this.clubs.find(c => c.id === clubRequest.clubId);

    if (club && this.currentUser && this.currentUser.id === club.ownerId) {
      this.selectedRequest.requestStatus = 1;

      this.service.acceptRequest(clubRequest).subscribe({
        next: () => {
           console.log("Your request to join the club has been accepted!")
           this.getClubRequests();
        },
        error: () => {}
      });

      club.memberIds.push(this.selectedRequest.accountId);
      this.clubService.updateClub(club).subscribe({
        next: () => {
          console.log('New member added to the club!')
          this.getClubs();
        },
        error: () => {}
      });
      
    }
  }

  onRejectRequestClicked(clubRequest: ClubRequest): void {
    this.selectedRequest = clubRequest;
    const club = this.clubs.find(c => c.id === clubRequest.clubId);

    if (club && this.currentUser && this.currentUser.id === club.ownerId) {
      this.selectedRequest.requestStatus = 2;

      this.service.rejectRequest(clubRequest).subscribe({
        next: () => {
           console.log("Your request to join the club has been rejected!")
           this.getClubRequests();
        },
        error: () => {}
      });
    }
  }

  onAcceptInvitationClicked(clubRequest: ClubRequest): void {
    this.selectedRequest = clubRequest;
    const club = this.clubs.find(c => c.id === clubRequest.clubId);

    if (club && this.currentUser) {
      this.selectedRequest.requestStatus = 1;

      this.service.acceptRequest(clubRequest).subscribe({
        next: () => {
           this.getClubRequests();
        },
        error: () => {}
      });

      club.memberIds.push(this.selectedRequest.accountId);
      this.clubService.updateClub(club).subscribe({
        next: () => {
          this.getClubs();
        },
        error: () => {}
      });
      
    }
  }

  onRejectInvitationClicked(clubRequest: ClubRequest): void {
    this.selectedRequest = clubRequest;
    const club = this.clubs.find(c => c.id === clubRequest.clubId);

    if (club && this.currentUser) {
      this.selectedRequest.requestStatus = 2;

      this.service.rejectRequest(clubRequest).subscribe({
        next: () => {
           this.getClubRequests();
        },
        error: () => {}
      });
    }
  }
}