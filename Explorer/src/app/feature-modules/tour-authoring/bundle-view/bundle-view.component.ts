import { Component, OnInit } from '@angular/core';
import { Bundle, BundleStatus } from '../model/bundle.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Tour } from '../model/tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';


import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ShoppingCart } from '../../marketplace/model/shopping-cart.model';
import { OrderItem } from '../../marketplace/model/order-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'xp-bundle-view',
  templateUrl: './bundle-view.component.html',
  styleUrls: ['./bundle-view.component.css']
})
export class BundleViewComponent implements OnInit{
  bundleId: number;
  bundle: Bundle;
  toursList: any[] = [];
  shoppingCartId: Number;
  shoppingCart: ShoppingCart;
  numberOfItems: number;
  isLogged: boolean;
  orderItems: OrderItem[];
  userId: Number;
  constructor(
    private route: ActivatedRoute,
    private service: TourAuthoringService,
    private authService: AuthService,
    private snackBar: MatSnackBar

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
    if (this.authService.user$.value) {
      this.isLogged = true;
      this.userId = this.authService.user$.value.id;
      this.shoppingCartId = this.userId;      
      this.service.getOrderItemsByShoppingCart(this.userId as number).subscribe({
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
  showSuccessNotification(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000, // Set the duration for which the notification should be visible (in milliseconds)
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

  onAddClicked(bundle: Bundle): void {
    if (!this.authService.user$.value) {
      console.error('User is not logged in. Please log in before adding to the cart.');
      return;
    }
    this.service.getShoppingCartById(this.shoppingCartId).subscribe({
      next: (result: ShoppingCart) => {
        this.shoppingCart = result;
        this.service.addBundleToCart(this.shoppingCart, bundle).subscribe({
          next: () => {
            this.numberOfItems += 1;
            this.showSuccessNotification('Bundle Added to cart');
          },
          error: () => {
          }
          
        })
      }
    })
  }
}
