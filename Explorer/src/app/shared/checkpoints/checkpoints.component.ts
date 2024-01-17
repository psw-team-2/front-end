import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { forkJoin } from 'rxjs';
import { Checkpoint } from 'src/app/feature-modules/tour-authoring/model/checkpoint.model';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { CheckpointModalComponent } from '../checkpoint-modal/checkpoint-modal.component';
import { MapService } from '../map/map.service';


@Component({
  selector: 'xp-checkpoints',
  templateUrl: './checkpoints.component.html',
  styleUrls: ['./checkpoints.component.css']
})
export class CheckpointsComponent {
  @ViewChild('fileInput') fileInput: ElementRef;
  private map: any;
  currentLatitude: number;
  currentLongitude: number;
  checkpoints: Checkpoint[] = [];
  addMarker: boolean = false;
  tourName: string;
  tourDescription: string;
  tourDifficulty: number;
  tourPrice: number;
  tourPoint: number;
  selectedFile: File;
  imageSrc: string = 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
  imagePath: string = 'https://localhost:44333/Images/';
  user: User;
  checkpointIds : number[] =  []
  constructor(private mapService: MapService, private dialog: MatDialog, private authService: AuthService, private tourService: TourAuthoringService, private router: Router) {}

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

    this.authService.user$.subscribe((user) => {
      this.user = user
    });


    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
    this.registerOnClick()
  }
  search(): void {
    this.mapService.search('Strazilovska 19, Novi Sad').subscribe({
      next: (result) => {
        console.log(result);
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup('Pozdrav iz Strazilovske 19.')
          .openPopup();
      },
      error: () => {},
    });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
        this.currentLatitude = lat;
        this.currentLongitude = lng;

        console.log(lat + "and" + lng)
      });

      this.openCheckpointModal();

      if(this.addMarker){
        const mp = new L.Marker([lat, lng]).addTo(this.map);
      }

    });
  }
private addLabelToPopupContent(categoryLabel: string, imageSrc: string, name: string, location: string) {
  const popupContent = `
    <div style="
      text-align: center;
    ">
      <table style="
        width: 100%;
        text-align: center;
        border-spacing: 5px;
      ">
        <tr>
          <td colspan="2" style="
            background-color: rgb(56, 28, 117);
            color: white;
            font-weight: bold;
            padding: 5px;
          ">
            ${categoryLabel}
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <img src="${imageSrc}" style="max-width: 100%; max-height: 100%;" />
          </td>
        </tr>
        <tr>
          <td colspan="2" style="
            font-weight: bold;
            font-size: 18px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ">
            ${name}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ">
            ${location}
          </td>
        </tr>
      </table>
    </div>
  `;

  // Set a fixed maximum width for the popup
  const maxPopupWidth = 350; // Adjust the width as needed
  return `<div style="max-width: ${maxPopupWidth}px;">${popupContent}</div>`;
}

  private async setRoute(checkpoints: Checkpoint[]): Promise<void> {
    return new Promise<void>((resolve) => {
      const waypointCoordinates = checkpoints.map(checkpoint => {
        return L.latLng(checkpoint.latitude, checkpoint.longitude);
      });
  
      const routeControl = L.Routing.control({
        waypoints: waypointCoordinates,
        router: L.Routing.mapbox('pk.eyJ1IjoiZGpucGxtcyIsImEiOiJjbG56Mzh3a2gwNWwzMnZxdDljdHIzNDIyIn0.iZjiPJJV-SgTiIOeF8UWvA', { profile: `mapbox/walking` }),
        routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: 'rgb(56, 28, 117)', opacity: 1, weight: 5 }]
          // You can customize color, opacity, and weight as needed
        } as L.Routing.LineOptions, // Add this type assertion
      }).addTo(this.map);
      routeControl.hide();
      const markerGroup = L.layerGroup();
  
      routeControl.on('routesfound', (e) => {
        const routes = e.routes;
      
        checkpoints.forEach((checkpoint, index) => {
          
          this.mapService.reverseSearch(checkpoint.latitude, checkpoint.longitude).subscribe((res) => {
              const street = res.address.road || res.address.street;
              const number = res.address.house_number;
              const city = res.address.city_district || res.address.city || res.address.town || res.address.village || res.address.suburb;
              const location = `${street} ${number}, ${city}`;
  
          const popupContent = this.addLabelToPopupContent((index+1).toString(), checkpoint.image, checkpoint.name, location); // Customize the content as needed
          const marker = L.marker([checkpoint.latitude, checkpoint.longitude])
            .bindPopup(popupContent)
            .addTo(markerGroup);
      
          marker.on('mouseover', (event) => {
            marker.openPopup();
          });
      
          marker.on('mouseout', (event) => {
            marker.closePopup();
          });
        });
      });
      
        markerGroup.addTo(this.map);
  
  
        resolve();
      });
    });
  }

  openCheckpointModal(): void {
    const dialogRef = this.dialog.open(CheckpointModalComponent);

    dialogRef.componentInstance.saveClicked.subscribe((result: { name: string, description: string, image: string }) => {
      this.addMarker = false;
      if(result.name && result.description){
      const newCheckpoint: Checkpoint = {
        name: result.name,
        description: result.description,
        longitude: this.currentLongitude,
        latitude: this.currentLatitude,
        image: result.image,
        isPublic: false,
      };
      this.addMarker = true;
      this.checkpoints.push(newCheckpoint)
      this.setRoute(this.checkpoints)
    }
    });

  }

  createTour(): void {
    const checkpointRequests = this.checkpoints.map(checkpoint =>
      this.tourService.addCheckpoint(checkpoint)
    );
  
    // Use forkJoin to wait for all checkpoint requests to complete
    forkJoin(checkpointRequests)
      .subscribe(
        checkpointResults => {
          // checkpointResults is an array of results from each checkpoint request
          checkpointResults.forEach(result => {
            this.checkpointIds.push(result.id || 1);
            console.log('Checkpoint added successfully:', result);
          });
  
          // After all checkpoints are saved, create the tour
          const newTour: Tour = {
            name: this.tourName,
            description: this.tourDescription,
            status: 0,
            difficulty: this.tourDifficulty,
            tags: [],
            checkPoints: this.checkpointIds.sort((a, b) => a - b), // Sort checkpointIds in ascending order
            equipment: [],
            objects: [],
            totalLength: 0,
            footTime: 0,
            bicycleTime: 0,
            carTime: 0,
            authorId: this.user.id,
            publishTime: new Date().toISOString(),
            price: this.tourPrice,
            points: this.tourPoint,
            image: this.imagePath,
          };
  
          // Now, create the tour after all checkpoints are saved
          this.tourService.addTour(newTour)
            .subscribe(
              tourResult => {
                // Handle successful response if needed
                console.log('Tour added successfully:', tourResult);

                this.router.navigate(['/view-tours-author']);
              },
              tourError => {
                // Handle error if needed
                console.error('Error adding tour:', tourError);
              }
            );
        },
        error => {
          // Handle error if any of the checkpoint requests fail
          console.error('Error adding checkpoints:', error);
        }
      );
      this.tourService.upload(this.selectedFile).subscribe({
        next: (value) => {
  
        },
        error: (value) => {
  
        }, complete: () => {
        },
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      // Create a URL for the selected file
      this.imageSrc = window.URL.createObjectURL(this.selectedFile);
      this.imagePath = 'https://localhost:44333/Images/' +  this.selectedFile.name
    }
  }
  uploadFile(): void {
    // Trigger click on the hidden file input
    if (this.fileInput) {
      const fileInput = this.fileInput.nativeElement as HTMLInputElement;
      fileInput.click();
    }
  }
}
