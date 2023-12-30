import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourExecution } from '../model/tourexecution.model';
import { TouristPosition } from '../model/touristposition.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import * as L from 'leaflet';
import { Marker, Icon } from 'leaflet';
import { Observable } from 'rxjs';
import { zip } from "rxjs";
import { Router } from '@angular/router';
import { Secret } from '../model/secret.model';
import { Encounter, EncounterMapMaterial, ActiveEncounter } from '../../challenges/model/encounter.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActiveEncounterComponent } from '../../challenges/active-encounter/active-encounter.component';

@Component({
  selector: 'xp-active-tour',
  templateUrl: './active-tour.component.html',
  styleUrls: ['./active-tour.component.css']
})
export class ActiveTourComponent implements OnInit {

  public touristPosition: TouristPosition = { longitude: 0, latitude: 0 };
  public tour: Tour;
  public tourExecution: TourExecution;
  public checkpointList: Checkpoint[] = [];
  public markerList: Marker[] = [];
  public markersReady: Promise<boolean>;
  public encounters: Encounter[] = []
  public activeEncounters: ActiveEncounter[] = []
  public activeEncounter:Encounter;
  public encounterMapMaterials: EncounterMapMaterial[] = []
  public activePeopleList:number[]= []
  public counter:number = 1
  public userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3710/3710297.png',
    shadowUrl: '',
    iconSize: [40, 45],
    iconAnchor: [15, 35],
  });

  constructor(private router: Router, private tourExecutionService: TourExecutionService, private tourAuthoringService: TourAuthoringService, private authService: AuthService) { }

  ngOnInit() {
    let id = this.authService.user$.value.id;
    let touristPositionRaw = localStorage.getItem(id.toString()) || '';
    this.touristPosition = JSON.parse(touristPositionRaw);
    this.tourExecutionService.getTourExecution(id).subscribe((tourExecution: TourExecution) => {
      this.tourExecution = tourExecution
      this.tourAuthoringService.getTour(tourExecution.tourId).subscribe((tour: Tour) => {
        this.tour = tour;
        this.getCheckpoints();
      })
    })
    this.getEncounters();
    this.getActiveEncounters()
    setInterval(async ()=>{
      this.proveraLokacija(this.activeEncounter)
    },10000)
  }

  getActiveEncounters() {
    this.tourExecutionService.getActiveEncounters().subscribe((data:PagedResults<ActiveEncounter>)=>{
      this.activeEncounters = data.results;
    })
  }

  calculateDistance(latA: L.LatLng, latB: L.LatLng) {
    if (latA !== undefined && latB !== undefined) {
      let dis = latA.distanceTo(latB);
      return dis || 0;
    }
    else {
      return 0;
    }
  }

  async activateEncounter(event: EncounterMapMaterial) {
    const userId = this.authService.user$.value.id;
    for (let i = 0; i < this.encounters.length; i++) {
      const encounter = this.encounters[i];
      if (event.encounterId == encounter.id) {
        encounter.status = 0;
        this.tourExecutionService.updateEncounter(encounter).subscribe();
        this.tourExecutionService.postActiveEncounters({encounterId:encounter.id!,end:(new Date()),state:1,touristId:userId})
        this.activeEncounter = encounter
        this.getEncounters()
      }
    }
  }

  proveraLokacija(encounter: Encounter) {
    let allKeys:any = this.allStorage();
    let activePeopleList = []
    for (let i = 0; i < allKeys.length; i++) {
      const element = allKeys[i];
      if (element!.substring(0, 2) == '{"') {
        let userInfoParsed = JSON.parse(element!);
        var start: L.LatLng = new L.LatLng(userInfoParsed.latitude, userInfoParsed.longitude);
        var end: L.LatLng = new L.LatLng(encounter.latitude, encounter.longitude);
        if (encounter.range !== null && this.calculateDistance(start, end) < encounter.range) {
          activePeopleList.push(userInfoParsed.userId)
        } else {
          return false;
        }
      }
      return false;
    }
    if (encounter!.peopleCount! <= this.activePeopleList.length) {
      for (let i = 0; i < this.activeEncounters.length; i++) {
        let element = this.activeEncounters[i];
        for (let j = 0; j < this.activePeopleList.length; j++) {
          const userId = this.activePeopleList[j];
          if (element.encounterId == encounter.id && element.touristId == userId) {
            element.state = 1
            this.tourExecutionService.updateActiveEncounters(element).subscribe((data)=>{
              console.log(data);
            })
          }
        }
      }
    }
    return true;
  }
  
  allStorage() {
    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
    }

    return values;
  }


  ispisEncounters() {
    let tempEncounterMapMaterials: EncounterMapMaterial[] = []
    for (let i = 0; i < this.encounters.length; i++) {
      let isActive = false;
      let encounter = this.encounters[i];
      for (let i = 0; i < this.activeEncounters.length; i++) {
        const activeEncounter:ActiveEncounter = this.activeEncounters[i];
        if (encounter.id == activeEncounter.encounterId) {
          isActive = true;
        }
      }
      let encounterMapMaterial: EncounterMapMaterial = { lat: encounter.latitude, lng: encounter.longitude, activeCount: this.activePeopleList.length, isActive: isActive, encounterId: encounter.id }
      tempEncounterMapMaterials.push(encounterMapMaterial)
    }
    this.encounterMapMaterials = tempEncounterMapMaterials;
  }

  getEncounters() {
    this.tourExecutionService.getEncounters().subscribe((encounters: PagedResults<Encounter>) => {
      this.encounters = encounters.results;
      this.ispisEncounters();
    })
  }

  getCheckpoints() {
    let allPromises: Observable<any>[] = [];
    for (let i = 0; i < this.tour.checkPoints.length; i++) {
      const cpId = this.tour.checkPoints[i];
      let promise = this.tourAuthoringService.getCheckpointById(cpId)
      allPromises.push(promise);
    }
    let list = zip([...allPromises]);
    list.subscribe({
      next: (value) => {
        this.checkpointList = value;
      }, complete: async () => {
        await this.getMarkerList()
      }
    })
  }

  async getMarkerList() {
    for (let i = 0; i < this.checkpointList.length; i++) {
      const cp = this.checkpointList[i];
      let newMarker = new L.Marker([cp.latitude, cp.longitude])
      this.markerList.push(newMarker)
    }
    let userMarker = new L.Marker([this.touristPosition.latitude, this.touristPosition.longitude], { icon: this.userIcon })
    this.markerList.push(userMarker)
    this.markersReady = Promise.resolve(true);
  }

  updateTourExec(value: string) {
    if (value == 'complete') {
      this.tourExecution.Completed = true;
      this.tourExecution.EndTime = new Date();
      this.tourExecutionService.updateTourExecution(this.tourExecution).subscribe((value) => {
        const userId = this.authService.user$.value.id;
        localStorage.removeItem(userId.toString())
        this.router.navigate([''])
      })
    }
    else {
      this.tourExecution.Abandoned = true;
      this.tourExecution.EndTime = new Date();
      this.tourExecutionService.updateTourExecution(this.tourExecution).subscribe((value) => {
        const userId = this.authService.user$.value.id;
        localStorage.removeItem(userId.toString())
        this.router.navigate([''])
      })
    }
  }

  leaveReview() {
    // Assuming you have a route named '/leave-review', navigate to that route
    this.router.navigate(['/tour/' + this.tour.id]);
  }
}
