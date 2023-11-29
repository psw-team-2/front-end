import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Observable } from 'rxjs';
import { TourBundle } from '../model/tour-bundle.model';

@Component({
  selector: 'xp-bundle-data-form',
  templateUrl: './bundle-data-form.component.html',
  styleUrls: ['./bundle-data-form.component.css']
})
export class BundleDataFormComponent implements OnInit{
  tours: TourBundle[] = [];
  selectedTours: TourBundle[] = [];
  userId = this.authService.user$.value.id;
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
  
  

  onAddClicked(tour: any): void {
    // Dodajte odabranu turu u listu tura za bundle
    this.selectedTours.push(tour);
  }
}
