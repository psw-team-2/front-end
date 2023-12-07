import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Wallet } from '../model/wallet.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-ac-form',
  templateUrl: './ac-form.component.html',
  styleUrls: ['./ac-form.component.css']
})
export class AcFormComponent {

  @Output() walletUpdated = new EventEmitter<null>();
  @Input() wallet: Wallet;
  userId = this.authService.user$.value.id;
  username = this.authService.user$.value.username;

  constructor(private service: AdministrationService, private authService: AuthService) { }

  acForm = new FormGroup({
    ac: new FormControl('', [Validators.required])
  });

  addAC(): void {
    const wallet: Wallet = {
      id: this.wallet.id,
      userId: this.wallet.userId,
      username: this.wallet.username,
      ac: Number(this.acForm.value.ac) || 0,
    };
    this.service.addAC(wallet).subscribe({
      next: () => { this.walletUpdated.emit() }
    });
  }

}
