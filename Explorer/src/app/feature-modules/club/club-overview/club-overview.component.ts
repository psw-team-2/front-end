import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { ClubRequest } from '../model/club-request.model';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ClubMessage } from '../model/club-message.model';
import { Observable, catchError, concatMap, forkJoin, map, of, timestamp } from 'rxjs';
import { Profile } from '../../administration/model/profile.model';
import { AdministrationService } from '../../administration/administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

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
  
  
  allMembersProfiles: Profile[]=[];
  nonMembersProfiles: Profile[]=[];

  clubMessages: ClubMessage[] = [];
  newClubMessage : ClubMessage;
  messageTime : Date;

  ngOnInit(): void {
    this.clubId = Number(this.route.snapshot.paramMap.get('id'));
    this.getClub(this.clubId);
    this.getClubMessages(this.clubId)

    this.authService.user$.subscribe(user => {
      this.user = user;
    });


  }

  addClubMessage() : void {
    //this.newClubMessage = clubMessage;
    this.messageTime = new Date();

    if (this.user) {
      const clubMessage : ClubMessage = {
        id: undefined,
        userId: this.user.id,
        clubId: this.clubId,
        time: this.messageTime,
        text: "test proba",
      };

      this.service.addClubMessage(clubMessage).subscribe({
        next: () => {
          console.log("Club message successfully sent!");
          console.log(clubMessage.text);
        }
      });
    }
  }

  getClubMessages(clubId: number) : void {
    this.service.getClubMessages(clubId).subscribe({
      next: (result: PagedResults<ClubMessage>) => {
        //@ts-ignore
        this.clubMessages = result;
        console.log(this.clubMessages);
      }
    })
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
          this.nonMemberIds = this.nonMemberIds.filter(id => !this.club.memberIds.includes(id));
          this.adminService.getProfiles().subscribe((profilesResult: PagedResults<Profile>) => {
            const allProfiles: Profile[] = profilesResult.results;
            this.allMembersProfiles = allProfiles.filter(profile => this.club.memberIds.includes(profile.userId as number));
            this.nonMembersProfiles = allProfiles.filter(profile => this.nonMemberIds.includes(profile.userId as number));
          });
        });

        
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
