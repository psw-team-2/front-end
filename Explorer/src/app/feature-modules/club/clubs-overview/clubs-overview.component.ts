import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';


@Component({
  selector: 'xp-clubs-overview',
  templateUrl: './clubs-overview.component.html',
  styleUrls: ['./clubs-overview.component.css']
})
export class ClubsOverviewComponent implements OnInit {

  clubs: Club[] = [];
  selectedClub: Club;
  shouldRenderClubForm: boolean = false;
  shouldEdit: boolean = false;

  constructor(private service: ClubService) { }

  ngOnInit(): void {
    this.getClubs();
  }

  deleteClub(id: number): void {
    this.service.deleteClub(id).subscribe({
      next: () => {
        this.getClubs();
      },
    })
  }

  getClubs(): void {
    this.service.getClubs().subscribe({
      next: (result: PagedResults<Club>) => {
        this.clubs = result.results;
      },
      error: () => {
      }
    })
  }

  onEditClicked(club: Club): void {
    this.selectedClub = club;
    this.shouldRenderClubForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderClubForm = true;
  }

  viewClub(club: Club): void {
    this.selectedClub = club;
  }
}
