import { Component, OnInit } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { MarketplaceService } from '../marketplace.service';
import { ShoppingCart } from '../model/shopping-cart.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../infrastructure/auth/auth.service'; 
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Sale } from '../model/sale.model';
import { AdministrationService } from '../../administration/administration.service';
import { Profile } from '../../administration/model/profile.model';

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
      profile:Profile;
      discount:number;
      firstPurchaseDiscount:number;

      constructor(
        private service: MarketplaceService, 
        private route: ActivatedRoute, 
        private authService: AuthService,private adminService:AdministrationService) { }

      async ngOnInit() {
        if (this.authService.user$.value) {

          this.userId = this.authService.user$.value.id;
          this.shoppingCartId = this.userId;
          this.adminService.getByUserId().subscribe((data)=>{
            this.profile = data;
            if (this.profile.xp>=100) {
              this.discount = 20;
            }
            else {
              this.discount = 0;
            }


            if (!this.profile.isFirstPurchased) {
              this.firstPurchaseDiscount = 10
            }
            else {
              this.firstPurchaseDiscount = 0
            }

            this.service.getTotalPriceByUserId(this.userId).subscribe({
              next: (result: number) => {
                this.totalPrice = this.calculateDiscountedPrice(result,this.firstPurchaseDiscount)
                this.totalPrice = this.calculateDiscountedPrice(this.totalPrice,this.discount)
              }
            })
          })
        await this.service.getOrderItemsByShoppingCart(this.userId).subscribe({
          next: (result) => {console.log(result)
            this.orderItems = result;
            this.numberOfItems = this.orderItems.length;
            console.log(this.orderItems)
          },
          error: () => {
          }
        })
      }
    }
    calculateDiscountedPrice(originalPrice: number, discount: number): number {
      const discountedPrice = originalPrice - (originalPrice * discount / 100);
      return discountedPrice;
  }

    onRemoveClicked(orderItemId: number): void {
          this.service.removeFromCart(this.shoppingCartId, orderItemId).subscribe({
            next: () => {
              this.orderItems = this.orderItems.filter(item => item.id !== orderItemId);
              this.numberOfItems -= 1;
              this.service.getTotalPriceByUserId(this.userId).subscribe({
                next: (result: number) => {
                  this.totalPrice = this.calculateDiscountedPrice(result,this.firstPurchaseDiscount)
                  this.totalPrice = this.calculateDiscountedPrice(this.totalPrice,this.discount)
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
      if (!this.profile.isFirstPurchased) {
        this.profile.isFirstPurchased = true;
        this.adminService.updateProfile(this.profile).subscribe((data)=>{})
      }
      this.service.createTokens(this.orderItems, this.userId,this.discount).subscribe({
        next: () => {
          alert('Checkout successful! Purchase reports added to your profile.');
          this.numberOfItems = 0;
          this.totalPrice = 0;
          this.orderItems = [];
          this.profile.isFirstPurchased = true;
          this.firstPurchaseDiscount = 0;
          this.discount = 0
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
