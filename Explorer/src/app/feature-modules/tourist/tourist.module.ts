import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { TouristSelectedEquipmentComponent } from './tourist-selected-equipment/tourist-selected-equipment.component';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';



@NgModule({
  declarations: [
    //TouristSelectedEquipmentComponent,
    PurchaseReportComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    //TouristSelectedEquipmentComponent
  ]
})
export class TouristModule { }
