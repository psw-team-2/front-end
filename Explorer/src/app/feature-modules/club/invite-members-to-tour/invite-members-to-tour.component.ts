import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { ActivatedRoute } from '@angular/router';
import { Club } from '../model/club.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { AdministrationService } from '../../administration/administration.service';
import { Message } from '../../administration/model/message.model';


@Component({
  selector: 'xp-invite-members-to-tour',
  templateUrl: './invite-members-to-tour.component.html',
  styleUrls: ['./invite-members-to-tour.component.css']
})

export class InviteMembersToTourComponent implements OnInit{
  clubId: number;
  clubMembers: number[] = [];
  invitedMemberIds: number[] = [];
  user: User | undefined;
  senderId: number;
  tourId: number;
  club: Club;
  tour: Tour;

  constructor(private clubService: ClubService, private route: ActivatedRoute, private authService: AuthService, private tourService: TourAuthoringService, private administrationService: AdministrationService ) {}

  ngOnInit(): void {
    this.clubId = Number(this.route.snapshot.paramMap.get('clubId'));

    this.clubService.getAllMembers(this.clubId).subscribe((members) => {
      this.clubMembers = members;
    });

    this.clubService.getClubById(this.clubId).subscribe((club) => {
      this.club = club;
    });

    this.authService.user$.subscribe(user => {
      this.user = user;
      this.senderId = user.id;
    });

  }

  toggleMember(memberId: number): void {
    if (this.invitedMemberIds.includes(memberId)) {
      this.invitedMemberIds = this.invitedMemberIds.filter(id => id !== memberId);
    } else {
      this.invitedMemberIds.push(memberId);
    }
  }

  getTourById(): void {
    if (this.tourId) {
      this.tourService.getTour(this.tourId).subscribe(
        (tour) => {
          this.tour = tour;
        },
        (error) => {
          console.error('Tour not found:', error);
        }
      );
    }
  }

  inviteMembersToTour(): void {
    if (!this.club.memberIds.includes(this.senderId)) {
      console.error('Sender is not a member of the club.');
      return;
    }
    if (this.senderId !== this.tour.authorId) {
      console.error("Sender didn't start this tour.");
      return;
    }

    this.clubService.inviteMembersToTour(this.clubId, this.senderId, this.tourId, this.invitedMemberIds)
      .subscribe(
        result => {
          console.log('Response from server:', result);

          if (result) 
            console.log('Members successfully invited to tour.');
            this.sendInvitations(this.invitedMemberIds, this.senderId, this.tour);
        },
        error => {
          console.error('Error during invit members to tour:', error);
        }
      );
  }

  sendInvitations(memberIds: number[], senderId: number, tour: Tour): void {
    for (const memberId of memberIds) {
      const message: Message = {
        id: 0,
        senderId: senderId,
        receiverId: memberId,
        messageContent: `You are invited to join the tour ${tour.name}.`,
        status: 0
      };

      this.administrationService.addMessage(message).subscribe(
        () => console.log(`Notification sent to user ${memberId}.`),
        (error) => console.error('Error sending notification:', error)
      );
    }
  }

}