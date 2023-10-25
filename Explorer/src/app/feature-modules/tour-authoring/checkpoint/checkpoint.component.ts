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
export class CheckpointComponent implements OnInit{

  checkpoint: Checkpoint[] = [];
  selectedCheckpoint: Checkpoint;
  shouldEdit: boolean = false;
  shouldRenderCheckpointForm: boolean = false;
  isClickEnabled: boolean = false;
  tourId : Number;
  tour : Tour;
  checkpointIds : Number[];

  constructor(private service: TourAuthoringService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getCheckpoint();
    this.route.params.subscribe(params => {
      this.tourId = params['id'];
      console.log(this.tourId);
    });
  }

  getCheckpoint(): void {

    this.service.getTour(this.tourId).subscribe({
      next: (result: Tour) =>
      {
        this.checkpointIds = result.checkpoints;
        console.log(this.checkpointIds);
      },
      error: () => {
      }     
    })
  }

  onEditClicked(checkpoint: Checkpoint): void{
    this.shouldRenderCheckpointForm = true;
    this.shouldEdit = true;
    this.selectedCheckpoint = checkpoint;
  }

  onAddClicked(): void {
    this.shouldRenderCheckpointForm = true;
    this.shouldEdit = false;
  }

  deleteCheckpoint(id: number):void {
    this.service.deleteCheckpoint(id).subscribe({
      next: () => {
        this.getCheckpoint();
      },
    })
  }
  
}
