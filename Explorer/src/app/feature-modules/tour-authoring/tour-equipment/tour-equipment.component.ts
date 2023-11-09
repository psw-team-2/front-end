import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Equipment } from '../model/equipment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute } from '@angular/router';
import { Tour } from '../model/tour.model';


@Component({
  selector: 'xp-tour-equipment',
  templateUrl: './tour-equipment.component.html',
  styleUrls: ['./tour-equipment.component.css']
})
export class TourEquipmentComponent implements OnInit {

  equipment: Equipment[] = [];
  selectedEquipment: Equipment;
  shouldRenderEquipmentForm: boolean = false;
  shouldEdit: boolean = false;
  tourId: Number;
  tour: Tour;

  constructor(private service: TourAuthoringService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getEquipment();
    this.route.params.subscribe(params => {
      const id = +params['id']; // Parse the 'id' as a number
      if (!isNaN(id)) {
        this.tourId = id; // Set the 'tourId' if it's a valid number
        this.getEquipment();
      } else {
      }
    });
  }

  getEquipment(): void {
    this.service.getEquipment().subscribe({
      next: (result: PagedResults<Equipment>) => {
        this.equipment = result.results;
      },
      error: () => {
      }
    })
  }

  onAddClicked(equipment: Equipment): void {
    this.service.getTour(this.tourId).subscribe({
      next: (result: Tour) => {
        this.tour = result;
        this.service.addEquipmentToTour(equipment, this.tour).subscribe({
          next: () => {

          },
          error: () => {
          }
          
        })
      }
    })
  }
}

