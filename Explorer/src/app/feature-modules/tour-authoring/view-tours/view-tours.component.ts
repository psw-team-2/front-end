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
@Component({
  selector: 'xp-view-tours',
  templateUrl: './view-tours.component.html',
  styleUrls: ['./view-tours.component.css'],
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

  constructor(
    private service: TourAuthoringService,
    private marketService: MarketplaceService,
    private authService: AuthService,
    private router: Router
  ) {}
 // selectedTour: Tour;
  async ngOnInit(): Promise<void> {
    await this.getTours();
    this.calculateAverageGrades();
    if (this.authService.user$.value) {
      this.isLogged = true;
      this.userId = this.authService.user$.value.id;
      this.shoppingCartId = this.userId;      
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
  }

/*
  async getTours(): Promise<void> {
    try {
      const result: PagedResults<Tour> | undefined = await this.service
        .getTours()
        .toPromise();

      if (result) {
        this.allTours = result.results;
        this.tours = result.results;
        this.calculateAverageGrades();
        const userId = this.authService.user$.value.id;
        this.service
          .getBoughtTours()
          .subscribe({next:(tourTokenList: PagedResults<TourPurchaseToken>) => {
             let newlist = tourTokenList.results.filter((tourToken: TourPurchaseToken) => {
              if (tourToken.userId == userId) {
                return true;
              } else {
                return false;
              }
            });
            this.boughtTours = this.allTours.filter((tour: Tour) => {
              for (let i = 0; i < newlist.length; i++) {
                const boughtTourToken = newlist[i];
                if (tour.id == boughtTourToken.tourId) {
                  return true;
                } else {
                  return false;
                }
              }
              return false;
            });
            console.log(this.allTours)
          }});
      } else {
        // Handle the case where result is undefined
      }
    } catch (error) {
      // Handle errors if needed
    }
  }*/

  async getTours(): Promise<void> {
    try {
      const result: PagedResults<Tour> | undefined = await this.service.getTours().toPromise();

      if (result) {
        this.allTours = result.results.filter(tour => tour.status === 1);
        this.tours = result.results.filter(tour => tour.status === 1);;
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
}
