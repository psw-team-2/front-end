import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Club } from '../model/club.model';
import { ClubService } from '../club.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnChanges {

  @Output() clubUpdated = new EventEmitter<null>();
  @Input() club: Club;
  @Input() shouldEdit: boolean = false;

  user: User | undefined;
  memberIds: number[] = [];

  constructor(private service: ClubService, private authService: AuthService){}

  ngOnChanges(): void {
    this.clubForm.reset();
    if(this.shouldEdit) {
      this.clubForm.patchValue(this.club);
    }

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  // ngOnInit(): void {
  //   this.authService.user$.subscribe(user => {
  //     this.user = user;
  //   });
  // }

  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
    // ownerId: new FormControl('', [Validators.required]),
    // memberIds: new FormControl('', [Validators.required]),
  });

  addClub(): void{
    const club: Club = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageUrl: this.clubForm.value.name || "",
      ownerId : this.user?.id || 0,
      memberIds : [],
    };
    this.service.addClub(club).subscribe({
      next: () => { this.clubUpdated.emit() }
    });
  }

  updateClub(): void{
    const club: Club = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageUrl: this.clubForm.value.name || "",
      ownerId : this.user?.id || 0,
      memberIds : [],
    }
    club.id = this.club.id;
    this.service.updateClub(club).subscribe({
      next: () => { this.clubUpdated.emit();}
    });
  }
}
