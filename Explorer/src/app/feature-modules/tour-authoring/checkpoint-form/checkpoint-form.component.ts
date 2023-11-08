import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Checkpoint } from '../model/checkpoint.model';
import { PublicRequest } from '../model/public-request.model';
import { MapService } from 'src/app/shared/map/map.service';
import { Tour } from '../model/tour.model';

@Component({
  selector: 'xp-checkpoint-form',
  templateUrl: './checkpoint-form.component.html',
  styleUrls: ['./checkpoint-form.component.css']
})
export class CheckpointFormComponent {

  @Output() checkpointUpdated = new EventEmitter<null>();
  @Output() formClosed = new EventEmitter<null>();
  @Input() checkpoint: Checkpoint;
  @Input() shouldEdit: boolean = false;
  @Input() tour: Tour;
  mapService: MapService;
  currentFile: File | null;
  selectedCoordinates: number[] = [];
  isClickEnabled: boolean = true;
  public checkpointToPresent: Checkpoint | any;

  constructor(private service: TourAuthoringService,) {
    this.checkpointToPresent = { latitude: 45.2396, longitude: 19.8227 }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkpointForm.reset();
    if (this.shouldEdit) {
      console.log(this.checkpoint)
      this.checkpointForm.patchValue({
        name: this.checkpoint.name || null,
        description: this.checkpoint.description || null,
        longitude: String(this.checkpoint.longitude) || null,
        latitude: String(this.checkpoint.latitude) || null,
        image: this.checkpoint.image || null,
      });
      this.checkpointToPresent.latitude = this.checkpoint.latitude;
      this.checkpointToPresent.longitude = this.checkpoint.longitude;
    }
    else {
      this.checkpointToPresent = { latitude: 45.2396, longitude: 19.8227 }
    }
  }

  checkpointForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required]),
    latitude: new FormControl('', [Validators.required]),
    isPublic: new FormControl(false),
    image: new FormControl('', [Validators.required])
  })

  async addCheckpoint(): Promise<void> {

    if (this.currentFile == null) {
      return;
    }
    const checkpoint: Checkpoint = {
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      longitude: this.selectedCoordinates[1] || this.checkpointToPresent.longitude,
      latitude: this.selectedCoordinates[0] || this.checkpointToPresent.latitude,
      image: 'https://localhost:44333/Images/' + this.currentFile.name,
      isPublic: false
    }
    await this.service.upload(this.currentFile).subscribe({
      next: (value) => {

      },
      error: (value) => {

      }, complete: () => {
      },
    });

    await this.service.addCheckpoint(checkpoint).subscribe({
      next: (checkpoint: Checkpoint) => {
        let checkpointId: number|any;
        checkpointId= checkpoint.id;
        this.service.updateTourCheckpoints(this.tour, checkpointId).subscribe({
          next: (val) => {
            this.checkpointUpdated.emit()
            this.formClosed.emit()
          }
        })
      },
    });

  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
  }

  deleteFile() {
    this.currentFile = null;
  }

  updateCheckpoint(): void {
    const checkpoint: Checkpoint = {
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      longitude: this.selectedCoordinates[1] || this.checkpointToPresent.longitude,
      latitude: this.selectedCoordinates[0] || this.checkpointToPresent.latitude,
      image: this.checkpointForm.value.image || "",
      isPublic: false
    }
    checkpoint.id = this.checkpoint.id;
    this.service.updateCheckpoint(checkpoint).subscribe({
      next: (_) => {
        this.checkpointUpdated.emit()
        this.formClosed.emit()
      }
    })
  }

  toggleClickEvent() {
    this.isClickEnabled = !this.isClickEnabled;
  }

  onCoordinatesSelected(coordinates: number[]) {
    this.selectedCoordinates = coordinates;
  }

}
