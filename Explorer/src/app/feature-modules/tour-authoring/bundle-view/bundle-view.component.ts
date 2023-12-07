import { Component, OnInit } from '@angular/core';
import { Bundle, BundleStatus } from '../model/bundle.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Tour } from '../model/tour.model';

@Component({
  selector: 'xp-bundle-view',
  templateUrl: './bundle-view.component.html',
  styleUrls: ['./bundle-view.component.css']
})
export class BundleViewComponent implements OnInit{
  bundleId: number;
  bundle: Bundle;
  toursList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: TourAuthoringService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.bundleId = +params['id'];
        return this.service.getBundleById(this.bundleId);
      })
    ).subscribe({
      next: (bundle: Bundle) => {
        this.bundle = bundle;
        this.getToursDetails(bundle.tours);
      },
      error: () => {
        // Obrada grešaka ako je potrebno
      }
    });
  }

  getToursDetails(tourIds: number[]): void {
    const tourRequests: Observable<Tour>[] = tourIds.map(tourId => this.service.getTour(tourId));
  
    // Koristimo forkJoin da bismo paralelno izvršili sve zahteve za ture
    forkJoin(tourRequests).subscribe(
      (tours: Tour[]) => {
        this.toursList = tours;
      },
      (error) => {
        console.error('Error loading tours:', error);
        // Ovde možete dodati logiku za identifikaciju tura koje nisu uspele da se učitaju
      }
    );
  }
  
  getBundleDetails(): void {
    this.service.getBundleById(this.bundleId).subscribe({
      next: (bundle: Bundle) => {
        this.bundle = bundle;
      },
      error: () => {
        // Obrada grešaka ako je potrebno
      }
    });
  }

  

  getStatusText(status: BundleStatus): string {
    switch (status) {
      case BundleStatus.Draft:
        return 'Draft';
      case BundleStatus.Published:
        return 'Published';
      case BundleStatus.Archived:
        return 'Archived';
      default:
        return 'Unknown';
    }
  }
}
