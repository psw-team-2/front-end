import { Component, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  @Input() map: L.Map;
  @Input() enableClick: boolean = true; 
  @Input() coordinatesToDisplay: number[] = [];
  @Output() coordinatesSelected: EventEmitter<number[]> = new EventEmitter<number[]>();
  
  marker: L.Marker;

  constructor() { }

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
    } else {
      this.displayCoordinates(this.coordinatesToDisplay);
    }
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
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

  displayCoordinates(coordinates: number[]): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    const [lat, lng] = coordinates;

    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.map.setView([lat, lng], this.map.getZoom());
  }
}
