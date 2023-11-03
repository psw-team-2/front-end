import { Component, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { forkJoin, of, Observable} from 'rxjs'; // Import the necessary RxJS operators
import { catchError } from 'rxjs/operators';
import { Checkpoint } from 'src/app/feature-modules/tour-authoring/model/checkpoint.model';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { MapSearchService } from './map-search.service';

const purpleMarker = "data:image/jpeg;base64,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"

@Component({
  selector: 'xp-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.css']
})
export class MapSearchComponent {
  @Input() tours: Tour[];
  @Output() searchResultsEvent = new EventEmitter<{ tours: Tour[], mapCleared: boolean }>();
  private map: any;
  private marker: any;
  private radius: any;
  private isAddingElements: boolean = false;
  private radiusSlider: HTMLInputElement;
  private radiusValueElement: HTMLDivElement;
  private searchResults: Tour[] = [];
  private routeControls: L.Routing.Control[] = [];
  private isSearchActive: boolean = false;


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
      if (this.isSearchActive) {
        // If a search is already active, remove it
        if (this.marker) {
          this.map.removeLayer(this.marker);
          this.clearRoutesAndCheckpoints();
        }
        if (this.radius) {
          this.map.removeLayer(this.radius);
        }
  
        this.isSearchActive = false;
      } else {
        this.isSearchActive = true;
  
        const coord = e.latlng;
  
        if (coord && coord.lat !== undefined && coord.lng !== undefined) {
          const lat = coord.lat;
          const lng = coord.lng;
  
          // Create the new search
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
          });
        } else {
          console.error('Invalid coordinate object:', coord);
        }
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
    this.clearRoutesAndCheckpoints();
    // Get the latitude and longitude of the clicked location
    const markerLatLng = this.marker.getLatLng();
    const clickedLat = markerLatLng.lat;
    const clickedLng = markerLatLng.lng;
  
    // Get the selected radius from the slider
    const selectedRadius = parseFloat(this.radiusSlider.value);
  
    this.searchResults = []; // Clear existing search results
  
    // Create an array of observables for fetching checkpoint data
    const checkpointObservables: Observable<Checkpoint | null>[] = [];
  
    this.tours.forEach((tour: Tour) => {
      tour.checkPoints.forEach((checkpointId) => {
        const checkpointObservable = this.checkpointService.getCheckpointById(checkpointId).pipe(
          catchError((error: any) => {
            console.error('Error fetching checkpoint:', error);
            return of(null); // Return a null value for the checkpoint in case of an error
          })
        );
        checkpointObservables.push(checkpointObservable);
      });
    });
  
    forkJoin(checkpointObservables).subscribe((checkpointData: (Checkpoint | null)[]) => {
      
      // Now you have an array of checkpoint data, some of which may be null in case of errors
  
      let checkpointIndex = 0;
  
      this.tours.forEach((tour: Tour) => {
        let tourHasMatchingCheckpoint = false;
  
        tour.checkPoints.forEach((checkpointId) => {
          const checkpoint = checkpointData[checkpointIndex];
  
          if (checkpoint) {
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
          }
  
          checkpointIndex++;
        });
  
        if (tourHasMatchingCheckpoint) {
          this.addTourToSearchResults(tour);
        }
      });
      
      this.setRoutes(this.searchResults);

    });

  }
  
  clearRoutesAndCheckpoints(): void {
    // Remove existing route controls from the map and clear the array
    this.routeControls.forEach((routeControl) => {
      this.map.removeControl(routeControl);
    });
    this.routeControls = [];
  
    // Clear the search results and any other related data
    this.searchResults = [];
  }
  
  setRoutes(tours: Tour[]): void {
    // Clear previous route controls
    this.clearRoutesAndCheckpoints();
  
    const routePromises: Promise<L.Routing.Control | undefined>[] = tours.map((tour, index) => {
      return new Promise((resolve) => {
        const checkpointPromises = tour.checkPoints.map((checkpointId) => {
          return this.checkpointService.getCheckpointById(checkpointId).toPromise();
        });
  
        Promise.all(checkpointPromises).then((resolvedCheckpoints) => {
          const validCheckpoints = resolvedCheckpoints.filter((checkpoint) => checkpoint);
  
          if (validCheckpoints.length > 0) {
            const waypointCoordinates = validCheckpoints.map((checkpoint) => {
              return L.latLng((checkpoint as Checkpoint).latitude, (checkpoint as Checkpoint).longitude);
            });
  
            if (waypointCoordinates.length < 2) {
              // Skip routes with fewer than 2 waypoints
              resolve(undefined);
            } else {
              const routeColor = this.getTourColor(index);
              const routeControl = L.Routing.control({
                waypoints: waypointCoordinates,
                router: L.Routing.mapbox('pk.eyJ1IjoiZGpucGxtcyIsImEiOiJjbG56Mzh3a2gwNWwzMnZxdDljdHIzNDIyIn0.iZjiPJJV-SgTiIOeF8UWvA', { profile: 'mapbox/walking' }),
                routeWhileDragging: false,
                lineOptions: {
                  styles: [{ color: routeColor, opacity: 0.8, weight: 6 }],
                  extendToWaypoints: true,
                  missingRouteTolerance: 100,
                },
              });
              resolve(routeControl);
            }
          } else {
            resolve(undefined);
          }
          
        });
      });
    });
  
    Promise.all(routePromises).then((routeControls) => {
      // Store the route controls in the array and add them to the map
      this.routeControls = routeControls.filter((control) => control !== undefined) as L.Routing.Control[];
      this.routeControls.forEach((routeControl) => {
        routeControl.addTo(this.map);
        
      });
          this.searchResultsEvent.emit({ tours: this.searchResults, mapCleared: this.isSearchActive });

    });
  }
  
  
  getTourColor(tourIndex: number): string {
    const colors = ['#FF0000', '#00FF00', '#0000FF']; // Define an array of colors
    return colors[tourIndex % colors.length]; // Use the tour index to select a color
  }
  
  showRoutes(routeControls: (L.Routing.Control | undefined)[]): void {
    const validRouteControls = routeControls.filter((control) => control !== undefined) as L.Routing.Control[];
    
    validRouteControls.forEach((routeControl) => {
      routeControl.addTo(this.map);
    });
  }
  
  

  addTourToSearchResults(tour: Tour): void {
    // Check if the tour is not already in the search results
    if (!this.searchResults.some((result) => result.id === tour.id)) {
      this.searchResults.push(tour);
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