import { Component, OnInit } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { MarketplaceService } from '../marketplace.service';
import { ShoppingCart } from '../model/shopping-cart.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../infrastructure/auth/auth.service'; 
import { PagedResults } from 'src/app/shared/model/paged-results.model';

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
        private authService: AuthService) { }

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
                }
              })
              
            },
            error: () => {
            }
            
          })
           
    }

    onRemoveAllClicked() {
      this.service.removeAllItems(this.shoppingCartId).subscribe({
        next: () => {
          this.orderItems = [];
          this.numberOfItems = 0;
          this.totalPrice = 0;
        },
        error: () => {

        }
      });
    }
    
    onCheckoutClicked() : void{
      this.updateOrderItems();

      this.service.createTokens(this.orderItems, this.userId).subscribe({
        next: () => {
          alert('Checkout successful! Purchase reports added to your profile.');
          this.numberOfItems = 0;
          this.totalPrice = 0;
          this.orderItems = [];
        },
        error: () => {
          alert('You don\'t have enough money to make a purchase!');
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
}
