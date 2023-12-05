import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Encounter } from '../model/encounter.model';
import { EncounterService } from '../encounter.service';
import { encounterStatus, encounterType } from '../model/encounter.model';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';

@Component({
  selector: 'xp-encounter-form',
  templateUrl: './encounter-form.component.html',
  styleUrls: ['./encounter-form.component.css']
})
export class EncounterFormComponent {
  @Input() checkpoint: Checkpoint | null = null;
  currentFile: File | null;

  showPeopleCount = false;
  showRange = false;
  showImage = false;

  constructor(private encounterService: EncounterService) {}

  ngOnInit() {
    this.encounterForm.get('type')?.valueChanges.subscribe((value) => {
      if (value) {
        this.handleEncounterType(value);
      }
    });
  }

  handleEncounterType(type: string) {
    this.showPeopleCount = type === 'Social';
    this.showRange = type !== 'Misc';
    this.showImage = type === 'Location';
  }

  encounterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    xp: new FormControl(0, [Validators.required]),
    status: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    mandatory: new FormControl(false),
    peopleCount: new FormControl(0),
    range: new FormControl(0),
    image: new FormControl(''),
  });

  addEncounter(): void {
    if (this.currentFile != null) {
      this.encounterService.upload(this.currentFile).subscribe({
        next: (value) => {
          
        },
        error: (value) => {
  
        }, complete: () => {
          
        },
      });
    }

    

    const status = this.encounterForm.value.status ?? ''; // Handle potential null or undefined
    const type = this.encounterForm.value.type ?? ''; // Handle potential null or undefined
  
    const imageValue = this.showImage && this.currentFile ? 'https://localhost:44333/Images/' + this.currentFile?.name || '' : '';
    

    const encounter: Encounter = {
      id: 0,
      name: this.encounterForm.value.name || "",
      description: this.encounterForm.value.description || "",
      latitude: this.checkpoint?.latitude || 0,
      longitude: this.checkpoint?.longitude || 0,
      xp: this.encounterForm.value.xp || 0,
      status: this.getStatusValue(status),
      type: this.getTypeValue(type),
      mandatory: Boolean(this.encounterForm.value.mandatory),
      peopleCount: this.showPeopleCount ? Number(this.encounterForm.value.peopleCount) : 0,
      range: this.showRange ? Number(this.encounterForm.value.range) : 0,
      image: imageValue || '/',
    };
  
    this.encounterService.addEncounter(encounter).subscribe({
      next: () => {
        alert('You have successfully added an encounter.');
      },
      error: (err) => {
        console.error('Error adding encounter:', err);
      },
    });
  }

  getStatusValue(status: string): number {
    switch (status) {
      case 'Active':
        return 0;
      case 'Draft':
        return 1;
      case 'Archived':
        return 2;
      default:
        return -1;
    }
  }

  getTypeValue(type: string): number {
    switch (type) {
      case 'Social':
        return 0;
      case 'Location':
        return 1;
      case 'Misc':
        return 2;
      default:
        return -1;
    }
  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
  }

  deleteFile() {
    this.currentFile = null;
  }
}
