import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Encounter } from '../model/encounter.model';
import { EncounterService } from '../encounter.service';
import { encounterStatus, encounterType } from '../model/encounter.model';

@Component({
  selector: 'xp-encounter-form',
  templateUrl: './encounter-form.component.html',
  styleUrls: ['./encounter-form.component.css']
})
export class EncounterFormComponent {
  router: any;

  constructor(private encounterService: EncounterService) {}

  encounterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    xp: new FormControl(0, [Validators.required]),
    status: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    mandatory: new FormControl('', [Validators.required]),
    peopleCount: new FormControl(0, [Validators.required]),
    range: new FormControl(0, [Validators.required]),
    image: new FormControl('', [Validators.required]),
  });

  addEncounter(): void {
    let status: number = -1;
    let type: number = -1;
  
    // Mapping status
    if (this.encounterForm.value.status === 'Active') {
      status = 0;
    } else if (this.encounterForm.value.status === 'Draft') {
      status = 1;
    } else if (this.encounterForm.value.status === 'Archived') {
      status = 2;
    }
  
    // Mapping type
    if (this.encounterForm.value.type === 'Social') {
      type = 0;
    } else if (this.encounterForm.value.type === 'Location') {
      type = 1;
    } else if (this.encounterForm.value.type === 'Misc') {
      type = 2;
    }
  
    const encounter: Encounter = {
      name: this.encounterForm.value.name || "",
      description: this.encounterForm.value.description || "",
      latitude: 0,
      longitude: 0,
      xp: this.encounterForm.value.xp || 0,
      status: status,
      type: type,
      mandatory: Boolean(this.encounterForm.value.mandatory),
      peopleCount: Number(this.encounterForm.value.peopleCount) || 0,
      range: Number(this.encounterForm.value.range) || 0,
      image: this.encounterForm.value.image || ""
    };
  
    console.log(encounter);
  
    if (this.encounterForm.valid) {
      this.encounterService.addEncounter(encounter).subscribe({
        next: () => {
          alert('You have successfully added an encounter.');
        },
      });
    }
  }
  
}
