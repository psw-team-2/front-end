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

  async save(): Promise<void> {
    // Emit the event with name and description values
    this.saveClicked.emit({ name: this.checkpointName, description: this.checkpointDescription, image: this.imagePath });
    // Close the modal
    this.dialogRef.close();

    await this.service.upload(this.selectedFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percentDone = Math.round((100 * event.loaded) / event.total);
          console.log(`File is ${percentDone}% uploaded.`);
        } else if (event.type === HttpEventType.Response) {
          // Handle successful response
          console.log('File uploaded successfully:', event.body);
        }
      },
      error: (error) => {
        if (error.status === 400) {
          console.error('No file received.');
          // Display an error message or take appropriate action
        } else {
          console.error('File upload failed:', error);
          // Handle other errors
        }
      },
      complete: () => {
        console.log('File upload complete.');
      },
    });
    
    
    
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

  handleFileInput(event: any) {
    // Handle the selected file, e.g., save it to a variable or perform other actions
    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
    if(selectedFile){
    this.imagePath += selectedFile.name;
    }else
    {
      this.imagePath = "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
    }
    // Update the image source with the selected file
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = (e?.target?.result as string) || '';
      };
      reader.readAsDataURL(selectedFile);
    }
  }
}
