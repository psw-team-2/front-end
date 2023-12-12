import { Component, OnInit } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { MarketplaceService } from '../marketplace.service';
import { ShoppingCart } from '../model/shopping-cart.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../infrastructure/auth/auth.service'; 
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit{
      orderItems: OrderItem[] = [];
      shoppingCartId: number;
      totalPrice: number;
      orderItemIds: number[] = [];
      userId: number;
      numberOfItems: number;

      constructor(
        private service: MarketplaceService, 
        private route: ActivatedRoute, 
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar) { }

      ngOnInit() {
        if (this.authService.user$.value) {

          this.userId = this.authService.user$.value.id;
          this.shoppingCartId = this.userId;

        this.service.getOrderItemsByShoppingCart(this.userId).subscribe({
          next: (result) => {console.log(result)
            this.orderItems = result;
            this.numberOfItems = this.orderItems.length;
          },
          error: () => {
          }
        })

        this.service.getTotalPriceByUserId(this.userId).subscribe({
          next: (result: number) => {
            this.totalPrice = result;
          }
        })
        
      }
    }

    onRemoveClicked(orderItemId: number): void {
          this.service.removeFromCart(this.shoppingCartId, orderItemId).subscribe({
            next: () => {
              this.orderItems = this.orderItems.filter(item => item.id !== orderItemId);
              this.numberOfItems -= 1;
              this.service.getTotalPriceByUserId(this.userId).subscribe({
                next: (result: number) => {
                  this.totalPrice = result;
                  this.showSuccessNotification('Item removed successfully.');
                }
              })
              
            },
            error: () => {
              this.showErrorNotification('An error occurred while removing the item. Please try again.');
            }
            
          })
           
    }

    onRemoveAllClicked() {
      this.service.removeAllItems(this.shoppingCartId).subscribe({
        next: () => {
          this.orderItems = [];
          this.numberOfItems = 0;
          this.totalPrice = 0;          
          this.showSuccessNotification('All items removed successfully.');
        },
        error: () => {
          this.showErrorNotification('An error occurred while removing all items. Please try again.');
        }
      });
    }
    
    onCheckoutClicked() : void{
      this.updateOrderItems();

      this.service.createTokens(this.orderItems, this.userId).subscribe({
        next: () => {
          alert('Checkout successful!');
          this.numberOfItems = 0;
          this.totalPrice = 0;
          this.orderItems = [];
        },
        error: (error) => {
          alert('You don\'t have enough money to make a purchase.');
        }
      });
    }

    updateOrderItems(): void {
      for (let orderItem of this.orderItems) {
        let newOrderItem = orderItem;
        newOrderItem.isBought = true;
        this.service.updateOrderItem(newOrderItem).subscribe({
          next: (result) => {
            console.log(result)
          }
        });
      }
    }

    shopNow(): void {
      // Navigate to the "view-tours" component or replace it with your actual route
      // Example assuming you have a route named "view-tours":
      this.router.navigate(['/view-tours-tourist']);
    }

    showSuccessNotification(message: string): void {
      this.snackBar.open(message, 'OK', {
        duration: 3000, // Set the duration for which the notification should be visible (in milliseconds)
      });
    }
  
    showErrorNotification(message: string): void {
      this.snackBar.open(message, 'OK', {
        duration: 3000,
        panelClass: ['error-snackbar'] // Dodajte stilizaciju za poruku o grešci
      });
    }

    addToWishlist(orderItem: any): void {
      // Implementacija logike za dodavanje u listu želja
      console.log('Added to wishlist:', orderItem);
  }

  isLiked(orderItem: any): boolean {
    // Implementacija logike za proveru da li je proizvod već dodat u listu želja
    // Na primer, možete koristiti neki servis za upravljanje listom želja
    return orderItem.isLiked; // Podesite prema vašoj implementaciji
  }
}
