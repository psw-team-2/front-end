import { Component, AfterViewInit, Input, Output, EventEmitter, SimpleChanges, OnInit,} from '@angular/core';
import * as L from 'leaflet';
import { Marker } from 'leaflet';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { TourExecutionService } from '../tour-execution.service';
import { TourExecution } from '../model/tourexecution.model';
@Component({
  selector: 'execution-map',
  templateUrl: './execution-map.component.html',
  styleUrls: ['./execution-map.component.css'],
})
export class ExecutionMapComponent implements OnInit {
  @Input() map: L.Map;
  @Input() markerList:Marker[];
  @Input() checkpoints: Checkpoint[] = [];
  @Input() tourExecution: TourExecution;
  
  inputList: { lat: number; lng: number }[] = [];

  marker: L.Marker;


  constructor(private authService: AuthService, private service : TourExecutionService) { }

  public userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3710/3710297.png',
    shadowUrl: '',

    iconSize:     [40, 45], // size of the icon
    iconAnchor:   [40, 45], // point of the icon which will correspond to marker's location
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

/*   ngOnChanges(changes:SimpleChanges) {
    this.markerList = changes['markerList'].currentValue
  } */


  ngOnInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });
    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
    for (let i = 0; i < this.markerList.length; i++) {
      const marker = this.markerList[i];
      marker.addTo(this.map);
      const lat = marker.getLatLng().lat;
      const lng = marker.getLatLng().lng;
      this.inputList.push({lat,lng})
          }
    this.setRoute(this.inputList)
    window.setInterval(()=>{
      let id = this.authService.user$.value.id;
      let touristPositionRaw = localStorage.getItem(id.toString()) || '';
      let touristPosition = JSON.parse(touristPositionRaw);
      let userMarker = new L.Marker([touristPosition.latitude,touristPosition.longitude],{icon:this.userIcon})
      if (userMarker !== this.markerList[this.markerList.length-1]) {
        this.markerList[this.markerList.length-1].removeFrom(this.map)
        this.markerList[this.markerList.length-1].remove()
        this.markerList.push(userMarker)
        userMarker.addTo(this.map)
      } 
      this.tourExecution.CurrentLatitude = touristPosition.latitude;
      this.tourExecution.CurrentLongitude = touristPosition.longitude;
      this.service.updateTourExecution(this.tourExecution).subscribe()
    },10000)
  }

  addMarkers(list:any){
    const markerGroup = L.layerGroup();
    for (let i = 0; i < list.length; i++) {
      const checkpoint = list[i];
      let newMarker = new L.Marker(L.latLng(checkpoint[0], checkpoint[1]))
      newMarker.addTo(markerGroup)
      markerGroup.addTo(this.map);
    }
    markerGroup.addTo(this.map)
  }
  setRoute(markers: { lat: number; lng: number }[]): void {
    // Extract waypoints from the list of markers
    const waypoints = markers.map(marker => L.latLng(marker.lat, marker.lng));
  
    const routeControl = L.Routing.control({
      waypoints: waypoints,
      router: L.routing.mapbox('pk.eyJ1IjoiZGpucGxtcyIsImEiOiJjbG56Mzh3a2gwNWwzMnZxdDljdHIzNDIyIn0.iZjiPJJV-SgTiIOeF8UWvA', {profile: 'mapbox/walking'})
    }).addTo(this.map);
  
    routeControl.on('routesfound', function(e) {
      var routes = e.routes;
      var summary = routes[0].summary;
    });
  }
  

}





