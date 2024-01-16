import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';
import { ShoppingCart } from '../../marketplace/model/shopping-cart.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { OrderItem } from '../../marketplace/model/order-item.model';


@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  shoppingCartId: Number;
  shoppingCart: ShoppingCart;
  isLogged: boolean;
  userId: Number;
  numberOfItems: number;
  orderItems: OrderItem[];
  constructor(private authService: AuthService, 
              private router: Router,
              private service: TourAuthoringService) {}

  isProfilePage(): boolean {
    return this.router.url === '/profile';
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
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
    });
    
  }

  onLogout(): void {
    this.authService.logout();
  }
}
