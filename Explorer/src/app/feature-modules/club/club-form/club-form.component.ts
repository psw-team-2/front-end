import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Club } from '../model/club.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClubService } from '../club.service';

@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnChanges {
  @Output() clubUpdated = new EventEmitter<null>();
  @Input() club: Club;

  constructor(private service: ClubService) {
  }

  ngOnChanges(): void {
    this.clubForm.reset();
  }


  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
  });

  addClub(): void {
    const club: Club = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      imageUrl: this.clubForm.value.imageUrl || "",
      ownerId: 0,
      memberIds: [0]
    };
    console.log("sdfds");
    this.service.addClub(club).subscribe({
      next: () => { this.clubUpdated.emit() },

      error: (error) => {
        console.error('Error adding club:', error);
      }
    });
  }
}
