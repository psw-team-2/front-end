import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import { Checkpoint } from 'src/app/feature-modules/tour-authoring/model/checkpoint.model';
import { MapViewService } from './map-view.service';
import 'leaflet-routing-machine';
import { Object } from 'src/app/feature-modules/tour-authoring/model/object.model';
import { TourAuthoringService } from '../../feature-modules/tour-authoring/tour-authoring.service';
import { Tour } from '../../feature-modules/tour-authoring/model/tour.model';

@Component({
  selector: 'xp-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements AfterViewInit {
  @Input() loadedCheckpoints: Checkpoint[];
  @Input() loadedTour: Tour;
  private map: any;
  private objects: Object[] = [
    {
      name: 'Restroom 1',
      description: 'Restroom at location 1',
      image: 'https://media.cnn.com/api/v1/images/stellar/prod/200619190852-public-restroom-coronavirus.jpg?q=x_30,y_106,h_874,w_1554,c_crop/h_720,w_1280',
      category: 1,
      latitude: 45.2400, // Replace with actual latitude
      longitude: 19.8210, // Replace with actual longitude
    },
    {
      name: 'Restaurant 1',
      description: 'Restaurant at location 1',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl-WAwtX-kFdN4fiFJJ6IaHzVcAASJZPAUxw&usqp=CAU',
      category: 2,
      latitude: 45.2390, // Replace with actual latitude
      longitude: 19.8230, // Replace with actual longitude
    },
    {
      name: 'Parking 1',
      description: 'Parking at location 1',
      image: 'https://www.parkingns.rs/wp-content/uploads/2023/07/IMG_9491.jpg',
      category: 3,
      latitude: 45.2380, // Replace with actual latitude
      longitude: 19.8215, // Replace with actual longitude
    },
    {
      name: 'Other 1',
      description: 'Other facility at location 1',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNHtp5f_rI48vPpi1kIsPcTcDVZHpcWOT7UQ&usqp=CAU',
      category: 4,
      latitude: 45.2410, // Replace with actual latitude
      longitude: 19.8225, // Replace with actual longitude
    },
    // Add more objects with different categories
  ];
  constructor(private mapService:  MapViewService, private service: TourAuthoringService) {}

  private async initMap(): Promise<void> {
    console.log(new Date())
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

    //this.registerOnClick();
    //this.search();
    // For walking

    await this.setRoute(this.loadedCheckpoints, 'driving');
    await this.setRoute(this.loadedCheckpoints, 'cycling');
    await this.setRoute(this.loadedCheckpoints, 'walking');

    this.service.updateTour(this.loadedTour).subscribe({
      next: (_) => {
        console.log(this.loadedTour)
      }
    })

    this.addMarkersForCategory(1); // Restrooms
    this.addMarkersForCategory(2); // Restaurants
    this.addMarkersForCategory(3); // Parking
    this.addMarkersForCategory(4); // Other
    
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
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
        console.log(res.display_name);
      });
      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );
      const mp = new L.Marker([lat, lng]).addTo(this.map);
      alert(mp.getLatLng());
    });
  }
// Add a label to the popup content
// Add a label to the popup content with fixed size and smaller font
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




// Updated setRoute method
private async setRoute(checkpoints: Checkpoint[], profile: 'walking' | 'driving' | 'cycling'): Promise<void> {
  return new Promise<void>((resolve) => {
    const waypointCoordinates = checkpoints.map(checkpoint => {
      return L.latLng(checkpoint.latitude, checkpoint.longitude);
    });

    const routeControl = L.Routing.control({
      waypoints: waypointCoordinates,
      router: L.Routing.mapbox('pk.eyJ1IjoiZGpucGxtcyIsImEiOiJjbG56Mzh3a2gwNWwzMnZxdDljdHIzNDIyIn0.iZjiPJJV-SgTiIOeF8UWvA', { profile: `mapbox/${profile}` }),
      routeWhileDragging: false,
    }).addTo(this.map);

    const markerGroup = L.layerGroup();

    routeControl.on('routesfound', (e) => {
      if (profile === 'walking') {
        const routes = e.routes;

        checkpoints.forEach((checkpoint, index) => {
          this.mapService.reverseSearch(checkpoint.latitude, checkpoint.longitude).subscribe((res) => {
            if (res.address) {
              const street = res.address.road || res.address.street;
              const number = res.address.house_number;
              const city = res.address.city_district || res.address.city || res.address.town || res.address.village || res.address.suburb;
              const location = `${street} ${number}, ${city}`;

              const marker = L.marker([checkpoint.latitude, checkpoint.longitude], {
                draggable: false,
              })
                .addTo(markerGroup)
                .bindPopup(this.addLabelToPopupContent("CHECKPOINT " + ++index, checkpoint.image, checkpoint.name, location))
                .on('mouseover', (event) => {
                  marker.openPopup();
                })
                .on('mouseout', (event) => {
                  marker.closePopup();
                });

              markerGroup.addTo(this.map);
            }
          });

          markerGroup.addTo(this.map);
          var summary = routes[0].summary;
          const totalSeconds = summary.totalTime;
          const totalDistance = summary.totalDistance

          this.loadedTour.totalLength = totalDistance;
          this.loadedTour.footTime = totalSeconds;

          // Resolve the promise to indicate that the asynchronous operation is complete
          resolve();
        });
      } else {
        // If the profile is not 'walking', simply resolve the promise without displaying the route
        resolve();
      }
    });
  });
}

// Updated addMarkersForCategory method
private async addMarkersForCategory(category: number): Promise<void> {
  return new Promise<void>((resolve) => {
    const filteredObjects = this.objects.filter((obj) => obj.category === category);
    const promises: Promise<void>[] = [];

    filteredObjects.forEach((object) => {
      const promise = new Promise<void>((resolveObject) => {
        this.mapService.reverseSearch(object.latitude, object.longitude).subscribe((res) => {
          if (res.address) {
            const street = res.address.road || res.address.street;
            const number = res.address.house_number;
            const city = res.address.city_district || res.address.city || res.address.town || res.address.village || res.address.suburb;
            const location = `${street} ${number}, ${city}`;

            const popupContent = this.addLabelToPopupContent(this.getCategoryLabel(category), object.image, object.name, location);

            const iconUrl = this.getCategoryIcon(category);
            const marker = L.marker([object.latitude, object.longitude], {
              icon: L.icon({
                iconUrl: iconUrl,
                iconSize: [32, 32],
              }),
            })
              .addTo(this.map)
              .bindPopup(popupContent)
              .on('mouseover', (event) => {
                marker.openPopup();
              })
              .on('mouseout', (event) => {
                marker.closePopup();
              });

            resolveObject();
          }
        });
      });

      promises.push(promise);
    });

    Promise.all(promises).then(() => {
      resolve();
    });
  });
}

  
  private getCategoryIcon(category: number): string {
    switch (category) {
      case 1:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Z_8qJz1C6JP0SzIzWWZgkg9w3IPYRfnZhg&usqp=CAU';
      case 2:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4zKuR01phE9NC8JsXP8TiTkpfnuVeCppMYg&usqp=CAU';
      case 3:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4a_2ILTJlglpbH6LvmK2c3p8AbUlc-KWYNw&usqp=CAU';
      case 4:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVtgwde-vuShwwABAvomrXDCWZ-PifJuJ42w&usqp=CAU';
      default:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVtgwde-vuShwwABAvomrXDCWZ-PifJuJ42w&usqp=CAU'; // Provide a default icon for unknown categories
    }
  }
  private getCategoryLabel(category: number): string {
    switch (category) {
      case 1:
        return 'RESTROOM';
      case 2:
        return 'RESTAURANT';
      case 3:
        return 'PARKING';
      default:
        return 'OTHER'; // Provide a default label for unknown categories
    }
  }

}