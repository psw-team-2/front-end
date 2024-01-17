import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Checkpoint } from '../model/checkpoint.model';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { forkJoin, Observable } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { TourReview } from '../../marketplace/model/tour-review.model';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Object } from '../model/object.model';
import { Equipment } from '../model/equipment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourExecution } from '../../tour-execution/model/tourexecution.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  objects: Object[] | undefined= [];
  equipment: Equipment[] | undefined= [];
  defaultImageUrl = "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg";
  vehicleMode: string = "walk";
  userRole: string;
  tourExecution: TourExecution | undefined;
  tourFetched: boolean = false;
  userFetched: boolean = false;
  userId: number;
  shouldRenderTpForm: boolean = false;
  shouldRenderGiftForm: boolean = false;

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
  
  
  constructor(private tourService: TourAuthoringService, private route: ActivatedRoute, private marketplaceService: MarketplaceService, 
    private fb: FormBuilder, private authService: AuthService, private tourExecutionService: TourExecutionService, private router: Router, private snackBar: MatSnackBar) {
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
            this.fetchObjectsForTour(this.tour.objects);
            this.fetchEquipmentForTour(this.tour.equipment);
            this.tourInfoForm.patchValue({
              name: this.tour?.name,
              description: this.tour?.description,
              difficulty: this.tour?.difficulty,
              publishTime: this.tour?.publishTime,
              tags: this.tour?.tags.map(tag => `#${tag}`).join(' '), // Add "#" to each tag
              // Update with other properties
            });
            this.tourFetched = true;
            this.checkGetTourExecution();
          }
        });
        this.fetchTourReviews();

        this.authService.user$.subscribe((user) => {
          this.userRole = user.role;
          this.userId = user.id;
          this.userFetched = true;
          this.checkGetTourExecution();
        });
    
      } else {
        // Handle the case where id is null
      }
    });
  }
  private async fetchObjectsForTour(objectIds: number[]): Promise<void> {
    this.objects = undefined; // Set to undefined before fetching
  
    const objectRequests: Observable<Object>[] = objectIds.map(objectId =>
      this.tourService.getObjectById(objectId)
    );
  
    // Wait for all object requests to complete
    const objects = await forkJoin(objectRequests).toPromise();
  
    // Update the objects array
    this.objects = objects;
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
  private async fetchEquipmentForTour(equipmentIds: number[]): Promise<void> {
    this.equipment = undefined; // Set to undefined before fetching
  
    const allEquipment$: Observable<PagedResults<Equipment>> = this.tourService.getEquipmentTourist();
  
    allEquipment$.subscribe(
      (pagedResults: PagedResults<Equipment>) => {
        const allEquipment: Equipment[] = pagedResults.results;
  
        // Filter equipment based on the provided IDs
        const selectedEquipment: Equipment[] = allEquipment.filter(equipment =>
          equipmentIds.includes(equipment.id || 0)  // Make sure 'id' is defined or use a default value
        );
  
        // Now 'selectedEquipment' contains only the equipment with the provided IDs
        console.log(selectedEquipment);
        this.equipment = selectedEquipment
  
        // Handle the rest of your logic with the selected equipment
      },
      (error) => {
        // Handle errors here
        console.error(error);
      }
    );
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

  //METHOD TO GET TOUR EXECUTION
  getTourExecution(){
      if(this.tour.id !== undefined){
        console.log("DA LI SE VIDIMO?")
        if(this.userRole === "tourist" && this.userId === this.tour.authorId){
            this.tourExecutionService.getTourExecutionByTourAndUser(this.tour.id, this.userId).subscribe({
            next: (result: PagedResults<TourExecution>) => {
                if (result && result.results.length > 0){
                  //WE TAKE 'FirstOf' THE COLLECTION
                  this.tourExecution = result.results[0];
                }
                this.userFetched = false;
              }
            })
        }
      }
  }

  checkGetTourExecution(): void {
    if (this.tourFetched && this.userFetched) {
      this.getTourExecution();
    }
  }

  navigateToBlogForm(): void{
    if(this.tourExecution){
      this.router.navigate(['blog-form', 'tour-report', this.tourExecution.tourId])
    }
  }

 showNotification(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000, 
    });
  } 

  onReportClicked(tour: Tour): void{
    if (!this.userId) {
      this.showNotification('User is not logged in. Pleease log in befor report tour');
      return;
    }else {
      this.shouldRenderTpForm = !this.shouldRenderTpForm;
    }
    
  }

  onSendClicked(tour: Tour): void{
    if (!this.userId) {
      this.showNotification('User is not logged in. Pleease log in before gifting tour');
      return;
    }else {
      this.shouldRenderGiftForm = !this.shouldRenderGiftForm;
    }
    
  }

  onCloseClicked(): void {
    this.shouldRenderTpForm = !this.shouldRenderTpForm;
  }

  onCloseGiftClicked(): void {
    this.shouldRenderGiftForm = !this.shouldRenderGiftForm;
  }
}