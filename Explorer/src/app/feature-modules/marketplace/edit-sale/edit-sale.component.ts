import { Component,ChangeDetectorRef, SimpleChange  } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sale } from '../model/sale.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-edit-sale',
  templateUrl: './edit-sale.component.html',
  styleUrls: ['./edit-sale.component.css']
})
export class EditSaleComponent {
  tours: Tour[];
  addedTours: number[] = [];
  sale: Sale;
  user: any;

  saleForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private service: MarketplaceService,
    private authService: AuthService,
    private tourAuthoringService: TourAuthoringService,
    private router: Router
  ) {
    this.saleForm = this.formBuilder.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      discount: [0, [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern(/^\d+$/)]],
      selectedTours: [[]]
    });
  }

  ngOnInit(): void {
    this.tourAuthoringService.getTours().subscribe((result) => {
      this.tours = result.results.filter(tour => tour.status === 0);
    });
    
  }
 

  addToSale(tourId: number, i: number): void {
    if (this.addedTours !== undefined && !this.addedTours.includes(tourId)) {
      this.addedTours.push(tourId);
    }
  }

  removeFromSale(tourId: number, i: number): void {
    if (this.addedTours !== undefined && this.addedTours.includes(tourId)) {
      this.addedTours = this.addedTours.filter((id) => id !== tourId);
    }
  }
saleUpdate() {
  /* const sale: Sale = {
      startDate: this.saleForm.value.startDate as Date,
      endDate: this.saleForm.value.endDate as Date,            
      discount: this.saleForm.value.discount || 0,
      tourIds: this.addedTours,
      authorId: this.user.id
  };
  sale.id = this.sale.id;
  this.service.updateSale(sale).subscribe(
      () => {
        this.router.navigate(['/sales']);
      }
  ) */
}
}