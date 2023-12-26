import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Token } from '../model/token.model';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/feature-modules/administration/model/user-account.model';
import { AdministrationService } from 'src/app/feature-modules/administration/administration.service';

@Component({
  selector: 'xp-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {

  tokenExpired: boolean = false;
  value: string;
  token: Token;
  user: User;

  constructor(private route: ActivatedRoute, private service: AuthService, private administrationService: AdministrationService, private router: Router) { }

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.value = this.route.snapshot.paramMap.get('token') as string;

    this.service.getToken(this.value).subscribe({
      next: (result) => {
        this.token = result;
        const expirationTime = new Date(this.token.expirationTime);

        if (expirationTime <= new Date()) {
          this.tokenExpired = true;
        }

        this.administrationService.getUserAccountById(this.token.userId).subscribe({
          next: (result) => {
            this.user = result;
          }
        });
      }
    });
  }

  updatePassword(): void {
    this.user.password = this.passwordForm.value.password!;
    this.administrationService.updateUserAccount(this.user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
