import { Component, SimpleChanges } from '@angular/core';
import { TouristPosition } from '../model/touristposition.model';
import { TourExecutionService } from '../tour-execution.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import * as L from 'leaflet';
@Component({
  selector: 'xp-tourist-position',
  templateUrl: './tourist-position.component.html',
  styleUrls: ['./tourist-position.component.css']
})
export class TouristPositionComponent {
  selectedCoordinates: number[] = [];
  public touristPosition: TouristPosition;
  private userId:number;
  public userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3710/3710297.png',
    shadowUrl: '',

    iconSize:     [40, 45], 
    iconAnchor:   [15, 35],
});

  constructor(private service: TourExecutionService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getTouristPosition();
  }

  updatePosition(){
    localStorage.setItem(this.userId.toString(),JSON.stringify({userId:this.userId,latitude:this.touristPosition.latitude,longitude:this.touristPosition.longitude}))
  }

  getTouristPosition() : void {
    this.userId = this.authService.user$.value.id;
    let touristPositionRaw = localStorage.getItem(this.userId.toString()) as string;
    this.touristPosition = JSON.parse(touristPositionRaw);
  }

  onCoordinatesSelected(coordinates: number[]) {
    this.selectedCoordinates = coordinates;
    this.touristPosition.latitude = this.selectedCoordinates[0];
    this.touristPosition.longitude = this.selectedCoordinates[1];
  }
}
