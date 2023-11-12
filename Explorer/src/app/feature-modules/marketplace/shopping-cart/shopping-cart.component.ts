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
      shoppingCart: ShoppingCart;
      orderItemIds: number[] = [];
      userId: number;

      constructor(private service: MarketplaceService, private route: ActivatedRoute, private authService: AuthService) { }

      ngOnInit() {
        if (this.authService.user$.value) {
          // Get the user ID
          this.userId = this.authService.user$.value.id;
          // Set the shoppingCartId directly
          this.shoppingCartId = this.userId;

        this.service.getOrderItemsByShoppingCart(this.userId).subscribe({
          next: (result) => {console.log(result)
            this.orderItems = result;
             // Extract and store orderItemIds
            //this.orderItemIds = this.orderItems.map(item => item.id);
          },
          error: () => {
          }
        })
        
      }
    }

    onRemoveClicked(orderItemId: number) {
      this.service.removeFromCart(this.shoppingCart, orderItemId).subscribe({
        next: () => {
          // If removal is successful, update the orderItems array
          this.orderItems = this.orderItems.filter(item => item.id !== orderItemId);
        },
        error: () => {

        }
      });
    }
    
    onCheckoutClicked() : void{
      this.updateOrderItems();

      this.service.createTokens(this.orderItems, this.userId).subscribe({
        next: () => {

        },
        error: () => {
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
