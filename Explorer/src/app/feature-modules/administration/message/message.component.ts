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
  senderProfiles: { [senderId: number]: Profile } = {}; //dodato
  isChatOpen = false;

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  closeChat() {
    this.isChatOpen = false;
  }

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

          // Fetch profiles for each sender
          for (const message of this.messages) {
            this.service.getById(message).subscribe({
              next: (profile: Profile) => {
                this.senderProfiles[message.senderId] = profile;
              },
              error: (err: any) => {
                console.error('Error while getting profile for sender:', err);
              }
            });
          }
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

  updateMessage(message: Message) {
    message.status = 1;
  
    this.service.updateMessage(message).subscribe({
      next: (_) => {
        console.log('Update successful');
        window.location.reload(); // Reload the page
      },
      error: (error) => {
        console.error('Error updating message:', error);
      }
    });
  }
  
}
