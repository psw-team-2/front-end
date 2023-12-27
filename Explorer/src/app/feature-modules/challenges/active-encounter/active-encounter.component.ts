import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { EncounterService } from '../encounter.service';
import { Encounter, encounterType, ActiveEncounter } from '../model/encounter.model';
import { TouristPosition } from '../../tour-execution/model/touristposition.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';

@Component({
  selector: 'xp-active-encounter',
  templateUrl: './active-encounter.component.html',
  styleUrls: ['./active-encounter.component.css']
})
export class ActiveEncounterComponent implements OnInit {

  public encounters: Encounter[] = [];
  public touristPosition: TouristPosition;
  public currentEncoutner: Encounter | null;
  public userId: number = 0;
  public number: number = 0;    // DO NOT CHANGE; EVERYTHING IS USED TO CHECK IF ENCOUNTER IS ACTIVATED
  public shouldCreateActiveEncounter: boolean = true;
  public imageLongitude: number = 0;
  public imageLatitude: number = 0;

  constructor(private authService: AuthService, private tourAuthoringService: TourAuthoringService, private service: EncounterService, private tourExecutionService: TourExecutionService) { }

  async ngOnInit(): Promise<void> {
    this.service.getEncounters().subscribe({
      next: (result) => {
        this.encounters = result.results;
      }
    });

    window.setInterval(()=>{
      let id = this.authService.user$.value.id;
      this.userId = id;
      let touristPositionRaw = localStorage.getItem(id.toString()) || '';
      this.touristPosition = JSON.parse(touristPositionRaw);
      }, 5000)
  }

  haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters

    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }

  checkForMiscEncounter() {

    if (this.currentEncoutner === null) {
      return false;
    }

    for (let encounter of this.encounters)
    {
      const distance = this.haversine(
        this.touristPosition.latitude,
        this.touristPosition.longitude,
        encounter.latitude,
        encounter.longitude
      );
      
      if (distance < 20 && encounter.type === encounterType.Misc) {
        if (this.shouldCreateActiveEncounter) {
          this.shouldCreateActiveEncounter = false;
          this.tourExecutionService.postActiveEncounters({
            encounterId: encounter.id!,
            end: (new Date()),
            state: 1,
            touristId: this.userId
          }).subscribe({
            next: (result) => {console.log(result);
              this.number = result.id!;
            }
          });
        }

        this.currentEncoutner = encounter;
        return true;
      }
    }

    return false;
  }

  checkForLocationEncounters() {

    if (this.currentEncoutner === null) {
      return false;
    }

    for (let encounter of this.encounters)
    {
      const distance = this.haversine(
        this.touristPosition.latitude,
        this.touristPosition.longitude,
        encounter.latitude,
        encounter.longitude
      );
      
      if (distance < 200 && encounter.type === encounterType.Location) {
        if (this.shouldCreateActiveEncounter) {
          this.shouldCreateActiveEncounter = false;
          this.tourExecutionService.postActiveEncounters({
            encounterId: encounter.id!,
            end: (new Date()),
            state: 1,
            touristId: this.userId
          }).subscribe({
            next: (result) => {console.log(result);
              this.number = result.id!;
            }
          });
        }

        const values = encounter.description.split(',').map(parseFloat);
        this.imageLatitude = values[0],
        this.imageLongitude = values[1],

        this.currentEncoutner = encounter;
        return true;
      }
    }

    return false;
  }

  MiscEncounterFinished() {
    this.tourExecutionService.updateActiveEncounters({
      id: this.number,
      encounterId: this.currentEncoutner!.id!,
      end: (new Date()),
      state: 0,
      touristId: this.userId
    }).subscribe();
    this.currentEncoutner = null;
    this.shouldCreateActiveEncounter = true;
  }

  LocationEncounterFinished() {

    const distance = this.haversine(
      this.touristPosition.latitude,
      this.touristPosition.longitude,
      this.imageLatitude,
      this.imageLongitude
    );

    if (distance <= 15) {
      this.tourExecutionService.updateActiveEncounters({
        id: this.number,
        encounterId: this.currentEncoutner!.id!,
        end: (new Date()),
        state: 0,
        touristId: this.userId
      }).subscribe();
      this.currentEncoutner = null;
      this.shouldCreateActiveEncounter = true;
      return;
    }

    console.log('GLUP');
  }

}
