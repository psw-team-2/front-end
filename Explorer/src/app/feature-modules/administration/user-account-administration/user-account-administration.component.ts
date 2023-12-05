import { Component, OnInit } from '@angular/core';
import { User } from '../model/user-account.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Wallet } from '../model/wallet.model';

@Component({
  selector: 'xp-user-account-administration',
  templateUrl: './user-account-administration.component.html',
  styleUrls: ['./user-account-administration.component.css']
})
export class UserAccountAdministrationComponent implements OnInit {
  userAccounts: User[] = [];
  selectedUserAccount: User;

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getUserAccounts();
  }

  getUserAccounts(): void {
    this.service.getUserAccounts().subscribe({
      next: (result: PagedResults<User>) => {
        console.log(result);
        this.userAccounts = result.results;
      },
      error: () => {
        console.error();
      }
    });
  }

  

  deactivateUser(user: User): void {
    if (user.role !== 0 && user.isActive) {
      user.isActive= false;
      this.service.deactivateUserAccount(user).subscribe({
        next: (deactivatedUser: User) => {
          const index = this.userAccounts.findIndex(u => u.id === deactivatedUser.id);
          if (index !== -1) {
            this.userAccounts[index] = deactivatedUser;
          }
        },
        error: (error) => {
          console.error('Error deactivating user:', error);
        }
      });
    }
  }

  
}
