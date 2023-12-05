import { Component, OnInit } from '@angular/core';
import { Checkpoint } from '../model/checkpoint.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute } from '@angular/router';
import { Tour } from '../model/tour.model';

@Component({
  selector: 'xp-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.css']
})
export class CheckpointComponent implements OnInit {

  checkpoint: Checkpoint[] = [];
  selectedCheckpoint: Checkpoint;
  shouldEdit: boolean = false;
  shouldRenderCheckpointForm: boolean = false;
  shouldRenderEncounterForm: boolean = false;
  isClickEnabled: boolean = false;
  tourId: Number;
  tour: Tour;
  checkpointIds: Number[];

  constructor(private service: TourAuthoringService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']; // Parse the 'id' as a number
      if (!isNaN(id)) {
        this.tourId = id; // Set the 'tourId' if it's a valid number
        this.getCheckpoint();
      } else {
      }
    });
  }

  getCheckpoint(): void {
    this.service.getTour(this.tourId).subscribe({
      next: (result: Tour) => {
        this.tour = result;
        let temporaryList: Checkpoint[] = [];
        this.service.getCheckpoints().subscribe({
          next: (results: PagedResults<Checkpoint>) => {
              for (let i = 0; i < results.results.length; i++) {
                const checkpoint = results.results[i];
                for (let j = 0; j < this.tour.checkPoints.length; j++) {
                  const cpId = this.tour.checkPoints[j];
                  if (checkpoint.id == cpId) {
                    temporaryList.push(checkpoint);
                  }
                }

              }
            this.checkpoint = temporaryList;
          }
        })
      },
      error: () => {
      }
    })
  }

  resetForm() {
    this.shouldRenderCheckpointForm = false;
  }

  onEditClicked(checkpoint: Checkpoint): void {
    this.shouldRenderCheckpointForm = true;
    this.shouldEdit = true;
    this.selectedCheckpoint = checkpoint;
    this.shouldRenderEncounterForm = false;
  }

  onAddClicked(): void {
    this.shouldRenderCheckpointForm = true;
    this.shouldEdit = false;
    this.shouldRenderEncounterForm = false;
  }

  onAddEncounter(checkpoint: Checkpoint): void {
    this.shouldRenderEncounterForm = true;
    this.shouldEdit = false;
    this.shouldRenderCheckpointForm = false;
    this.selectedCheckpoint = checkpoint;
  }

  deleteCheckpoint(id: number): void {
    this.service.deleteCheckpoint(id).subscribe({
      next: () => {
        this.service.deleteTourCheckpoint(this.tour, id).subscribe({
          next: (val) => {
            this.getCheckpoint();
          }
        })
        
      },
    })
  }

}
