import { Component, OnInit } from '@angular/core';
import { Checkpoint } from '../model/checkpoint.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

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

  constructor(private service: TourAuthoringService) {}

  ngOnInit(): void {
    this.getCheckpoint();
  }

  getCheckpoint(): void {
    this.service.getCheckpoints().subscribe({
      next: (result: PagedResults<Checkpoint>) =>
      {
        this.checkpoint = result.results;
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
