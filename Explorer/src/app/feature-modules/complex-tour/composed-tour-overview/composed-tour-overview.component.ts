import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { TourReview } from '../../marketplace/model/tour-review.model';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { Equipment } from '../../tour-authoring/model/equipment.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { ComplexTourService } from '../complex-tour.service';
import { ComposedTour } from '../model/composed-tour.model';

@Component({
  selector: 'xp-composed-tour-overview',
  templateUrl: './composed-tour-overview.component.html',
  styleUrls: ['./composed-tour-overview.component.css']
})
export class ComposedTourOverviewComponent {
  composedTourId: number | null;
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
  tour: Tour;
  composedTour: ComposedTour;
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
  
   convertToTour(composedTour: ComposedTour): Tour {
    return {
      id: composedTour.id,
      name: composedTour.name,
      description: composedTour.description,
      difficulty: composedTour.difficulty,
      tags: composedTour.tags,
      checkPoints : composedTour.checkPoints,
      equipment: composedTour.equipment,
      objects: composedTour.objects,
      status: composedTour.status,
      totalLength: composedTour.totalLength,
      footTime: composedTour.footTime,
      bicycleTime: composedTour.bicycleTime,
      carTime: composedTour.carTime,
      authorId: composedTour.authorId,
      publishTime: composedTour.publishTime,
      points: 0,
      price: 0,
      image: ''
    };
  }
  nextSection() {
      this.currentSection = (this.currentSection + 1) % 3;
  }
  
  prevSection() {

      this.currentSection = (this.currentSection - 1 + 5) % 3;
 
  }
  
  
  constructor(private tourService: TourAuthoringService, private route: ActivatedRoute, private marketplaceService: MarketplaceService, private fb: FormBuilder, private authService: AuthService, private complexService : ComplexTourService) {
    this.tourInfoForm = this.fb.group({
      name: [''],
      description: [''],
      difficulty: [''],
      publishTime: [''],
      tags: [''], // Add the 'tags' form control
      distance: [''], 
      // Add more form controls as needed
    });
    
   }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.composedTourId = id ? parseInt(id, 10) : null;
      if (this.composedTourId !== null) {
        this.complexService.getAll(0,0).subscribe((result: PagedResults<ComposedTour>) => {
          this.composedTour = result.results.filter(tour => tour.id === this.composedTourId)[0];
          console.log(this.composedTour.name);
          this.tour = this.convertToTour(this.composedTour);
          console.log( this.tour);
          this.fetchCheckpointsForTour();
          this.fetchObjectsForTour(this.tour.objects);
          this.fetchEquipmentForTour(this.tour.equipment);
          this.tourInfoForm.patchValue({
            name: this.tour?.name,
            description: this.tour?.description,
            difficulty: this.tour?.difficulty,
            publishTime: this.tour?.publishTime,
            tags: this.tour?.tags.map(tag => `#${tag}`).join(' '), // Add "#" to each tag
            distance: this.tour?.totalLength,
            // Update with other properties
          });
        });

        this.authService.user$.subscribe((user) => {
          this.userRole = user.role;
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



  private async fetchEquipmentForTour(equipmentIds: number[]): Promise<void> {
    this.equipment = undefined; // Set to undefined before fetching
  
    const allEquipment$: Observable<PagedResults<Equipment>> = this.tourService.getEquipment();
  
    allEquipment$.subscribe(
      (pagedResults: PagedResults<Equipment>) => {
        const allEquipment: Equipment[] = pagedResults.results;
        
        // Filter equipment based on the provided IDs
        const selectedEquipment: Equipment[] = allEquipment.filter(equipment =>
          equipmentIds.includes(equipment.id || 0)  // Make sure 'id' is defined or use a default value
        );
  
          this.equipment = selectedEquipment;
      },
      (error) => {
        // Handle errors here
        console.error(error);
      }
    );
  }
  
  fetchCheckpointsForTour(): void {
  

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
  
}
