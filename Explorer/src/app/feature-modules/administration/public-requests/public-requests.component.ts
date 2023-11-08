import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PublicRequest } from '../../tour-authoring/model/public-request.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-public-requests',
  templateUrl: './public-requests.component.html',
  styleUrls: ['./public-requests.component.css']
})
export class PublicRequestsComponent implements OnInit {
  publicRequests: PublicRequest[] = [];
  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getPublicRequests();
  }

  getPublicRequests(): void {
    this.service.getPublicRequests().subscribe({
      next: (result: PagedResults<PublicRequest>) => {
        this.publicRequests = result.results;
      },
      error: () => {
      }
    });
  }
}
