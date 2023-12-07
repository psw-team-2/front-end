import { Component, OnInit } from '@angular/core';
import { PurchaseReport } from '../model/purchase-report.model';
import { TouristService } from '../tourist.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit{
  reports: PurchaseReport[] = [];
  userId = this.authService.user$.value.id;

  constructor(private touristService: TouristService, private authService: AuthService) { 
  }

  ngOnInit(): void {
    this.getPurchaseReportsByTourist(this.userId);
  }

  getPurchaseReportsByTourist(userId: number): void {
    this.touristService.getPurchaseReportsByTouristId(userId).subscribe((response) => {
      this.reports = response;

      for (const report of this.reports) {
        this.touristService.getTourById(report.tourId).subscribe((tour) => {
          report.tourName = tour.name;
        });
      }
    });
  }

  
}
