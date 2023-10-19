import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Club } from '../model/club.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClubService } from '../club.service';

@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnInit {
  @Output() clubUpdated = new EventEmitter<null>();
  @Input() club: Club;
  @Input() shouldEdit: boolean = false;
  constructor(private service: ClubService) {
  }

  ngOnInit(): void {

  }
  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
  });

  addClub(): void {
    const club: Club = {
      name: this.clubForm.value.name ||  "",
      description: this.clubForm.value.description || "",
      imageUrl: this.clubForm.value.imageUrl || "",
      ownerId: 0,
      memberIds: [0]
    };

    console.log(club)
    this.service.addClub(club).subscribe({
      next: () => { console.log("success") },

      error: (error) => {
        console.error('Error adding club:', error);
      }
    });
  }

  updateClub(): void {
    const club: Club = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageUrl: this.clubForm.value.imageUrl || "",
      ownerId: this.club.ownerId,
      memberIds: this.club.memberIds
    };
    club.id = this.club.id;
    console.log(club.name);
    console.log(club.description);
    console.log(club.imageUrl);
    console.log(club.ownerId);
    this.service.updateClub(club).subscribe({
      next: () => { this.clubUpdated.emit();}
    });
  }
}