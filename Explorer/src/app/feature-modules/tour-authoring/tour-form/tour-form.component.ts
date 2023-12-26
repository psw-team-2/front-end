import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css']
})
export class TourFormComponent {
  @Output() tourUpdated = new EventEmitter<null>();
  @Input() tour: Tour;
  @Input() shouldEdit: boolean = false;
  
  user: User;
  currentFile: File;
  currentFileURL: string | null = null;

   constructor(private service: TourAuthoringService, private authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges): void {

    this.authService.user$.subscribe(user =>{
      this.user = user;
    })


    this.tourForm.reset();
    if (this.shouldEdit) {
      this.tourForm.patchValue({
        name: this.tour.name || null,
        description: this.tour.description || null,
        image: this.tour.image || null,
        difficulty: String(this.tour.difficulty) || null,
       
      });
    }
  }

  tourForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    difficulty: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
   
  })

  async addTour():  Promise<void> {

    const tour: Tour = {
      name: this.tourForm.value.name || "",
      description: this.tourForm.value.description || "",
      difficulty: Number(this.tourForm.value.difficulty) || 0,
      tags: [],
      checkPoints : [],
      equipment: [],
      objects: [],
      status: 0,
      totalLength: 0,
      footTime: 0,
      carTime: 0,
      bicycleTime: 0,
      authorId: this.user.id,
      publishTime: (new Date()).toISOString(),
      price:0,
      points: 0,
      image: 'https://localhost:44333/Images/' + this.currentFile.name,
    };
    await this.service.uploadImage(this.currentFile).subscribe({
      next: (value) => {

      },
      error: (value) => {
        
      }, complete: () => {
      },
    });
  
    this.service.addTour(tour).subscribe({
      next: (_) => {
        this.tourUpdated.emit()
      }});
  }

  onFileSelected(event: any) {
    this.currentFile = event.target.files[0];
    if (this.currentFile) {
      // Create a URL for the selected file
      this.currentFileURL = window.URL.createObjectURL(this.currentFile);
    }
  }

  updateTour(): void {
    const tour: Tour = {
      name: this.tourForm.value.name || "",
      description: this.tourForm.value.description || "",
      difficulty: Number(this.tourForm.value.difficulty) || 0,
      tags: [],
      checkPoints: [],
      equipment: [],
      objects: [],
      status: 1,
      totalLength: 1,
      footTime: 1,
      carTime: 0,
      bicycleTime: 0,
      authorId: this.user.id,
      publishTime: (new Date()).toString(),
      price:0,
      points: 0,
      image: this.tourForm.value.image || "",
    }
    tour.id = this.tour.id;
    this.service.updateTour(tour).subscribe({
      next: (_) => {
        this.tourUpdated.emit()
      }
    })
  }
}

