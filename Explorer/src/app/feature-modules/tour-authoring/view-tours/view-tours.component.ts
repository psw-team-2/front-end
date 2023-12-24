import { Component, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { ShoppingCart } from '../../marketplace/model/shopping-cart.model';
import { AuthService } from '../../../infrastructure/auth/auth.service'; 
import { OrderItem } from '../../marketplace/model/order-item.model';

import { TourExecution } from '../../tour-execution/model/tourexecution.model';
import { Checkpoint } from '../model/checkpoint.model';
import { Router } from '@angular/router';
import { TourPurchaseToken } from '../model/tourPurchaseToken.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TourPreferenceFieldComponent } from '../../tour-preference/tour-preference-field/tour-preference-field.component';
import { AdministrationService } from '../../administration/administration.service';
import { Profile } from '../../administration/model/profile.model';
import { TourPreference } from '../../tour-preference/model/tour-preference.model';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { Wishlist } from '../model/wishlist.model';
import { FavouriteItem } from '../model/favourite-item.model';
@Component({
  selector: 'xp-view-tours',
  templateUrl: './view-tours.component.html',
  styleUrls: ['./view-tours.component.css'],
  animations: [
    trigger('slider', [
      state('small', style({
        width: '25%',
      })),
      state('large', style({
        width: '85%',
      })),
      transition('small <=> large', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ViewToursComponent implements OnInit {
  tours: Tour[] = [];
  boughtTours: Tour[] = [];
  boughtTourTokens: TourPurchaseToken[] = [];
  allTours: Tour[] = [];
  selectedTour: Tour | null = null; // Store the selected tour
  tourAverageGrades: { [tourId: number]: number } = {};
  shoppingCartId: Number;
  shoppingCart: ShoppingCart;
  numberOfItems: number;
  orderItems: OrderItem[];
  userId: number;
  isLogged: boolean;
  sliderState = 'small';
  user: Profile;
  tourPreferenceForm: FormGroup;
  preference: TourPreference = {
    difficulty: -1,
    walkingRating: -1,
    bicycleRating: -1,
    carRating: -1,
    boatRating: -1,
    tags: [],
  };
  favoriteItems: FavouriteItem[] = [];
  wishlistId: Number;
  wishlist: Wishlist;

  constructor(
    private service: TourAuthoringService,
    private marketService: MarketplaceService,
    private authService: AuthService,
    private router: Router,
    private adminService: AdministrationService
    
  ) {}

  toggleSlider() {
    this.sliderState = (this.sliderState === 'small') ? 'large' : 'small';
  }
 // selectedTour: Tour;
  async ngOnInit(): Promise<void> {
    await this.getTours();
    this.calculateAverageGrades();
    this.calculateTourPoints();
    if (this.authService.user$.value) {
      this.isLogged = true;
      this.userId = this.authService.user$.value.id;
      this.shoppingCartId = this.userId;
      this.wishlistId = this.userId; //loadWishlistForUser  
       
      this.service.getOrderItemsByShoppingCart(this.userId).subscribe({
      next: (result: OrderItem[]) => {
          this.orderItems = result;
          this.numberOfItems = this.orderItems.length;
          },
          error: () => {
          }
       })
    }
    else{
      this.isLogged = false;
    }

    this.authService.user$.subscribe(user => {
      if (user) {
        const id = user.id;
        this.adminService.getByUserId().subscribe(
          (profile: Profile) => {
           this.user = profile; 
           this.preference = profile.tourPreference;
           this.updateFormWithPreference();
          },
          (error) => {
            // Handle errors here
            console.error('Error fetching profile:', error);
          }
        );
      }
    });

  }

  updateFormWithPreference() {
    this.tourPreferenceForm.patchValue({
      difficulty: this.preference.difficulty,
      walkingRating: this.preference.walkingRating,
      bicycleRating: this.preference.bicycleRating,
      carRating: this.preference.carRating,
      boatRating: this.preference.boatRating,
      tags: this.preference.tags,
    });
  }

  sortToursByPointsDescending(): void {
    this.tours.sort((a, b) => b.points - a.points);
  }


  async getTours(): Promise<void> {
    try {
      const result: PagedResults<Tour> | undefined = await this.service.getTours().toPromise();

      if (result) {
        this.allTours = result.results.filter(tour => tour.status === 1);
        this.tours = result.results.filter(tour => tour.status === 1);
        this.sortToursByPointsDescending();
      } else {
        // Handle the case where result is undefined
      }
    } catch (error) {
      // Handle errors if needed
    }
  }
  selectTour(tour: Tour): void {
    this.selectedTour = tour;
  }

  handleSearchResults(data: { tours: Tour[]; searchActive: boolean }) {
    const searchActive = data.searchActive;

    if (searchActive) {
      // Display search results when search is active
      this.tours = data.tours;
    } else {
      // Display all tours when search is not active
      this.getTours(); // Refresh the tours to display all of them
    }

    // You can use this.tours in your component's template to display the updated results.
  }

  calculateAverageGrades(): void {
    for (const tour of this.tours) {
      if (tour.id !== undefined) {
        this.service.getAverageGrade(tour.id).subscribe((averageGrade) => {
          if (tour.id !== undefined) {
            this.tourAverageGrades[tour.id] = averageGrade.averageGrade;
          } 
        });
      }
    }
  }

  calculateTourPoints(): void { 
    for (const tour of this.tours) {
      if(tour.difficulty == this.preference.difficulty) {
        tour.points+=3;
      }
      for(const tag of tour.tags) {
        if(this.preference.tags.includes(tag)) {
          tour.points+=1;
        }
       }
      }
    }
  

 

  async startTour(tour: Tour) {
    let tourExecution: TourExecution = {
      tourId: tour.id!,
      TouristId: this.authService.user$.value.id,
      StartTime: new Date(),
      EndTime: undefined,
      Completed: false,
      Abandoned: false,
      CurrentLatitude: 0,
      CurrentLongitude: 0,
      LastActivity: new Date(),
      visitedCheckpoints: [tour.checkPoints[0]],
      touristDistance: 0,
    };
    await this.service
      .getCheckpointById(tour.checkPoints[0])
      .subscribe((checkpoint: Checkpoint) => {
        tourExecution.CurrentLatitude = checkpoint.latitude;
        tourExecution.CurrentLongitude = checkpoint.longitude;
        this.service.startTour(tourExecution).subscribe((value) => {
          localStorage.setItem(
            tourExecution.TouristId.toString(),
            JSON.stringify({
              userId: tourExecution.TouristId,
              latitude: tourExecution.CurrentLatitude,
              longitude: tourExecution.CurrentLongitude,
            })
          );
          this.router.navigate(['activeTour']);
        });
      });
  }
  
  onAddClicked(tour: Tour): void {
    if (!this.authService.user$.value) {
      console.error('User is not logged in. Please log in before adding to the cart.');
      return;
    }
    this.service.getShoppingCartById(this.shoppingCartId).subscribe({
      next: (result: ShoppingCart) => {
        this.shoppingCart = result;
        this.service.addToCart(this.shoppingCart, tour).subscribe({
          next: () => {
            this.numberOfItems += 1;
          },
          error: () => {
          }
          
        })
      }
    })
  }

  onReportClicked(tour: Tour): void{
    if (!this.authService.user$.value) {
      console.error('User is not logged in. Please log in before adding to the cart.');
      return;
    }
    this.router.navigate(['/tour-problem-form/', this.userId])
  }


  isCreatedByTourist(tour: Tour): boolean{
    if(tour.authorId === this.userId){
      return true;
    }
    return false;
  }

  addToWishlist(tour: Tour): void {
    if (!this.authService.user$.value) {
      console.error('User is not logged in. Please log in before adding to the cart.');
      return;
    }
    this.service.getWishlist(this.wishlistId).subscribe({
      next: (result: Wishlist) => {
        this.wishlist = result;
        this.service.addWishlistItem(this.wishlistId, tour).subscribe({
         
          error: () => {
          }
          
        })
      }
    })
  }
   

  

}
