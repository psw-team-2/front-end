import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdministrationService } from '../../administration.service';
import { User } from '../../model/user-account.model';

@Component({
  selector: 'xp-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent {
  token: string;
  user: User;
  constructor(private route: ActivatedRoute, private service : AdministrationService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'];

      // Call the getUserAccountByToken method and subscribe to the Observable
      this.service.getUserAccountByToken(this.token).subscribe(
        (user: User) => {
          // Modify the isActive property
          user.isActive = true;
          console.log("BRUHHH", user);

          // Call the updateUserAccount method to save changes
          this.service.updateUser(user).subscribe(
            updatedUser => {
              // Handle the updated user data as needed
              console.log('User updated:', updatedUser);
            },
            error => {
              // Handle errors during the update
              console.error('Error updating user:', error);
            }
          );
        },
        error => {
          // Handle errors fetching the user
          console.error('Error fetching user:', error);
        }
      );
    });
  }
}
