import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { MapSearchService } from './map-search.service';

@Component({
  selector: 'xp-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.css']
})
export class MapSearchComponent {
  private map: any;
  private marker: any;
  private radius: any;
  private isAddingElements: boolean = false;
  private radiusSlider: HTMLInputElement;
  private radiusValueElement: HTMLDivElement;

  constructor(private mapService: MapSearchService) {}

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

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
    this.registerOnClick();
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      if (this.isAddingElements) {
        return;
      }

      this.isAddingElements = true;

      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      if (this.radius) {
        this.map.removeLayer(this.radius);
      }

      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
        this.marker = L.marker([lat, lng]).addTo(this.map);
        const initialRadiusMeters = 100;
        this.radius = L.circle([lat, lng], {
          radius: initialRadiusMeters,
          color: 'purple', // Change the circle color to purple
          fillColor: 'rgba(128,0,128,0.4)',
        }).addTo(this.map);

        // Create a radius slider element and add it to the marker's popup content
        this.radiusSlider = this.createRadiusSlider(initialRadiusMeters);
        this.radiusSlider.addEventListener('input', () => {
          this.updateRadius(parseFloat(this.radiusSlider.value));
        });

        // Create a radius value element
        this.radiusValueElement = this.createRadiusValueElement(initialRadiusMeters);

        // Bind a popup to the marker with the slider and radius value as its content
        const popupContent = document.createElement('div');
        popupContent.appendChild(this.radiusSlider);
        popupContent.appendChild(this.radiusValueElement);

        // Increase the popup size by adding a custom class
        const popup = L.popup({
          className: 'custom-popup',
        }).setContent(popupContent);

        this.marker.bindPopup(popup);
        this.marker.openPopup();

        this.isAddingElements = false;
      });
    });
  }

  createRadiusSlider(initialValue: number): HTMLInputElement {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '50';
    slider.max = '50000';
    slider.step = '100';
    slider.value = initialValue.toString();
    return slider;
  }

  createRadiusValueElement(initialValue: number): HTMLDivElement {
    const radiusValueElement = document.createElement('div');
    radiusValueElement.classList.add('slider-value');
    radiusValueElement.textContent = `Radius: ${initialValue} meters`;
    return radiusValueElement;
  }

  updateRadius(newRadius: number): void {
    this.radius.setRadius(newRadius);
    if (this.radiusValueElement) {
      this.radiusValueElement.textContent = `Radius: ${newRadius} meters`;
    }
  }
}
