import { Component, OnInit } from '@angular/core';
import { ActiveEncounterService } from '../active-encounter.service';
import { ActiveEncounter } from '../model/active-encounter.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Encounter } from '../model/encounter.model';

@Component({
  selector: 'xp-active-encounter',
  templateUrl: './active-encounter.component.html',
  styleUrls: ['./active-encounter.component.css']
})
export class ActiveEncounterComponent implements OnInit{
  
 activeEncounters: ActiveEncounter[] = [];
 selectedEncounter: ActiveEncounter;

  constructor(private activeEncounterService: ActiveEncounterService) {}
  
  ngOnInit(): void {
    this.getActiveEncounters()
  }

  getActiveEncounters(): void {
    this.activeEncounterService.getActiveEncounters().subscribe({
      next: (result: PagedResults<ActiveEncounter>) => {
        this.activeEncounters = result.results;
      },
      error: () => {
      }
    });
  }

  onCompleteClicked(activeEncounter: ActiveEncounter): void {
    this.selectedEncounter = activeEncounter;

    this.selectedEncounter.state = 1;
    this.selectedEncounter.end = new Date(Date.now())
    this.selectedEncounter.xp += 10
      
    this.activeEncounterService.completeEncounter(activeEncounter).subscribe({
        next: () => {
           console.log("You complite encounter!")
           this.getActiveEncounters();
        },
        error: () => {}
    });     
  }

  onLevelUp(activeEncounter: ActiveEncounter): void {
    this.selectedEncounter = activeEncounter;
    if(this.selectedEncounter.xp >= 20){
      this.selectedEncounter.level += 1

      this.activeEncounterService.levelUp(activeEncounter).subscribe({
        next: () => {
           console.log("You have reached the next level!")
           this.getActiveEncounters();
        },
        error: () => {}
      });     
    }

  }

}
