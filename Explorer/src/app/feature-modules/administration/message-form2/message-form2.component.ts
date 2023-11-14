import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from '../model/message.model';
import { Profile } from '../model/profile.model';
import { AdministrationModule } from '../administration.module';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-message-form2',
  templateUrl: './message-form2.component.html',
  styleUrls: ['./message-form2.component.css']
})
export class MessageForm2Component {
  @Input() selectedFollower: Profile | null = null;

  loggedInProfile: Profile | null = null;
  profiles: Profile[];

  constructor(private service: AdministrationService) {}

  messageForm = new FormGroup({
    messageContent: new FormControl('', [Validators.required]),
  });

  sendMessage(): void {
    this.service.getByUserId2().subscribe({
      next: (loggedInProfile: Profile) => {
        this.loggedInProfile = loggedInProfile;

        // Get all profiles
        this.service.getProfiles2().subscribe({
          next: (result: PagedResults<Profile>) => {
            // Filter out the currently logged-in profile
            this.profiles = result.results.filter((profile) => profile.id !== loggedInProfile.id);
          },
          error: (err: any) => {
            console.log(err);
          }
        });



      if (this.messageForm.valid && this.selectedFollower) {
      const message: Message = {
        id: 0,
        senderId: this.loggedInProfile.id || 0,
        receiverId: this.selectedFollower.id || 0,
        messageContent: this.messageForm.value.messageContent || "",
        status: 0,
      };

      this.service.addMessage2(message).subscribe({
        next: (newMessage: Message) => {
          alert(`You have successfully sent a message.`);
          console.log(message);
        },
        error: (err: any) => {
          console.error('Error while sending a message:', err);
        }
      });
    }
      }
    });
  }
}
