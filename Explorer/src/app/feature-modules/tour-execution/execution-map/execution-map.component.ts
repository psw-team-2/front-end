import { Component, AfterViewInit, Input, Output, EventEmitter, SimpleChanges, OnInit,} from '@angular/core';
import * as L from 'leaflet';
import { Marker } from 'leaflet';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
@Component({
  selector: 'execution-map',
  templateUrl: './execution-map.component.html',
  styleUrls: ['./execution-map.component.css'],
})
export class ExecutionMapComponent implements OnInit {
  @Input() map: L.Map;
  @Input() markerList:Marker[];
  
  marker: L.Marker;


  constructor(private authService: AuthService) { }

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
    }
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


}

