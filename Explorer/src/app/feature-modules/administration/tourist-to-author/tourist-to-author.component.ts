import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Profile } from '../model/profile.model';
import { Request } from '../model/request.model';
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-tourist-to-author',
  templateUrl: './tourist-to-author.component.html',
  styleUrls: ['./tourist-to-author.component.css']
})
export class TouristToAuthorComponent {
  @Input() profile: Profile;

  constructor(private service: AdministrationService ) { }

  onSendRequestClick(): void {
    // Hiding the button immediately
  this.profile.requestSent = true;

  const request: Request = {
    id: 0,
    profileId: this.profile.id,
    status: 0
  }

  this.service.addRequest(request).subscribe({
    next: (newRequest: Request) => {
      //alert('You have successfully sent a request to become an author!');
      console.log(request);
    },
    error: (err: any) => {
      console.error('Error while sending a request:', err);
      this.profile.requestSent = false;
    }
  });
}
}
