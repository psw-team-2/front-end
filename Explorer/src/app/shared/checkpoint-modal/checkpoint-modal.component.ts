import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';

@Component({
  selector: 'app-checkpoint-modal',
  templateUrl: './checkpoint-modal.component.html',
  styleUrls: ['./checkpoint-modal.component.css']
})
export class CheckpointModalComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  checkpointName = '';
  checkpointDescription = '';
  selectedFile: File;
  imageSrc: string = 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
  imagePath: string = 'https://localhost:44333/Images/';
  @Output() saveClicked: EventEmitter<{ name: string, description: string, image: string }> = new EventEmitter();

  constructor(private dialogRef: MatDialogRef<CheckpointModalComponent>, private service: TourAuthoringService) {}

   save() {
    // Emit the event with name and description values
    this.saveClicked.emit({ name: this.checkpointName, description: this.checkpointDescription, image: this.imagePath });
    // Close the modal
    this.dialogRef.close();

     this.service.upload(this.selectedFile).subscribe({
      next: (value) => {

      },
      error: (value) => {

      }, complete: () => {
      },
    });
    
    
    
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      // Create a URL for the selected file
      this.imageSrc = window.URL.createObjectURL(this.selectedFile);
      this.imagePath = 'https://localhost:44333/Images/' +  this.selectedFile.name
    }
  }

  close(): void {
    // Close the modal without saving
    this.dialogRef.close();
  }

  uploadFile(): void {
    // Trigger click on the hidden file input
    if (this.fileInput) {
      const fileInput = this.fileInput.nativeElement as HTMLInputElement;
      fileInput.click();
    }
  }
}
