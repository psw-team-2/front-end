import { Component, OnInit } from '@angular/core';
import { ClubService } from '../club.service';
import { Club } from '../model/club.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.css']
})
export class ClubListComponent implements OnInit {

  clubs: Club[] = [];
  selectedClub: Club;
  shouldEdit: boolean = false;
  shouldRenderClubForm: boolean = false;
  
  constructor(private service: ClubService) { }

  ngOnInit(): void {
    this.getClubs();
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

  deleteClub(id: number): void {
    this.service.deleteClub(id).subscribe({
      next: () => {
        this.getClubs();
      },
    })
  }

  onEditClicked(club: Club): void {
    this.selectedClub = club;
    this.shouldEdit = true;
    this.shouldRenderClubForm = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderClubForm = true;
  }
}
