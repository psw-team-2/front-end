import { Component } from '@angular/core';
import { EquipmentForSelection } from '../model/equipment-for-selection.model';
import { TouristService } from '../tourist.service';
import { TouristEquipment } from '../model/tourist-equipment.model';

@Component({
  selector: 'xp-tourist-selected-equipment',
  templateUrl: './tourist-selected-equipment.component.html',
  styleUrls: ['./tourist-selected-equipment.component.css']
})
export class TouristSelectedEquipmentComponent {
  equipment: EquipmentForSelection[] = [];

  constructor(private service: TouristService) { }

  ngOnInit(): void {
    this.getEquipment();
  }

  getEquipment(): void {
    this.service.getEquipmentForSelection().subscribe({
      next: (result: EquipmentForSelection[]) => {
        this.equipment = result;
      },
      error: () => {
      }
    })
  }

  selectEquipment(equipmentId: any): void {
    const data: TouristEquipment = {
        userId : 1,
        equipmentId: equipmentId
    }

    this.service.addSelectEquipmentForSelection(data).subscribe({
      next: () => {}
    });
  }
}

