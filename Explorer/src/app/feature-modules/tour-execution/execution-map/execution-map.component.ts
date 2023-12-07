import { Component, AfterViewInit, Input, Output, EventEmitter, SimpleChanges, OnInit, } from '@angular/core';
import * as L from 'leaflet';
import { Marker } from 'leaflet';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { TourExecutionService } from '../tour-execution.service';
import { TourExecution } from '../model/tourexecution.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Router } from '@angular/router';
import { Secret } from '../model/secret.model';
import { Encounter, EncounterMapMaterial } from '../../challenges/model/encounter.model';
@Component({
  selector: 'execution-map',
  templateUrl: './execution-map.component.html',
  styleUrls: ['./execution-map.component.css'],
})
export class ExecutionMapComponent implements OnInit {
  @Input() map: L.Map;
  @Input() markerList: Marker[];
  @Input() checkpoints: Checkpoint[] = [];
  @Input() tourExecution: TourExecution;
  @Input() activeTour: Tour;
  @Input() secretList:Secret[];
  @Input() encounters:Encounter[];
  @Output() activateEncounter = new EventEmitter();

  inputList: { lat: number; lng: number }[] = [];
  finishedCheckpoints: { lat: number; lng: number }[] = [];
  marker: L.Marker;
  private routeControlInitial: any;
  distance:any;
  completedCheckpointsDistance: number;
  @Input() encounterMapMaterials:EncounterMapMaterial[];

  constructor(private authService: AuthService, private service : TourExecutionService, private tourService: TourAuthoringService,private router:Router) { }

  public userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3710/3710297.png',
    shadowUrl: '',

    iconSize: [40, 45],
    iconAnchor: [15, 35],
  });
  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

  }
  ngOnChanges(changes: SimpleChanges) {
    this.putToolTips(changes['encounterMapMaterials'].currentValue);
    
    
}

  async ngOnInit(): Promise<void> {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconSize: [20, 36],
      iconAnchor: [5, 36],
      popupAnchor: [0, -25],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
    for (let i = 0; i < this.markerList.length; i++) {
      let marker:L.Marker = this.markerList[i];

      const lat = marker.getLatLng().lat;
      const lng = marker.getLatLng().lng;
      this.inputList.push({lat,lng})
    }
    this.setRouteInitial(this.inputList)
    for (let i = 0; i < this.tourExecution.visitedCheckpoints.length; i++) {
      let cp:number = this.tourExecution.visitedCheckpoints[i];
      await this.service.getSecrets(cp).subscribe((value)=>{
        let newIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
          iconSize: [20, 36],
          iconAnchor: [5, 36],
          popupAnchor: [0, -25],
        });
        this.markerList[i].setIcon(newIcon)
        this.markerList[i].addTo(this.map)
        this.markerList[i].bindPopup("<strong>Tajna je otkljucana</strong><br />"+value.text, {maxWidth: 500});
      })
    }
    let tempActivateEncounters: EncounterMapMaterial[] = []
    for (let i = 0; i < this.encounterMapMaterials.length; i++) {
      const element = this.encounterMapMaterials[i];
      if (element.isActive) {
        var encounterMarker = new L.Marker([element.lat, element.lng], { opacity: 0.01 }); //opacity may be set to zero
        encounterMarker.bindTooltip(element.activeCount.toString(), {permanent: true, className: "my-label", offset: [0, 0] });
        encounterMarker.addTo(this.map);
      }
      else {
        var encounterMarker = new L.Marker([element.lat, element.lng], { opacity: 0.01, });
        encounterMarker.bindTooltip('Aktiviraj izazov!', {direction:'top',permanent: true, className: "aktiviraj", offset: [5, -30]},);
        encounterMarker.addTo(this.map);
        tempActivateEncounters.push(element)
      }
    }
    let docs:HTMLCollectionOf<Element> = document.getElementsByClassName('aktiviraj');
    for (let k = 0; k < docs.length; k++) {
      const element = docs[k] as HTMLDivElement;
      element.style.pointerEvents = 'auto'
      element.style.cursor = 'pointer'
      element.addEventListener('click', (event)=> {
        element.remove()
        this.activateEncounter.emit(this.encounterMapMaterials[k]);
        //aktiviraj turu
     });
    }
    window.setInterval(()=>{
      if (this.router.url !== '/activeTour') {
        return;
      }
      this.finishedCheckpoints = [];
 
      for (let i = 0; i < this.checkpoints.length; i++) {
        
        const checkpoint = this.checkpoints[i];
        if(this.tourExecution.visitedCheckpoints.includes(checkpoint.id || -1))
        {
          const lat = checkpoint.latitude;
          const lng = checkpoint.longitude;
          this.finishedCheckpoints.push({lat,lng})
        }

        if(i === this.checkpoints.length -1)
        {
          this.completedCheckpointsDistance = this.calculateCompletedCheckpointsDistance();
          console.log("Current completed distance is " + this.completedCheckpointsDistance + "/ " + this.distance + ", which is " + 110 * this.completedCheckpointsDistance/this.distance + "%");

        }
      }

      let id = this.authService.user$.value.id;
      let touristPositionRaw = localStorage.getItem(id.toString()) || '';
      let touristPosition = JSON.parse(touristPositionRaw);
      let userMarker = new L.Marker([touristPosition.latitude, touristPosition.longitude], { icon: this.userIcon })
      if (userMarker !== this.markerList[this.markerList.length - 1]) {
        this.markerList[this.markerList.length - 1].removeFrom(this.map)
        this.markerList[this.markerList.length - 1].remove()
        this.markerList.push(userMarker)
        userMarker.addTo(this.map)
      }
      this.tourExecution.CurrentLatitude = touristPosition.latitude;
      this.tourExecution.CurrentLongitude = touristPosition.longitude;
      this.service.updateTourExecution(this.tourExecution).subscribe({
        next: (value) => {
          this.service.completeCheckpoint(id, this.checkpoints).subscribe((value) => {
              if (value == null) {
                return;
              }
              this.tourExecution.visitedCheckpoints = value.visitedCheckpoints;
              this.tourExecution.LastActivity = value.LastActivity;
              this.tourExecution.touristDistance = this.completedCheckpointsDistance;
              this.service.updateTourExecution(value).subscribe();
          });
        },
        error: () => {

        },
      });

    }, 10000)
  }
  putToolTips(encounterMapMaterials:EncounterMapMaterial[]) {
    if (encounterMapMaterials.length !== 0) {
      let tempActivateEncounters: EncounterMapMaterial[] = []
      for (let i = 0; i < encounterMapMaterials.length; i++) {
        const element = encounterMapMaterials[i];
        if (element.isActive) {
          var encounterMarker = new L.Marker([element.lat, element.lng], { opacity: 0.01 }); //opacity may be set to zero
          encounterMarker.bindTooltip(element.activeCount.toString(), {permanent: true, className: "my-label", offset: [0, 0] });
          encounterMarker.addTo(this.map);
        }
        else {
          var encounterMarker = new L.Marker([element.lat, element.lng], { opacity: 0.01, });
          encounterMarker.bindTooltip('Aktiviraj izazov!', {direction:'top',permanent: true, className: "aktiviraj", offset: [5, -30]},);
          encounterMarker.addTo(this.map);
          tempActivateEncounters.push(element)
        }
      }
      let docs:HTMLCollectionOf<Element> = document.getElementsByClassName('aktiviraj');
      for (let k = 0; k < docs.length; k++) {
        const element = docs[k] as HTMLDivElement;
        element.style.pointerEvents = 'auto'
        element.style.cursor = 'pointer'
        element.addEventListener('click', (event)=> {
          element.remove()
          this.activateEncounter.emit(encounterMapMaterials[k]);
          //aktiviraj turu
       });
      }
      this.map.invalidateSize(); 
    }


  }
/*   addMarkers(list: any) {
    const markerGroup = L.layerGroup();
    for (let i = 0; i < list.length; i++) {
      const checkpoint = list[i];
      let newMarker = new L.Marker(L.latLng(checkpoint[0], checkpoint[1]))
      newMarker.addTo(markerGroup)
      markerGroup.addTo(this.map);
    }
    markerGroup.addTo(this.map)
  } */
  calculateCompletedCheckpointsDistance(): number {
    const completedCheckpointsCoordinates = this.finishedCheckpoints;
  
    if (completedCheckpointsCoordinates.length < 2) {
      // At least two completed checkpoints are needed to calculate distance
      return 0;
    }
  
    let totalDistance = 0;
  
    for (let i = 0; i < completedCheckpointsCoordinates.length - 1; i++) {
      const waypoint1 = L.latLng(completedCheckpointsCoordinates[i].lat, completedCheckpointsCoordinates[i].lng);
      const waypoint2 = L.latLng(completedCheckpointsCoordinates[i + 1].lat, completedCheckpointsCoordinates[i + 1].lng);
  
      // Calculate distance between consecutive checkpoints and accumulate
      totalDistance += waypoint1.distanceTo(waypoint2);
    }
  
    return totalDistance;
  }
  setRouteInitial(markers: { lat: number; lng: number }[]): void {
    // Extract waypoints from the list of markers
    const waypoints = markers.map(marker => L.latLng(marker.lat, marker.lng));
  
    // Store the route control in the class variable
    this.routeControlInitial = L.Routing.control({
      waypoints: waypoints,
      router: L.routing.mapbox('pk.eyJ1IjoiZGpucGxtcyIsImEiOiJjbG56Mzh3a2gwNWwzMnZxdDljdHIzNDIyIn0.iZjiPJJV-SgTiIOeF8UWvA', { profile: 'mapbox/walking' })
    }).addTo(this.map);
  
    // Listen for the routesfound event
    this.routeControlInitial.on('routesfound', (e:  any) => {
      const routes = e.routes;
      const summary = routes[0].summary;
  
      // Access the total distance and store it in a variable for later use
      this.distance = this.activeTour.totalLength
    });
  }


}





