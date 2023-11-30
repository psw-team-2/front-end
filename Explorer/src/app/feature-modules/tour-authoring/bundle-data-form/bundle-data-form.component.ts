import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Observable } from 'rxjs';
import { TourBundle } from '../model/tour-bundle.model';
import { Bundle } from '../model/bundle.model';

@Component({
  selector: 'xp-bundle-data-form',
  templateUrl: './bundle-data-form.component.html',
  styleUrls: ['./bundle-data-form.component.css']
})
export class BundleDataFormComponent implements OnInit{
  tours: TourBundle[] = [];
  selectedTour: TourBundle;
  @Input() selectedBundle : Bundle;
  userId = this.authService.user$.value.id;
  price : number;
  constructor(private service: TourAuthoringService,private authService: AuthService) {}

  
  bundleDataForm = new FormGroup({
    price: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    //this.fetchTours();
    this.getToursByAuthorId(this.userId);
  }
  
  getToursByAuthorId(userId: number): void{
    this.service.getToursByAuthorId(userId)
    .subscribe(response => {
      this.tours = response;
    });
  }

  /*fetchTours(): void {
    this.service.getTours().subscribe((data: PagedResults<Tour> | undefined) => {
      if (data && Array.isArray(data)) { // Provera postojanja podataka i da li je data niz
        this.tours = data; // Postavljanje tura
      }
    });
  }*/
  
  createBundle(bundle: Bundle, price: string | null | undefined): void {
    let numericPrice: number;
  
    if (price !== null && price !== undefined && price !== '') {
      numericPrice = +price; // Use the unary plus operator to convert string to number
    } else {
      numericPrice = this.selectedBundle.price;
    }
  
    this.service.publishBundle(bundle, numericPrice).subscribe(response => {
      this.selectedBundle = response;
      if (this.selectedBundle.status === 1) {
        alert("Successfully created bundle");
      } else if (this.selectedBundle.status === 0) {
        alert("Created bundle has status draft");
      }
    }, error => {
      alert("Not created");
    });
  }

  onRemoveClicked(tour: TourBundle): void {
    tour.isAdded = false;
  }
  onAddClicked(tour: TourBundle): void {
    this.selectedTour = tour;
    tour.isAdded = true;
    
    // Check if 'this.selectedTours' is defined and has a valid 'id' property
    if (this.selectedBundle && this.selectedTour && this.selectedTour.id !== undefined) {
      // Dodajte odabranu turu u listu tura za bundle
      this.service.addTourToBundle(this.selectedTour.id, this.selectedBundle)
        .subscribe(response => {
          this.selectedBundle.price += this.selectedTour.price;
          console.log('Tour added to bundle:', response);
          // Handle the response as needed
        }, error => {
          console.error('Error adding tour to bundle:', error);
          // Handle the error as needed
        });
    } else {
      console.error('Invalid selectedBundle or selectedTours');
      // Handle the case where selectedBundle or selectedTours is undefined or id is not valid
    }
  }
  
}
