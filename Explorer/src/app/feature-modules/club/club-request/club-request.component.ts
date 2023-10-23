import { Component, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubRequest } from '../model/club-request.model';
import { ClubRequestService } from '../club-request.service';

@Component({
  selector: 'xp-club-request',
  templateUrl: './club-request.component.html',
  styleUrls: ['./club-request.component.css']
})
export class ClubRequestComponent implements OnInit {

  clubRequest: ClubRequest[] = [];
  selectedRequest: ClubRequest;


  constructor(private service: ClubRequestService) {}

  ngOnInit(): void {
    this.getClubRequests();
  }  

  getClubRequests(): void {
    this.service.getClubRequests().subscribe({
      next: (result: PagedResults<ClubRequest>) => {
        this.clubRequest = result.results;
      },
      error: () => {
      }
    })
  }

  onWithdrawRequestClicked(id: number): void {
    this.service.withdrawRequest(id).subscribe({
      next: () => {
        console.log("The request for joining the club has been successfully withdraw!");
        this.getClubRequests();
      },
      error: () => {
      } 
    })
  }

}
