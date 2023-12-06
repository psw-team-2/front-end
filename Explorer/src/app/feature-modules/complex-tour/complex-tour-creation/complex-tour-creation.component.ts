import { CdkDragDrop, moveItemInArray, CdkDragMove } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ComplexTourService } from '../complex-tour.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { forkJoin } from 'rxjs';
import { Equipment } from '../../tour-authoring/model/equipment.model';

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
  secondSectionActive: boolean;
  globalCheckpoints: Checkpoint[] = []; // Assuming your checkpoints are represented as strings
  totalDistance: Number;
  totalDifficulty: number;
  allEquipment: Equipment[];
  allTags: string[] = [];
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
  
  }
  // For example, if you want to go back to the displayed tours, you can create a method like this:
  goBackToDisplayedTours(tour: Tour) {
    // Remove tour from addedTours
    this.addedTours = this.addedTours.filter(t => t.id !== tour.id);
    // Add tour back to displayedTours
    this.displayedTours.push(tour);
  }
  createComplexTour() {
    this.secondSectionActive = true;
    this.totalDifficulty = this.calculateAverageDifficulty(this.addedTours);
    this.allTags = this.combineUniqueTags(this.addedTours);

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
      },
      (error) => {
        console.error('Error fetching checkpoints:', error);
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

drop(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.globalCheckpoints, event.previousIndex, event.currentIndex);
}
}

