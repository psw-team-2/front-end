import { Component, OnInit } from '@angular/core';
import { Bundle } from '../model/bundle.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { ShoppingCart } from '../../marketplace/model/shopping-cart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { OrderItem } from '../../marketplace/model/order-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-bundle-overview',
  templateUrl: './bundle-overview.component.html',
  styleUrls: ['./bundle-overview.component.css']
})
export class BundleOverviewComponent implements OnInit{
  bundles: Bundle[] = [];
  shoppingCartId: Number;
  shoppingCart: ShoppingCart;
  numberOfItems: number;
  isLogged: boolean;
  userId: Number;
  orderItems: OrderItem[];
  constructor(private service: TourAuthoringService, private authService: AuthService,private router: Router,  private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllBundles();
   
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

  getAllBundles(): void {
    this.service.getAllBundles().subscribe({
      next: (result: PagedResults<Bundle>) => {
        this.bundles = result.results;
      },
      error: () => {
      }
    })
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
  showSuccessNotification(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000, // Set the duration for which the notification should be visible (in milliseconds)
    });
  }

}


