import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Club } from '../model/club.model';

@Component({
  selector: 'xp-club-request',
  templateUrl: './club-request.component.html',
  styleUrls: ['./club-request.component.css']
})
export class ClubRequestComponent /*implements OnInit*/ {

/*club: Club[] = [];

  constructor(private service: ClubService) {}

  ngOnInit(): void {
    this.service.getClubs().subscribe({
      next: (result: PagedResults<Club>) => {
        this.club = result.results;
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }  */
}
