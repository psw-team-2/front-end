import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Router } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Request, RequestStatus } from '../model/request.model';

@Component({
  selector: 'xp-author-requests-overview',
  templateUrl: './author-requests-overview.component.html',
  styleUrls: ['./author-requests-overview.component.css']
})
export class AuthorRequestsOverviewComponent implements OnInit {
  requests: Request[];

  constructor(private service: AdministrationService, private router: Router) {}

  ngOnInit(): void {
    this.service.getAllRequests().subscribe({
      next: (result: PagedResults<Request>) => {
        this.requests = result.results;
        console.log("REQUESTS:");
        console.log(this.requests);
      },
      error: (err: any) => {
        console.error('Error while getting requests:', err);
      }
    });
  }
}
