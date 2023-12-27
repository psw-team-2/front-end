import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Token } from '../model/token.model';
import { TokenStorage } from '../jwt/token.service';

@Component({
  selector: 'xp-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  passwordRecoveryForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });

  sendToken() {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 24);

    const token: Token = {
      userId: 0,
      value: this.generateRandomString(),
      expirationTime: expirationTime,
    }
    if (this.passwordRecoveryForm.valid) {
      this.authService.getUserByEmail(this.passwordRecoveryForm.value.email!).subscribe({
        next: (result) => {
          token.userId = result.id;
          this.authService.createToken(token, this.passwordRecoveryForm.value.email!).subscribe({
            next: () => {
              this.router.navigate(['/login']);
            },
          });
        }
      });
    }
  }

  generateRandomString(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
}
