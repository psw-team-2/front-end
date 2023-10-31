import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { MapViewService } from './map-view.service';

@Component({
  selector: 'xp-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  private map: any;

  constructor(private mapService : MapViewService) {}

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

    //this.registerOnClick();
    //this.search();
    const waypoints = [
      { lat: 45.2396, lng: 19.8227 },
      { lat: 45.25, lng: 19.85 },
      // Add more waypoints as needed
    ];
    
    const waypointsArray = waypoints.map(waypoint => L.latLng(waypoint.lat, waypoint.lng));

    // Fit the map view to the bounds of the waypoints
    //this.map.fitBounds(waypointsArray);
  
   // this.setRoute(waypoints);
    
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

  setRoute(waypoints: { lat: number, lng: number }[]): void {
    if (waypoints.length < 2) {
      console.error('At least two waypoints are required for a route.');
      return;
    }
  
    const waypointsArray = waypoints.map(waypoint => L.latLng(waypoint.lat, waypoint.lng));
    const routeControl = L.Routing.control({
      waypoints: waypointsArray,
      router: L.routing.mapbox('pk.eyJ1IjoiZGpucGxtcyIsImEiOiJjbG56Mzh3a2gwNWwzMnZxdDljdHIzNDIyIn0.iZjiPJJV-SgTiIOeF8UWvA', { profile: 'mapbox/walking' })
    }).addTo(this.map);
  
    routeControl.on('routesfound', function (e) {
      var routes = e.routes;
      var summary = routes[0].summary;
      alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
    });
  
    // Add markers for all waypoints
    waypoints.forEach((waypoint, index) => {
      L.marker([waypoint.lat, waypoint.lng])
        .addTo(this.map)
        .bindPopup(`Waypoint ${index + 1}`)
        .openPopup();
    });
  }
}