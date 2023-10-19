import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Checkpoint } from '../model/checkpoint.model';

@Component({
  selector: 'xp-checkpoint-form',
  templateUrl: './checkpoint-form.component.html',
  styleUrls: ['./checkpoint-form.component.css']
})
export class CheckpointFormComponent {

  @Output() checkpointUpdated = new EventEmitter<null>();
  @Input() checkpoint: Checkpoint;
  @Input() shouldEdit: boolean = false;

  currentFile: File;
  constructor(private service: TourAuthoringService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkpointForm.reset();
    if (this.shouldEdit) {
      this.checkpointForm.patchValue({
        name: this.checkpoint.name || null,
        description: this.checkpoint.description || null,
        longitude: String(this.checkpoint.longitude) || null,
        latitude: String(this.checkpoint.latitude) || null,
        image: this.checkpoint.image || null,
      });
    }
  }

  checkpointForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required])
  })

  async addCheckpoint():  Promise<void> {

    const checkpoint: Checkpoint = {
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      longitude: Number(this.checkpointForm.value.longitude) || 0,
      latitude: Number(this.checkpointForm.value.latitude) || 0,
      image: 'https://localhost:44333/Images/' + this.currentFile.name
    }
    await this.service.upload(this.currentFile).subscribe({
      next: (value) => {

      },
      error: (value) => {

      }, complete: () => {
      },
    });
    this.service.addCheckpoint(checkpoint).subscribe({
      next: (_) => {
        this.checkpointUpdated.emit()
      }});
  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
  }

  updateCheckpoint(): void {
    const checkpoint: Checkpoint = {
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      longitude: Number(this.checkpointForm.value.longitude) || 0,
      latitude: Number(this.checkpointForm.value.latitude) || 0,
      image: this.checkpointForm.value.image || ""
    }
    checkpoint.id = this.checkpoint.id;
    this.service.updateCheckpoint(checkpoint).subscribe({
      next: (_) => {
        this.checkpointUpdated.emit()
      }
    })
  }
}
