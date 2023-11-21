import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Checkpoint } from '../model/checkpoint.model';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { forkJoin } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { TourReview } from '../../marketplace/model/tour-review.model';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css'],
})
export class TourOverviewComponent {
  tour: Tour;
  tourId: number | null;
  checkpoints: Checkpoint[] = [];
  canRender: boolean = false;
  images: string[] = [];
  currentIndex: number = 0;
  reviews: TourReview[] = [];
  currentSection: number = 0;
  tourInfoForm: FormGroup;
  editMode = false;
  defaultImageUrl = "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg";
  vehicleMode: string = "walk";
  userRole: string;

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };

    const formattedDate = new Date(date).toLocaleDateString('en-US', options);
    return formattedDate;
  }

  nextSection() {
    if (this.userRole === 'author') {
      // If the user is an author, navigate through sections 0 to 4 continuously
      this.currentSection = (this.currentSection + 1) % 5;
    } else {
      // If the user is a tourist, navigate through sections 0 to 2 continuously
      this.currentSection = (this.currentSection + 1) % 3;
    }
  }
  
  prevSection() {
    if (this.userRole === 'author') {
      // If the user is an author, navigate through sections 0 to 4 continuously
      this.currentSection = (this.currentSection - 1 + 5) % 5;
    } else {
      // If the user is a tourist, navigate through sections 0 to 2 continuously
      this.currentSection = (this.currentSection - 1 + 3) % 3;
    }
  }
  
  
  constructor(private tourService: TourAuthoringService, private route: ActivatedRoute, private marketplaceService: MarketplaceService, private fb: FormBuilder, private authService: AuthService) {
    this.tourInfoForm = this.fb.group({
      name: [''],
      description: [''],
      difficulty: [''],
      publishTime: [''],
      tags: [''], // Add the 'tags' form control
      // Add more form controls as needed
    });
    
   }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.tourId = id ? parseInt(id, 10) : null;
      if (this.tourId !== null) {
        this.tourService.getTour(this.tourId).subscribe({
          next: (result: Tour) => {
            this.tour = result;
            this.fetchCheckpointsForTour(this.tourId);
            this.tourInfoForm.patchValue({
              name: this.tour?.name,
              description: this.tour?.description,
              difficulty: this.tour?.difficulty,
              publishTime: this.tour?.publishTime,
              tags: this.tour?.tags.map(tag => `#${tag}`).join(' '), // Add "#" to each tag
              // Update with other properties
            });
            
            
          }
        });
        this.fetchTourReviews();

        this.authService.user$.subscribe((user) => {
          this.userRole = user.role;
        });
    
      } else {
        // Handle the case where id is null
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if(!this.editMode)
    {
      this.onSubmit();
    }
  }

  fetchTourReviews(): void {
    this.marketplaceService.getTourReview().subscribe({
      next: (result) => {
        this.reviews = result.results;
      }
    });
  }

  fetchCheckpointsForTour(tourId: number | null): void {
    if (tourId === null) {
      // Handle the case where tourId is null
      return;
    }

    const checkpointIds: Number[] = this.tour.checkPoints;

    if (checkpointIds.length > 0) {
      const observables = checkpointIds.map(checkpointId =>
        this.tourService.getCheckpointById(checkpointId)
      );

      forkJoin(observables).subscribe({
        next: (checkpoints: Checkpoint[]) => {
          this.checkpoints = checkpoints;
          this.canRender = true; // Set canRender to true when all checkpoints are fetched.
          console.log(new Date());
          this.images = this.checkpoints.map(checkpoint => checkpoint.image);
        },
        error: (error) => {
          // Handle errors if necessary
        }
      });
    } else {
      this.canRender = true; // If there are no checkpoint IDs, set canRender to true immediately.
    }
  }
  onSubmit() {
    const existingTags = (this.tour.tags || []).map((tag: string) => tag.toLowerCase());
  
    // Process the input string
    const newTags = (this.tourInfoForm.get('tags')?.value || '')
      .replace(/\s+/g, '') // Remove extra spaces
      .toLowerCase() // Convert to lowercase
      .split('#') // Split by '#'
      .filter((tag: string) => tag !== ''); // Remove empty tags
  
    // Remove duplicates manually
    const uniqueNewTags: string[] = [];
    newTags.forEach((tag: string) => {
      if (!uniqueNewTags.includes(tag)) {
        uniqueNewTags.push(tag);
      }
    });
  
    // Remove deleted tags
    const updatedValues = {
      name: this.tourInfoForm.get('name')?.value || '',
      description: this.tourInfoForm.get('description')?.value || '',
      difficulty: this.tourInfoForm.get('difficulty')?.value || 0,
      tags: [...uniqueNewTags],
      // Add more properties as needed
    };
  
    // Update the existing this.tour object with the form values
    this.tour = {
      ...this.tour,
      ...updatedValues,
    };
  
    this.tourService.updateTour(this.tour)
      .subscribe(updatedTour => {
        console.log('Tour updated successfully:', updatedTour);
        this.tourInfoForm.patchValue({
          name: updatedTour?.name,
          description: updatedTour?.description,
          difficulty: updatedTour?.difficulty,
          publishTime: updatedTour?.publishTime,
          tags: updatedTour?.tags.map(tag => `#${tag}`).join(' '), // Add "#" to each tag
          // Update with other properties
        });
      }, error => {
        console.error('Error updating tour:', error);
        // Handle the error appropriately
      });
  }
  
  
  editCheckpoint(checkpoint: any): void {
    console.log(`Editing checkpoint: ${checkpoint.name}`);
  }

  deleteCheckpoint(checkpoint: any): void {

    console.log(`Deleting checkpoint: ${checkpoint.name}`);
  }
  submitReview(): void {
    // Implement logic to add a new review using the review service
    // Update the reviews array to reflect the new review
  }

    // Define the getStarArray method
    getStarArray(rating: number): number[] {
      // Assuming each star corresponds to a whole number in the rating
      return Array(Math.round(rating)).fill(0).map((x, i) => i);
    }
}