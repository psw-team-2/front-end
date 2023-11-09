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
export class ShoppingCartComponent{
      orderItems: OrderItem[] = [];
      shoppingCartId: number;
      shoppingCart: ShoppingCart;

      constructor(private service: MarketplaceService, private route: ActivatedRoute, private authService: AuthService) { }
/*
      ngOnInit() {
        //this.loadShoppingCart();
        this.service.getOrderItemsByShoppingCartId(1).subscribe({
          next: (result: OrderItem[]) => {
            this.orderItems = result;
          },
          error: () => {
          }
        })       
      }
/*
      loadShoppingCart(): void {
        const userId = this.authService.user$.value.id;   
        // Fetch the shopping cart for the current user
        this.service.getShoppingCartByUserId(userId).subscribe({
          next: (result: ShoppingCart) => {
            this.shoppingCart = result;
          },
          error: () => {
            // Handle errors if needed
          }
        });
      }
      */
     
}
