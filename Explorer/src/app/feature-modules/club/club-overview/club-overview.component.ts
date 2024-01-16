import { Component, NgZone, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { ClubRequest } from '../model/club-request.model';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Observable, catchError, concatMap, forkJoin, map, of } from 'rxjs';
import { Profile } from '../../administration/model/profile.model';
import { AdministrationService } from '../../administration/administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubMessage } from '../model/club-message.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClubMessageWihtUser } from '../model/club-message-with-user';
import { UserRole } from '../../administration/model/user-account.model';

@Component({
  selector: 'xp-club-overview',
  templateUrl: './club-overview.component.html',
  styleUrls: ['./club-overview.component.css']
})
export class ClubOverviewComponent {

  constructor(private route: ActivatedRoute, private service: ClubService, private authService: AuthService,private adminService: AdministrationService, private zone: NgZone ) { }

  clubId: number;
  club: Club;
  isOwner: boolean;
  user: User | undefined;
  allMemberIds: number[] = [];
  nonMemberIds: number[] = [];
  nonMemberUsernames: string[] = [];
  
  mappedMembers: { [key: number]: string } = {};
  mappedNonMembers: { [key: number]: string } = {};
  
  allMembersProfiles: Profile[]=[];
  nonMembersProfiles: Profile[]=[];

  clubMessages: ClubMessage[] = [];
  senderProfiles: { [senderId: number]: Profile } = {};

  newClubMessage : ClubMessage;
  newMessageText : '';
  messageTime : Date;

  userIsMember: boolean = false;
  requestMessage: string = '';
  private timeoutId: any;

  ngOnInit(): void {
    this.clubId = Number(this.route.snapshot.paramMap.get('id'));
    this.getClub(this.clubId);
    this.getClubMessages(this.clubId);

    this.authService.user$.subscribe(user => {
      this.user = user;
      this.clubId = Number(this.route.snapshot.paramMap.get('id'));

    });
    
  }

  clubMessageForm = new FormGroup({
    newMessageText: new FormControl('', [Validators.required]),
  });

  
  

  addClubMessage() : void {
         //this.newClubMessage = clubMessage;
         this.messageTime = new Date();
    
        if (this.user) {
          const clubMessage : ClubMessage = {
            id: undefined,
            userId: this.user.id,
            clubId: this.clubId,
            time: this.messageTime,
            text: this.clubMessageForm.value.newMessageText || '',
          };

          
    
          this.service.addClubMessage(clubMessage).subscribe({
            next: () => {
              console.log("Club message successfully sent!");
              console.log(clubMessage.text);
              this.getClubMessages(this.clubId);
              this.clubMessageForm.reset();
            }
          });
        }
      }
    

  getClubMessages(clubId: number) : void {
    this.service.getClubMessages(clubId).subscribe({
      next: (result: PagedResults<ClubMessage>) => {
        //@ts-ignore
        this.clubMessages = result.results;
        console.log(this.clubMessages);

        for(let message of this.clubMessages) {
          this.adminService.getByProfileUserId(message.userId).subscribe({
            next: (profile: Profile) => {
              this.senderProfiles[message.userId] = profile;
            },
            error: (err: any) => {
              console.error('Error while getting profile for sender:', err);
            }
        });
      }
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
        
      if (this.club.memberIds.includes(this.user?.id!)) {
        this.userIsMember = true;
        console.log('true');
      }

        this.authService.getAllUserIds().subscribe(response => {
          const userIds = Object.values(response);
          for (const userId of userIds) {
            this.allMemberIds.push(userId);
          }
          for (let userId of this.allMemberIds) {
            if (this.club.memberIds.indexOf(userId) === -1) {
              this.nonMemberIds.push(userId);
              this.adminService.getUserAccountById(userId).subscribe({
                next: (retval) => {
                  if (retval.role === UserRole.Administrator) {
                    const indexToRemove = this.nonMemberIds.indexOf(userId);
                    if (indexToRemove !== -1) {
                        this.nonMemberIds.splice(indexToRemove, 1);
                    }
                  }
                }
              });
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

  mapUsernames(): void {
        this.club.memberIds.forEach(response => {
          this.getMappedUsername(response).subscribe(
            (username: string) => {
              this.mappedMembers[response] = username;
            },
            (error: any) => {
              console.error(error);
            }
          );
        });
    
        this.nonMemberIds.forEach(response => {
          this.getMappedUsername(response).subscribe(
            (username: string) => {
              this.mappedNonMembers[response] = username;
            },
            (error: any) => {
              console.error(error);
            }
          );
        });
      }
    
      getMappedUsername(userId: number): Observable<string> {
        return this.authService.getUsername(userId).pipe(
            map((userData: any) => {
                if (userData && userData.username) {
                    return userData.username;
                } else {
                    return 'Unknown';
                }
            }),
            catchError(error => {
                console.error('Error fetching username:', error);
                return of('Unknown');
            })
        );
      }

      joinClub() {
        // Your logic to join the club goes here
        // For example, you might send a request to a server, and upon success, set the message
        this.requestMessage = 'Join request sent!';

        let request: ClubRequest = {
          id: undefined, 
          clubId: this.club.id || undefined,
          accountId: this.user?.id!,
          requestStatus: 0,
          requestType: 1
        }

        this.service.sendRequest(request).subscribe({
          next: (retval) => {
            
          }
        });
    
        // Show the message and set a timeout to hide it after 5 seconds
        this.showRequestMessage();
        this.timeoutId = setTimeout(() => {
          this.hideRequestMessage();
        }, 4000);
      }
    
      private showRequestMessage() {
        this.zone.run(() => {
          this.requestMessage = 'Join request sent!';
          // Add the 'show-message' class to trigger the CSS animation
          setTimeout(() => {
            this.requestMessage = 'Join request sent!';
          }, 0);
        });
      }
    
      private hideRequestMessage() {
        this.zone.run(() => {
          // Remove the 'show-message' class to hide the message
          this.requestMessage = '';
          clearTimeout(this.timeoutId);
        });
      }
    
}