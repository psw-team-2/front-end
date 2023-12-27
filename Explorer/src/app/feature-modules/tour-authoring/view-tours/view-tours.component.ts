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

import { TourReview } from '../../marketplace/model/tour-review.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { TouristPosition } from '../../tour-execution/model/touristposition.model';

import { Wishlist } from '../model/wishlist.model';
import { FavouriteItem } from '../model/favourite-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  searchResults: Tour[] = [];
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

  tourReviews: TourReview[];
  tourExecutions: TourExecution[];

  isActiveTourSearchActive: boolean = false;
  isNearbyTourSearchActive: boolean = false;
  touristPosition: TouristPosition;

  favoriteItems: FavouriteItem[] = [];
  wishlistId: Number;
  wishlist: Wishlist;
  isAddedToWishlist: boolean = false; 
  


  constructor(
    private service: TourAuthoringService,
    private marketService: MarketplaceService,
    private authService: AuthService,
    private router: Router,
    private executionService: TourExecutionService,
    private adminService: AdministrationService, private snackBar: MatSnackBar
    
  ) {}

  toggleSlider() {
    this.sliderState = (this.sliderState === 'small') ? 'large' : 'small';
  }
// selectedTour: Tour;
  async ngOnInit(): Promise<void> {
    await this.getTours();
    this.getTourReviews();
    this.calculateAverageGrades();
    this.calculateTourPoints();
    this.loadWishlist();
    if (this.authService.user$.value) {
      this.isLogged = true;
      this.userId = this.authService.user$.value.id;

      this.shoppingCartId = this.userId;
       //loadWishlistForUser  
       

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

    window.setInterval(()=>{
      let touristPositionRaw = localStorage.getItem(this.userId.toString()) || '';
      this.touristPosition = JSON.parse(touristPositionRaw);
      }, 5000)
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

  sortActiveTours(): void {
    const observables: Observable<any>[] = [];
    
    const tourWithRankings = this.tours.map(tour => {
      let number = 0;
    
      console.log(tour)
    
      if (tour.id !== undefined) {
        const averageGrade$ = this.service.getAverageWeeklyGrade(tour.id);
        const reviews$ = this.marketService.getTourReviewByTourId(tour.id);
        const purchaseTokens$ = this.marketService.getWeeklyTokensByTourId(tour.id);
  
        observables.push(averageGrade$, reviews$, purchaseTokens$);
    
        console.log(observables)
    
        return { tour, number };
      }
      return null; // Or handle undefined case as needed
    }).filter(Boolean); // Remove null/undefined items
    
    forkJoin(observables).subscribe(
      (results: any[]) => {
        results.forEach((result, index) => {
          const tourIndex = Math.floor(index / 3); 
          const tourToUpdate = tourWithRankings[tourIndex];
          
          if (index % 3 === 0 && tourToUpdate) { // Handling averageGrade request
            tourToUpdate.number = (tourToUpdate.number || 0) + (result.averageGrade || 0) * 1.2;
          } else if (index % 3 === 1 && tourToUpdate) { // Handling reviews request
            tourToUpdate.number = (tourToUpdate.number || 0) + (result?.length || 0) * 0.2;
          } else if (tourToUpdate) { // Handling purchase tokens request
            console.log(result?.results?.length);            
            tourToUpdate.number = (tourToUpdate.number || 0) + (result?.results?.length || 0) * 0.3; // Adjust the factor as needed
          }
          console.log(tourToUpdate);
        });
        this.updateTours(tourWithRankings.filter(Boolean));
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }
  
  updateTours(tourWithRankings: any[]): void {
    tourWithRankings.forEach(item => {
      item.number = item.number || 0; // Ensure number is defined
    });
    tourWithRankings.sort((a, b) => b.number - a.number);
    this.tours = tourWithRankings.map(item => item.tour);
  }
  
  
  async getTours(): Promise<void> {
    try {
      const result: PagedResults<Tour> | undefined = await this.service.getTours().toPromise();

      if (result) {
        this.allTours = result.results.filter(tour => tour.status === 1);
        this.tours = result.results.filter(tour => tour.status === 1);
        this.sortToursByPointsDescending();

        if (!this.isActiveTourSearchActive && this.isNearbyTourSearchActive) {
          this.handleSearchButtonClick();
        }

        if (this.isActiveTourSearchActive) {
          const tourIds: (number | undefined)[] = this.tours.map((tour: Tour) => tour.id);
          
          if (tourIds.every(Boolean)) {
            this.service.getActiveTours(tourIds).subscribe(
              (pagedResults: PagedResults<Tour>) => {
                this.tours = pagedResults.results;
              },
              error => {
                console.error('Error:', error);
              }
            );
          }
        }
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
      console.log("SEARCH ACTIVE")
      if(this.isActiveTourSearchActive){
        this.sortActiveTours()
      }
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

 

//da dobavi sve toruReviewove za sve ture
 /* getTourReviews():void {
    for (const tour of this.tours) {
      if (tour.id !== undefined) {
        this.marketService.getTourReviewByTourId(tour.id).subscribe((tourReview) => {
          if (tour.id !== undefined) {
            this.tourReviews[tour.id] = tourReview.results;   ///////!!!!!!!!!!!!!!!!!!!!!!!!
          } 
        });
      }
    }
  }*/





  getTourReviews(): void {
    for (const tour of this.tours) {
      if (tour.id !== undefined) {
        this.marketService.getTourReviewByTourId(tour.id).subscribe((pagedResult) => {
          if (pagedResult.results && Array.isArray(pagedResult.results)) {
            // Assuming you want to store each TourReview separately
            for (const tourReview of pagedResult.results) {
              // Handle each TourReview individually
              if(tourReview.id!==undefined)
              this.tourReviews[tourReview.id] = tourReview;
            }
          } 
        });
      }
    }
  }
  
  //broji koliko review-ova je bilo na konkretnu odredjenu turu
  coutnTourReviewForTour(id : number) : number {
    let tourNumber = 0
    for(const tourReview of this.tourReviews) {
      if (id == tourReview.tourId) {
          tourNumber++;
      }
    }
    return tourNumber
  }

getTourExecutions(tourId: number) : void {
  this.executionService.getTourExecutionByTourAndUser(tourId, this.userId).subscribe((result) => {
    this.tourExecutions = result.results;
   });
  }


  async calculateTourPoints(): Promise<void> { 

    for (const tour of this.tours) {
      if (tour.id !== undefined) {
       this.executionService.getTourExecutionByTourAndUser(tour.id, this.userId).subscribe((result) => {
       this.tourExecutions = result.results;   });
       }
      if (this.coutnTourReviewForTour(tour.id ?? 0) > 50  && this.tourAverageGrades[tour.id ?? 0] > 4) {
          if(tour.difficulty == this.preference.difficulty) {
            tour.points+=3;
          }
          for(const tag of tour.tags) {
            if(this.preference.tags.includes(tag)) {
              tour.points+=1;
            }
          }
          for (const tourExecution of this.tourExecutions) {
            if (tourExecution.Completed) {
              for(const tag of tour.tags) {
                if(this.preference.tags.includes(tag)) {
                  tour.points+=2;
                }
              }
            }
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
        this.service.addToCart(this.shoppingCart, tour,tour.price).subscribe({
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


  ActiveTourSearchClicked(){
    console.log("ACTIVE TOUR SEARCH CLICKED")
    this.isActiveTourSearchActive = !this.isActiveTourSearchActive;
    if (this.isActiveTourSearchActive && !this.isNearbyTourSearchActive) {
      const tourIds: (number | undefined)[] = this.tours.map((tour: Tour) => tour.id);
      
      if (tourIds.every(Boolean)) {
        this.service.getActiveTours(tourIds).subscribe(
          (pagedResults: PagedResults<Tour>) => {
            this.tours = pagedResults.results;
          },
          error => {
            console.error('Error:', error);
          }
        );
      } 
    }
    if (!this.isActiveTourSearchActive && this.isNearbyTourSearchActive) {
      this.getTours();
    }
    if (!this.isActiveTourSearchActive && !this.isNearbyTourSearchActive) {
      this.getTours();
    }
    if (this.isActiveTourSearchActive && this.isNearbyTourSearchActive) {
      this.handleSearchButtonClick();
    }
  }

  NearbyTourSearchClicked() {
    this.isNearbyTourSearchActive = !this.isNearbyTourSearchActive;

    if (this.isNearbyTourSearchActive) {
      this.handleSearchButtonClick();
    } else {
      this.getTours();
    }
  }

  handleSearchButtonClick(): void {
    const markerLatLng = this.touristPosition;
    const clickedLat = markerLatLng.latitude;
    const clickedLng = markerLatLng.longitude;

    const selectedRadius = 40000;

    this.searchResults = [];

    const checkpointObservables: Observable<Checkpoint | null>[] = [];
    console.log(this.tours + 'OVDE JE DIS TURS')
    this.tours.forEach((tour: Tour) => {
      tour.checkPoints.forEach((checkpointId) => {
        const checkpointObservable = this.service.getCheckpointById(checkpointId).pipe(
          catchError((error: any) => {
            console.error('Error fetching checkpoint:', error);
            return of(null);
          })
        );
        checkpointObservables.push(checkpointObservable);
      });
    });

    forkJoin(checkpointObservables).subscribe((checkpointData: (Checkpoint | null)[]) => {
      let checkpointIndex = 0;
      let hasNearbyTours = false;
  
      this.tours.forEach((tour: Tour) => {
        let tourHasMatchingCheckpoint = false;
  
        tour.checkPoints.forEach((checkpointId) => {
          const checkpoint = checkpointData[checkpointIndex];
  
          if (checkpoint) {
            const distance = this.calculateDistance(
              clickedLat,
              clickedLng,
              checkpoint.latitude,
              checkpoint.longitude
            );
  
            if (distance <= selectedRadius) {
              tourHasMatchingCheckpoint = true;
              hasNearbyTours = true;
            }
          }
  
          checkpointIndex++;
        });

        if (!hasNearbyTours) {
          this.tours = []; // Clear the search results if no tours are nearby
        }
  
        if (tourHasMatchingCheckpoint) {
          this.addTourToSearchResults(tour);
        }
      });

      if (this.isActiveTourSearchActive) {
        const tourIds: (number | undefined)[] = this.searchResults.map((tour: Tour) => tour.id);
        
        if (tourIds.every(Boolean)) {
          this.service.getActiveTours(tourIds).subscribe(
            (pagedResults: PagedResults<Tour>) => {
              this.searchResults = pagedResults.results;
              this.tours = this.searchResults;
            },
            error => {
              console.error('Error:', error);
            }
          );
        } 
      }
    });
  }

  addTourToSearchResults(tour: Tour): void {
    if (!this.searchResults.some((result) => result.id === tour.id)) {
      this.searchResults.push(tour);
      this.tours = this.searchResults;
    }
  }

  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const earthRadiusKm = 6371;

    const lat1Rad = this.degreesToRadians(lat1);
    const lat2Rad = this.degreesToRadians(lat2);
    const latDiff = this.degreesToRadians(lat2 - lat1);
    const lngDiff = this.degreesToRadians(lng2 - lng1);

    const a =
      Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c * 1000;
  }

  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  addToWishlist(tour: Tour): void {
    if (!this.authService.user$.value) {
      console.error('User is not logged in. Please log in before adding to the cart.');
      return;
    }
    this.service.getWishlist(this.userId).subscribe({
      next: (result: Wishlist) => {
        this.wishlist = result;
        this.service.addWishlistItem2(this.wishlist, tour.id!).subscribe({
          next: () => {
            // Uspesno dodavanje u wishlist
            this.showSnackbar('Tour added to wishlist!');
          },
         
          error: () => {
            this.showSnackbar("Tour already exists in wishlist.");
          }
          
        })
      }
    })
  }
  loadWishlist(): void {
    if (this.authService.user$ && this.authService.user$.value) {
      this.userId = this.authService.user$.value.id;
      this.service.getWishlist(this.userId).subscribe({
        next: (wishlist: Wishlist) => {
          this.wishlist = wishlist; // Assign wishlist value when retrieved
        },
        error: (error) => {
          console.error('Error fetching wishlist:', error);
        }
      });
    } else {
      console.error('AuthService user$ or value is not defined.');
    }
  }

  
showSnackbar(message: string): void {
  this.snackBar.open(message, 'Close', {
    duration: 3000, // Vreme trajanja snackbar-a (u milisekundama)
  });
}
  


}
