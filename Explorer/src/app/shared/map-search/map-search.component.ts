import { Component, AfterViewInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { forkJoin, of, Observable} from 'rxjs'; // Import the necessary RxJS operators
import { catchError } from 'rxjs/operators';
import { Checkpoint } from 'src/app/feature-modules/tour-authoring/model/checkpoint.model';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { MapSearchService } from './map-search.service';
import { Object } from 'src/app/feature-modules/tour-authoring/model/object.model';
import { Encounter } from 'src/app/feature-modules/challenges/model/encounter.model';
import { EncounterService } from 'src/app/feature-modules/challenges/encounter.service';
import { TouristService } from 'src/app/feature-modules/tourist/tourist.service';
import { PagedResults } from '../model/paged-results.model';


@Component({
  selector: 'xp-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.css']
})
export class MapSearchComponent {
  @Input() tours: Tour[];
  @Output() searchResultsEvent = new EventEmitter<{ tours: Tour[], searchActive: boolean }>();
  @Input() isActiveTourSearchActive: boolean;
  private map: any;
  private marker: any;
  private radius: any;
  private isAddingElements: boolean = false;
  private radiusSlider: HTMLInputElement;
  private radiusValueElement: HTMLDivElement;
  private searchResults: Tour[] = [];
  private checkpointSearchResults: Checkpoint[] = [];
  private objectSearchResults : Object[]=[]; 
  private encounterSearchResults : Encounter[] = [];
  private routeControls: L.Routing.Control[] = [];
  private isSearchActive: boolean = false;
  private encounters: Encounter[] = [];
  private activeSearchResult: Tour[] = []
  
  private objects: Object[] = [
    { id:1,
      name: 'Restroom 1',
      description: 'Restroom at location 1',
      image: 'https://media.cnn.com/api/v1/images/stellar/prod/200619190852-public-restroom-coronavirus.jpg?q=x_30,y_106,h_874,w_1554,c_crop/h_720,w_1280',
      category: 1,
      latitude: 45.2400, // Replace with actual latitude
      longitude: 19.8210,
      isPublic:true,  // Replace with actual longitude
    },
    { id:2,
      name: 'Restaurant 1',
      description: 'Restaurant at location 1',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl-WAwtX-kFdN4fiFJJ6IaHzVcAASJZPAUxw&usqp=CAU',
      category: 2,
      latitude: 45.2390, // Replace with actual latitude
      longitude: 19.8230,
      isPublic:true, // Replace with actual longitude
    },
    { id:3,
      name: 'Parking 1',
      description: 'Parking at location 1',
      image: 'https://www.parkingns.rs/wp-content/uploads/2023/07/IMG_9491.jpg',
      category: 3,
      latitude: 45.2380, // Replace with actual latitude
      longitude: 19.8215,
      isPublic:false,  // Replace with actual longitude
    },
    { id:4,
      name: 'Other 1',
      description: 'Other facility at location 1',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNHtp5f_rI48vPpi1kIsPcTcDVZHpcWOT7UQ&usqp=CAU',
      category: 4,
      latitude: 45.2410, // Replace with actual latitude
      longitude: 19.8225,
      isPublic:true,  // Replace with actual longitude
    },

    // Add more objects with different categories
  ];
  



  @Input() selectedTour: Tour | null;

  constructor(
    private mapService: MapSearchService,
    private checkpointService: TourAuthoringService,
    private encounterService: EncounterService,
    private tourService: TourAuthoringService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('selectedTour' in changes) {
      this.setRoutes(this.searchResults,this.objectSearchResults,this.checkpointSearchResults)
    }
  }
  
  private initMap(): void {
    this.encounterService.getEncounters().subscribe({
      next: (result) => {
        this.encounters = result.results;
      }
    })
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
          this.searchResults = [];
          this.objectSearchResults=[];
          this.checkpointSearchResults=[];
          this.selectedTour = null;
          this.searchResultsEvent.emit({ tours: this.searchResults, searchActive: false });

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
        checkpointObservables.push(checkpointObservable);console.log(checkpointObservable)
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

            if(checkpoint.isPublic && distance <= selectedRadius)
            {
              this.addPublicCheckpointToSearchResults(checkpoint);
            }





          }
  
          checkpointIndex++;
        });
  
        if (tourHasMatchingCheckpoint) {
          this.addTourToSearchResults(tour);
        }
      });



      if (this.isActiveTourSearchActive) {
        const tourIds: (number | undefined)[] = this.searchResults.map((tour: Tour) => tour.id);
        
        if (tourIds.every(Boolean)) {
          this.tourService.getActiveTours(tourIds).subscribe(
            (pagedResults: PagedResults<Tour>) => {
              this.searchResults = pagedResults.results; 
            },
            error => {
              console.error('Error:', error);
            }
          );
        } 
      }
      
      

      
    

      this.encounters.forEach((encounter: Encounter) => {
        
        const distance = this.calculateDistance(
          clickedLat,
          clickedLng,
          encounter.latitude,
          encounter.longitude
        );

        if (distance <= selectedRadius) {
          this.addEncounterToSearchResults(encounter);
        }
      });

      this.objects.forEach((object:Object) =>
      {
        const distance = this.calculateDistance(
          clickedLat,
          clickedLng,
          object.latitude,
          object.longitude
        );




          if(object.isPublic && distance <= selectedRadius)
          {
            this.addPublicObjectToSearchResults(object);
          }
      });

      this.setRoutes(this.searchResults,this.objectSearchResults,this.checkpointSearchResults);


    });

    this.objects.forEach((object:Object) =>
      {
        const distance = this.calculateDistance(
          clickedLat,
          clickedLng,
          object.latitude,
          object.longitude
        );




          if(object.isPublic && distance <= selectedRadius)
          {
            this.addPublicObjectToSearchResults(object);
          }
      });

      this.setRoutes(this.searchResults,this.objectSearchResults,this.checkpointSearchResults);
  }
  
  clearRoutesAndCheckpoints(): void {
    // Remove existing route controls from the map and clear the array
    this.routeControls.forEach((routeControl) => {
      this.map.removeControl(routeControl);

    });
    this.routeControls = [];
    this.objectSearchResults=[];
    this.checkpointSearchResults=[];
    this.encounterSearchResults = [];
    // Clear the search results and any other related data
    //this.searchResults = [];
  }
  





  setRoutes(tours: Tour[], objects: Object[], checkpoints: Checkpoint[]): void {
    // Clear previous route controls and markers
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
              const routeColor = this.getTourColor(tour.id);
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
  
              if (this.selectedTour !== undefined && tour.id === this.selectedTour?.id) {
                const bounds = L.latLngBounds(waypointCoordinates);
                this.map.fitBounds(bounds);
              }
            }
          } else {
            resolve(undefined);
          }
        });
      });
    });
  
    Promise.all(routePromises).then((routeControls) => {
      this.searchResultsEvent.emit({ tours: this.searchResults, searchActive: this.isSearchActive });
  
      // Store the route controls in the array and add them to the map
      this.routeControls = routeControls.filter((control) => control !== undefined) as L.Routing.Control[];
      this.routeControls.forEach((routeControl) => {
        routeControl.addTo(this.map);
      });
  
      // Prikaz objekata
      objects.forEach((object) => {
        const objectMarker = L.marker([object.latitude, object.longitude])
          .bindPopup(`Object: ${object.name}`)
          .addTo(this.map);
        // Dodajte dodatne postavke ili informacije o markeru po potrebi
      });
  
      // Prikaz checkpointa
      checkpoints.forEach((checkpoint) => {
        const checkpointMarker = L.marker([checkpoint.latitude, checkpoint.longitude])
          .bindPopup(`Checkpoint: ${checkpoint.name}`)
          .addTo(this.map);
        // Dodajte dodatne postavke ili informacije o markeru po potrebi
      });
    });
  }
  
  
  getTourColor(tourIndex?: number): string {

    if(this.selectedTour?.id === tourIndex)
    {
      return "#B855D4";      
    }
    return "#4C4E52";
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

  private publicCheckpointIcon = L.icon({
    iconUrl: 'https://i.imgur.com/kkMoydC.jpg',
    iconSize: [48, 48], 
    // ... (ostale opcije ikonice za javni checkpoint)
  });
  

  addPublicCheckpointToSearchResults(checkpoint: Checkpoint): void {
    // Check if the checkpoint is not already in the search results
    if (!this.checkpointSearchResults.some((result) => result.id === checkpoint.id)) {
      this.checkpointSearchResults.push(checkpoint);
  
      // Dodajte marker na mapu sa odgovarajućom ikonicom samo za javne checkpointe
      const markerIcon = checkpoint.isPublic ? this.publicCheckpointIcon : L.Marker.prototype.options.icon;
  
      const marker = L.marker([checkpoint.latitude, checkpoint.longitude], {
        icon: markerIcon,
      }).bindPopup(`Checkpoint: ${checkpoint.name}`).addTo(this.map);
  
      // Dodajte dodatne postavke ili informacije o markeru po potrebi
    }
  }
  
  addPublicObjectToSearchResults(object: Object): void {
    // Check if the tour is not already in the search results
    if (!this.objectSearchResults.some((result) => result.id === object.id)) {
      this.objectSearchResults.push(object);
    }
  }

  addEncounterToSearchResults(encounter: Encounter): void {
    if (!this.encounterSearchResults.some((result) => result.id === encounter.id)) {
      this.encounterSearchResults.push(encounter);

      const markerIcon = L.Marker.prototype.options.icon;
  
      const marker = L.marker([encounter.latitude, encounter.longitude], {
        icon: markerIcon,
      }).bindPopup(`Encounter: ${encounter.name}`).addTo(this.map);
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