import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PublicRequest } from '../../tour-authoring/model/public-request.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { Object } from '../../tour-authoring/model/object.model';

@Component({
  selector: 'xp-public-requests',
  templateUrl: './public-requests.component.html',
  styleUrls: ['./public-requests.component.css']
})
export class PublicRequestsComponent implements OnInit {
  publicRequests: PublicRequest[] = [];
  constructor(public dialog: MatDialog, private service: AdministrationService, private tourAuthoringService: TourAuthoringService) { }

  ngOnInit(): void {
    this.getPublicRequests();
  }

  getPublicRequests(): void {
    this.service.getPublicRequests().subscribe({
      next: (result: PagedResults<PublicRequest>) => {
        this.publicRequests = result.results;

        this.publicRequests = this.publicRequests.filter(pr => pr.comment === '');
      },
      error: () => {
      }
    });
  }

  openModal(pr: PublicRequest, action: string): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'Accept') {
          this.handleAccept(pr, result);
        } else if (action === 'Decline') {
          this.handleDecline(pr, result);
        }
      }
    });
  }

  handleAccept(pr: PublicRequest, result: string): void {
    let publicRequest: PublicRequest = {
      entityId: pr.entityId,
      authorId: pr.authorId,
      comment: result,
      isCheckPoint: pr.isCheckPoint,
      isNotified: false,
      isApproved: true
    }
    publicRequest.id = pr.id;
    this.service.updatePublicRequest(publicRequest).subscribe({
      next: () => {  
        if (pr.isCheckPoint) {
          this.handleCheckpoint(pr.entityId);
        } else {
          this.handleObject(pr.entityId);
        }
        this.getPublicRequests();
      }
    });
  }
  
  handleDecline(pr: PublicRequest, result: string): void {
    let publicRequest: PublicRequest = {
      entityId: pr.entityId,
      authorId: pr.authorId,
      comment: result,
      isCheckPoint: pr.isCheckPoint,
      isNotified: false,
      isApproved: false
    }
    publicRequest.id = pr.id;
    this.service.updatePublicRequest(publicRequest).subscribe({
      next: () => {
        this.getPublicRequests();
      }
    });
  }

  handleCheckpoint(id: number): void {
    let checkpoint: Checkpoint;
    this.tourAuthoringService.getCheckpointById(id).subscribe({
      next: (cp: Checkpoint) => {
        checkpoint = cp;
        checkpoint.isPublic = true;
      },
      complete: () => {
        this.tourAuthoringService.updateCheckpoint(checkpoint).subscribe({})
      }
    });
  }

  handleObject(id: number): void {
    let object: Object;
    this.tourAuthoringService.getObjectById(id).subscribe({
      next: (obj: Object) => {
        object = obj;
        object.isPublic = true;
      },
      complete: () => {
        this.tourAuthoringService.updateObject(object).subscribe({})
      }
    });
  }
}
