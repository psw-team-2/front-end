import { Component } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ComplexTourService } from '../complex-tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { forkJoin, of, switchMap } from 'rxjs';
import { Equipment } from '../../tour-authoring/model/equipment.model';
import { ComposedTour } from '../model/composed-tour.model';

@Component({
  selector: 'xp-complex-tour-creation',
  templateUrl: './complex-tour-creation.component.html',
  styleUrls: ['./complex-tour-creation.component.css']
})
export class ComplexTourCreationComponent {
  user: User | undefined;
  allTours: Tour[] = [];
  displayedTours: Tour[] = [];
  addedTours: Tour[] = [];
  addedTourIds: number[] = [];
  secondSectionActive: boolean;
  globalCheckpoints: Checkpoint[] = []; // Assuming your checkpoints are represented as strings
  globalCheckpointIds: number[] = [];
  totalDistance: number;
  totalDifficulty: number;
  allEquipment: Equipment[];
  allEquipmentIds: number[];
  allTags: string[] = [];
  currentComposedTours: ComposedTour[];
  areCheckpointsEmpty: boolean = false;
  isEquipmentEmpty: boolean = false;
  constructor(private service: ComplexTourService,private authService: AuthService,private router: Router, private tourService: TourAuthoringService){}
  
  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        const id = user.id;
        this.service.retrivesAllUserTours(id).subscribe({
          next: (result: PagedResults<Tour>) => {
            console.log('Response:', result);
            if (result && result.results) {
              this.allTours = result.results;
              this.displayedTours = [...this.allTours];
              this.secondSectionActive = false;
              console.log('Results:', this.allTours);
            } else {
              console.log('Invalid response structure');
            }
          },
          error: (err) => {
            console.error('Error:', err);
          }
        });
      }
    });
  }

  addToComplexTour(tour: Tour) {
    // Remove tour from displayedTours
    this.displayedTours = this.displayedTours.filter(t => t.id !== tour.id);
    // Add tour to addedTours
    this.addedTours.push(tour);
    this.addedTourIds.push(tour.id ?? -1);
  
  }
  // For example, if you want to go back to the displayed tours, you can create a method like this:
  goBackToDisplayedTours(tour: Tour) {
    // Remove tour from addedTours
    this.addedTours = this.addedTours.filter(t => t.id !== tour.id);
    this.addedTourIds = this.addedTourIds.filter(id => id !== tour.id);
    // Add tour back to displayedTours
    this.displayedTours.push(tour);
  }
  createComplexTour() {
    this.secondSectionActive = true;
    this.totalDifficulty = this.calculateAverageDifficulty(this.addedTours);
    this.allTags = this.combineUniqueTags(this.addedTours);
    this.totalDistance = this.calculateTotalDistance(this.addedTours)
    // Fetch all equipment
    this.tourService.getEquipment().pipe(
      switchMap((result: PagedResults<Equipment>) => {
        if (result && result.results) {
          const allEquipmentIds: Set<number> = new Set();
          this.allEquipment = result.results.reduce((equipmentList, equipment) => {
            if (!allEquipmentIds.has(equipment.id ?? -1)) {
              allEquipmentIds.add(equipment.id ?? -1);
              equipmentList.push(equipment);
            }
            return equipmentList;
          }, [] as Equipment[]);
          return of(this.allEquipment); // Wrap the result in an observable using 'of'
        } else {
          console.log('Invalid response structure for equipment');
          return of([]); // Return an observable with an empty array
        }
      })
    ).pipe(
      switchMap(allEquipment => {
        // Filter out equipment based on tour.equipment IDs
        const filteredEquipment = allEquipment.filter(equipment =>
          this.addedTours.some(tour =>
            tour.equipment.some(equipmentId => equipmentId === equipment.id)
          )
        );
        return of(filteredEquipment);
      })
    ).subscribe(
      (filteredEquipment: Equipment[]) => {
        this.allEquipment = filteredEquipment;
        // Use forkJoin to handle multiple asynchronous calls
        const checkpointRequests = this.addedTours.map(tour => {
          // Assuming checkpointIds are stored in the 'checkpointIds' property of the 'Tour' model
          const checkpointIds: number[] = tour.checkPoints;

          const checkpointObservables = checkpointIds.map(checkpointId =>
            this.tourService.getCheckpointById(checkpointId)
          );
          return forkJoin(checkpointObservables);
        });

        forkJoin(checkpointRequests).subscribe(
          (checkpointsArray: Checkpoint[][]) => {
            this.globalCheckpoints = checkpointsArray.flat();
            console.log('Global Checkpoints:', this.globalCheckpoints);
  
            this.globalCheckpointIds = this.globalCheckpoints.map(checkpoint => checkpoint.id || -1);
            this.allEquipmentIds = this.allEquipment.map(equipment => equipment.id || -1);

            console.log('Global Checkpoint IDs:', this.globalCheckpointIds);
          },
          (error) => {
            console.error('Error fetching checkpoints:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching equipment:', error);
      }
    );
  }
calculateAverageDifficulty(tours: Tour[]): number {
  const totalDifficulty = tours.reduce((sum, tour) => sum + tour.difficulty, 0);
  const averageDifficulty = totalDifficulty / tours.length;
  return averageDifficulty;
}

combineUniqueTags(tours: Tour[]): string[] {
  const allTags = tours.reduce((tags, tour) => [...tags, ...tour.tags], [] as string[]);
  const uniqueTags = Array.from(new Set(allTags)); // Use Set to get unique values
  return uniqueTags;
}
calculateTotalDistance(tours: Tour[]): number {
  const totalDistance = tours.reduce((sum, tour) => sum + (tour.totalLength || 0), 0);
  return totalDistance;
}

saveComplexTour() {
  this.service.getAll(0,0).subscribe((result: PagedResults<ComposedTour>) => {
    this.currentComposedTours = result.results;
    console.log(this.currentComposedTours);

    const composedTour: ComposedTour = {
      name: 'Composed tour ' + ++this.currentComposedTours.length,
      description: 'Description of complex tour ' + ++this.currentComposedTours.length,
      difficulty: Math.round(this.totalDifficulty),
      toursId: this.addedTourIds,
      tags: this.allTags,
      checkPoints: this.globalCheckpointIds,
      equipment: this.allEquipmentIds,
      objects: [],
      status: 0,
      totalLength: this.totalDistance,
      footTime: 0,
      bicycleTime: 0,
      carTime: 0,
      authorId: this.user?.id || -1,
      publishTime: new Date().toISOString(),
    };

    this.service.addComplexTour(composedTour).subscribe(
      (savedTour: ComposedTour) => {
        console.log('Complex Tour saved successfully:', savedTour);
        this.router.navigate(['/view-complex-tours']);
  
      },
      (error) => {
        console.error('Error saving complex tour:', error);
        // Handle error logic here
      }
    );
  });

}

resetAddedTours() {
  // Move all added tours back to displayed tours
  this.displayedTours.push(...this.addedTours);
  this.displayedTours = [...new Set(this.displayedTours)]; // Remove duplicates, if any

  // Reset added tours and tour IDs
  this.addedTours = [];
  this.addedTourIds = [];
}
}

