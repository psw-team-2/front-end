import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';

@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css']
})
export class TourFormComponent {
  @Output() tourUpdated = new EventEmitter<null>();
  @Input() tour: Tour;
  @Input() shouldEdit: boolean = false;
  

  
  currentFile: File;
   constructor(private service: TourAuthoringService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.tourForm.reset();
    if (this.shouldEdit) {
      this.tourForm.patchValue({
        name: this.tour.name || null,
        description: this.tour.description || null,
        difficulty: String(this.tour.difficulty) || null,
        tags: this.tour.tags || null,
       
      });
    }
  }

  tourForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    difficulty: new FormControl('', [Validators.required]),
    tags: new FormControl('', [Validators.required])
  })

  async addTour():  Promise<void> {

    const tour: Tour = {
      name: this.tourForm.value.name || "",
      description: this.tourForm.value.description || "",
      difficulty: Number(this.tourForm.value.difficulty) || 0,
      tags: this.tourForm.value.tags || "",
      checkpoints : [],
      equipments: [],
    }
  

    
    this.service.addTour(tour).subscribe({
      next: (_) => {
        this.tourUpdated.emit()
      }});
  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
  }

  updateTour(): void {
    const tour: Tour = {
      name: this.tourForm.value.name || "",
      description: this.tourForm.value.description || "",
      difficulty: Number(this.tourForm.value.difficulty) || 0,
      tags: String(this.tourForm.value.tags) || "",
      checkpoints: [],
      equipments: [],
    }
    tour.id = this.tour.id;
    this.service.updateTour(tour).subscribe({
      next: (_) => {
        this.tourUpdated.emit()
      }
    })
  }
}

