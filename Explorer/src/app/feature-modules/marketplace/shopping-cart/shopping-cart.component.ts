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
export class ShoppingCartComponent implements OnInit {
      orderItem: OrderItem[] = [];
      shoppingCartId: number;
      shoppingCart: ShoppingCart;

      constructor(private service: MarketplaceService, private route: ActivatedRoute, private authService: AuthService) { }

      /*ngOnInit(): void {
        this.service.getOrderItemsByShoppingCartId(this.shoppingCartId).subscribe((items) => {
          this.items = items;
        });
      }*/

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
      

      ngOnInit(): void {
        this.loadShoppingCart();
        this.getOrderItem();
        this.route.params.subscribe(params => {
          const id = +params['id']; 
          if (!isNaN(id)) {
            this.shoppingCartId = id; 
            this.getOrderItem();
          } else {
          }
        });
      }
         

      getOrderItem(): void {
        /*this.service.getOrderItemsByShoppingCartId(this.shoppingCartId).subscribe({
          next: (result: OrderItem[]) => {  // Change the type of the parameter to OrderItem[]
            this.orderItem = result;
          },
          error: () => {
            // Handle errors if needed
          }
        });*/
      }
      
      
    

}
