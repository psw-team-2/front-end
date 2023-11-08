import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TourAutoringService } from '../tour-autoring.service';
import { Object } from '../model/object.model';

@Component({
  selector: 'xp-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent {

  constructor(private service: TourAutoringService) { }

  currentFile: File | null;

  objectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
  });

  async addObject(): Promise<void> {
    console.log(this.objectForm.value);

    if (this.currentFile == null) {
      return;
    }

    const object: Object = {
      name: this.objectForm.value.name || "",
      description: this.objectForm.value.description || "",
      image: 'https://localhost:44333/Images/' + this.currentFile.name || "",
      category: parseInt(this.objectForm.value.category as string) || 0,
      longitude: 0,
      latitude: 0,
      isPublic: false
    };

    await this.service.upload(this.currentFile).subscribe({
      next: (value) => {
        // Obrada uspešnog upload-a
      },
      error: (value) => {
        // Obrada greške tokom upload-a
      }, complete: () => {
        // Obrada završetka upload-a
      },
    });

    this.service.addObject(object).subscribe({
      next: (_) => {
        console.log("Uspesno");
      }
    });
  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
  }

  deleteFile() {
    this.currentFile = null;
  }
}
