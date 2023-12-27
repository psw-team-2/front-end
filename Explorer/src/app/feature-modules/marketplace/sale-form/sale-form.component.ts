import { Component,Output ,Input,EventEmitter, SimpleChanges} from '@angular/core';
import { Sale } from '../model/sale.model';
import { User } from '../../administration/model/user-account.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.css']
})
export class SaleFormComponent {


  tours: Tour[];
  addedTours: number[] = [];

  constructor(
      private service: MarketplaceService,private authService:AuthService, private tourAuthoringService: TourAuthoringService,private router:Router) { }

  saleForm = new FormGroup({
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date()),
    discount: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern(/^\d+$/)]),
    selectedTours: new FormControl ([[]])
});




ngOnInit(): void {
  
  this.tourAuthoringService.getTours().subscribe(
    (result) => {
        this.tours = result.results.filter(tour => tour.status === 0)
    })
}


addToSale(tourId: number, i: number) {
  if (this.addedTours !== undefined && !this.addedTours.includes(tourId)) {
      this.addedTours.push(tourId);
  }
}

removeFromSale(tourId: number, i: number) {
  if (this.addedTours !== undefined && this.addedTours.includes(tourId)) {
      this.addedTours = this.addedTours.filter((id) => id !== tourId);
  }
}

saleCreation(): void {
  let user = this.authService.user$.value
  const sale: Sale = {
    startDate: this.saleForm.value.startDate as Date,
      endDate: this.saleForm.value.endDate as Date,
      discount: this.saleForm.value.discount!,
      tourIds: this.addedTours,
      authorId: user.id
  }
  this.service.createSale(sale).subscribe((zz)=>{
    this.router.navigate([`/sale/`]);
  });
}}