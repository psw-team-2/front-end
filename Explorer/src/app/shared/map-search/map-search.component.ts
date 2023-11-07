
import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Checkpoint } from 'src/app/feature-modules/tour-authoring/model/checkpoint.model';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { MapSearchService } from './map-search.service';

@Component({
  selector: 'xp-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.css']
})
export class MapSearchComponent {
  @Input() tours: Tour[];
  private map: any;
  private marker: any;
  private radius: any;
  private isAddingElements: boolean = false;
  private radiusSlider: HTMLInputElement;
  private radiusValueElement: HTMLDivElement;
  private searchResults: Tour[] = [];

  constructor(
    private mapService: MapSearchService,
    private checkpointService: TourAuthoringService
  ) {}

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
  
      if (coord && coord.lat !== undefined && coord.lng !== undefined) {
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
            color: 'purple',
            fillColor: 'rgba(128,0,128,0.4)',
          }).addTo(this.map);
  
          // Create a radius slider element
          this.radiusSlider = this.createRadiusSlider(initialRadiusMeters);
          this.radiusSlider.addEventListener('input', () => {
            this.updateRadius(parseFloat(this.radiusSlider.value));
          });
  
          // Create a radius value element
          this.radiusValueElement = this.createRadiusValueElement(initialRadiusMeters);
  
          // Bind a popup to the marker
          this.createAndBindPopup(this.marker, initialRadiusMeters);
  
          this.isAddingElements = false;
        });
      } else {
        console.error('Invalid coordinate object:', coord);
      }
    });
  }
  

  createAndBindPopup(marker: L.Marker, initialRadius: number): void {
    // Create a popup content element
    const popupContent = document.createElement('div');
    popupContent.appendChild(this.radiusSlider);
    popupContent.appendChild(this.radiusValueElement);
    popupContent.appendChild(this.createSearchButton());

    // Increase the popup size by adding a custom class
    const popup = L.popup({
      className: 'custom-popup',
    }).setContent(popupContent);

    // Bind the popup to the marker
    marker.bindPopup(popup);
    marker.openPopup();
  }

  createSearchButton(): HTMLButtonElement {
    const searchButton = document.createElement('button');
    searchButton.innerHTML = '<i class="fa fa-search"></i>';

    // Add a click event handler to the search button
    searchButton.addEventListener('click', () => {
      this.handleSearchButtonClick();
    });

    return searchButton;
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
    // Create the radius value element
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

  handleSearchButtonClick(): void {
    // Get the latitude and longitude of the clicked location
    const markerLatLng = this.marker.getLatLng();
    const clickedLat = markerLatLng.lat;
    const clickedLng = markerLatLng.lng;
  
    // Get the selected radius from the slider
    const selectedRadius = parseFloat(this.radiusSlider.value);
  
    this.searchResults = []; // Clear existing search results

    this.tours.forEach((tour: Tour) => {
      let tourHasMatchingCheckpoint = false;

      tour.checkPoints.forEach((checkpointId) => {
        this.checkpointService.getCheckpointById(checkpointId).subscribe(
          (checkpoint) => {
            // Calculate the distance between the clicked location and the checkpoint
            const distance = this.calculateDistance(
              clickedLat,
              clickedLng,
              checkpoint.latitude,
              checkpoint.longitude
            );

            if (distance <= selectedRadius) {
              // If a checkpoint is within the radius, mark this tour and break the loop
              tourHasMatchingCheckpoint = true;
            }
          },
          (error) => {
            console.error('Error fetching checkpoint:', error);
          },
          () => {
            // After fetching a checkpoint, check if the tour has a matching checkpoint
            if (tourHasMatchingCheckpoint) {
              this.addTourToSearchResults(tour);
            }
          }
        );
      });
    });
  }

  addTourToSearchResults(tour: Tour): void {
    // Check if the tour is not already in the search results
    if (!this.searchResults.some((result) => result.id === tour.id)) {
      this.searchResults.push(tour);
      console.log(tour);
    }
  }
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const earthRadiusKm = 6371;

    const lat1Rad = this.degreesToRadians(lat1);
    const lat2Rad = this.degreesToRadians(lat2);
    const latDiff = this.degreesToRadians(lat2 - lat1);
    const lngDiff = this.degreesToRadians(lng2 - lng1);

    const a =
      Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c * 1000; // Convert to meters
  }

  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}