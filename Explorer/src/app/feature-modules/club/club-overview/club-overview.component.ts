import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'xp-club-overview',
  templateUrl: './club-overview.component.html',
  styleUrls: ['./club-overview.component.css']
})
export class ClubOverviewComponent {

  constructor(private route: ActivatedRoute, private service: ClubService, private authService: AuthService) { }

  clubId: number;
  club: Club;
  isOwner: boolean;
  user: User | undefined;
  memberUsernames: string[] = [];

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

        this.memberUsernames = [];

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

  kickMember(memberId: number) {
    this.club.memberIds = this.club.memberIds.filter(id => id !== memberId);
    this.service.updateClub(this.club).subscribe({
      next: () => {}
    });
}
}
