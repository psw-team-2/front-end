import { Component, OnInit } from '@angular/core';
import { Profile } from '../model/profile.model';
import { Message } from '../model/message.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  loggedInProfile: Profile | null = null;
  messages: Message[] = [];
  profiles: Profile[];

  constructor(private service: AdministrationService) {}

  ngOnInit(): void {
    // Get the currently logged-in user's profile
    this.service.getByUserId().subscribe({
      next: (loggedInProfile: Profile) => {
        this.loggedInProfile = loggedInProfile;

        // Get all profiles
        this.service.getProfiles().subscribe({
          next: (result: PagedResults<Profile>) => {
            // Filter out the currently logged-in profile
            this.profiles = result.results.filter((profile) => profile.id !== loggedInProfile.id);
          },
          error: (err: any) => {
            console.log(err);
          }
        });

        // Get follows after getting the logged-in user's profile
      this.service.getAllUnreadMessages(this.loggedInProfile).subscribe({
        next: (result: PagedResults<Message>) => {
          this.messages = result.results;
        },
        error: (err: any) => {
          console.error('Error while getting messages:', err);
        }
      });
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
