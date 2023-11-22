import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { ClubRequest } from '../model/club-request.model';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Observable, catchError, concatMap, forkJoin, map, of } from 'rxjs';
import { Profile } from '../../administration/model/profile.model';
import { AdministrationService } from '../../administration/administration.service';

@Component({
  selector: 'xp-club-overview',
  templateUrl: './club-overview.component.html',
  styleUrls: ['./club-overview.component.css']
})
export class ClubOverviewComponent {

  constructor(private route: ActivatedRoute, private service: ClubService, private authService: AuthService,private adminService: AdministrationService ) { }

  clubId: number;
  club: Club;
  isOwner: boolean;
  user: User | undefined;
  allMemberIds: number[] = [];
  nonMemberIds: number[] = [];
  nonMemberUsernames: string[] = [];

  mappedMembers: { [key: number]: string } = {};
  mappedNonMembers: { [key: number]: string } = {};

  ngOnInit(): void {
    this.clubId = Number(this.route.snapshot.paramMap.get('id'));
    this.getClub(this.clubId);

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    
  }

  getClub(clubId: number): void {
    this.service.getClubById(clubId).subscribe({
      next: (result: Club) => {
        this.club = result;
        if (this.user && this.user.id === this.club.ownerId) {
          this.isOwner = true;
        } else {
          this.isOwner = false;
        }

        this.authService.getAllUserIds().subscribe(response => {
          const userIds = Object.values(response);
          for (const userId of userIds) {
            this.allMemberIds.push(userId);
          }
          for (let userId of this.allMemberIds) {
            if (this.club.memberIds.indexOf(userId) === -1) {
              this.nonMemberIds.push(userId);
            }
          }
          for (let i = 0; i < this.nonMemberIds.length; i++) {
            const currentValue = this.nonMemberIds[i];
            this.authService.getUsername(currentValue).subscribe((response: object) => {
              const username = response as { username: string, password: string};
              this.nonMemberUsernames.push(username.username);
            });
          }
          this.mapUsernames();
        });

        for (let i = 0; i < this.club.memberIds.length; i++) {
          const currentValue = this.club.memberIds[i];
          this.authService.getUsername(currentValue).subscribe((response: object) => {
            const username = response as { username: string, password: string };
            this.memberUsernames.push(username.username);
          });
        }
      },
      error: () => {
      }
    })
  }

  kickMember(memberId: number | undefined) {
    if (memberId === undefined) {
      console.error('Member ID is undefined');
      return;
    }
    this.club.memberIds = this.club.memberIds.filter(id => id !== memberId);
    this.service.updateClub(this.club).subscribe({
      next: () => {}
    });
  }

  inviteMember(nonMemberId: number| undefined) {
    if (nonMemberId === undefined) {
      console.error('Non-member ID is undefined');
      return;
    }
    this.nonMemberIds = this.nonMemberIds.filter(id => id !== nonMemberId);
    
    let clubId = this.clubId;
    let ownerId = this.club.ownerId;

    const request: ClubRequest = {
      clubId: clubId,
      accountId: nonMemberId,
      requestStatus: 0,
      requestType: 0
    } 

    this.service.inviteMember(request).subscribe({
      next: () => {}
    });
  }
}
