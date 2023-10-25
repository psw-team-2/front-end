import { Component, AfterViewInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  @Input() map: L.Map;
  @Input() enableClick: boolean = true; 
  @Input() coordinatesToDisplay: number[];
  @Output() coordinatesSelected: EventEmitter<number[]> = new EventEmitter<number[]>();
  
  marker: L.Marker;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.coordinatesToDisplay) {
      setTimeout((()=>{
        this.displayCoordinates(changes['coordinatesToDisplay'].currentValue)
      }),300);
    }
  }


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
    if (this.enableClick) {
      this.registerOnClick();
    }
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
    this.displayCoordinates(this.coordinatesToDisplay);
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      this.resetSelection();
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );
      this.marker = new L.Marker([lat, lng]).addTo(this.map);
      this.coordinatesSelected.emit([lat, lng]);
    });
  }

  resetSelection() {
    if (this.marker != null) {
      this.map.removeLayer(this.marker);
    }
  }

  displayCoordinates(coordinates:any): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = new L.Marker(coordinates).addTo(this.map);
    this.map.setView([coordinates[0],coordinates[1]], this.map.getZoom());
  }
}
