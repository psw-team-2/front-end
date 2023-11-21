import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Equipment } from '../model/equipment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute } from '@angular/router';
import { Tour } from '../model/tour.model';


@Component({
  selector: 'xp-added-equipment',
  templateUrl: './added-equipment.component.html',
  styleUrls: ['./added-equipment.component.css']
})
export class AddedEquipmentComponent implements OnInit {

  equipment: Equipment[] = [];
  selectedEquipment: Equipment;
  shouldRenderEquipmentForm: boolean = false;
  shouldEdit: boolean = false;
  tourId: Number;
  tour: Tour;

  constructor(private service: TourAuthoringService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']; // Parse the 'id' as a number
      if (!isNaN(id)) {
        this.tourId = id; // Set the 'tourId' if it's a valid number
        this.getEquipment();
      } else {
      }
    });
  }

   deleteEquipment(id : number): void {
    this.service.removeEquipmentFromTour(id , this.tour).subscribe({
      next: () => {
        this.getEquipment();
      },
    })
  } 

  getEquipment(): void {
    this.service.getTour(this.tourId).subscribe({
      next: (result: Tour) => {
        this.tour = result;
        let temporaryList: Equipment[] = [];
        this.service.getEquipment().subscribe({
          next: (results: PagedResults<Equipment>) => {
            for (let i = 0; i < results.results.length; i++) {
              const equipment = results.results[i];
              // Check if the equipment ID is in the tour's equipment IDs
              if (this.tour.equipment .includes(equipment.id || 0)) {
                temporaryList.push(equipment);
              }
            }
            this.equipment = temporaryList;
          }
        });
      },
      error: () => {
        // Handle error
      }
    });
  }
  
  handleEquipmentChanges(equipment: Equipment[]): void {
    // Handle the updated equipment list here
    this.getEquipment();
    // Perform necessary actions with the updated equipment list
  }
}
