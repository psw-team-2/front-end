import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Object } from '../model/object.model';
import { PublicRequest } from '../model/public-request.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {

  constructor(private service: TourAuthoringService, private authService: AuthService) { }

  currentFile: File | null;
  objectId: number | any;
  user: User;

  objectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    isPublic: new FormControl(false)
  });

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

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

    await this.service.uploadObject(this.currentFile).subscribe({
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
      next: (object: Object) => {
        this.objectId = object.id;
        if (this.objectForm.value.isPublic === true) {
          this.sendPublicRequest();
        }
      }
    });
  }

  async sendPublicRequest(): Promise<void> {
    const publicRequest: PublicRequest = {
      entityId: this.objectId,
      authorId: this.user.id,
      comment: "",
      isCheckPoint: false,
      isNotified: true,
      isApproved: false
    }

    await this.service.sendPublicRequest(publicRequest).subscribe({
      next: (publicRequest: PublicRequest) => {}
    })
  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
  }

  deleteFile() {
    this.currentFile = null;
  }
}
