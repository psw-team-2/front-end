import { Component, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { ShoppingCart } from '../../marketplace/model/shopping-cart.model';
import { AuthService } from '../../../infrastructure/auth/auth.service'; 

@Component({
  selector: 'xp-view-tours',
  templateUrl: './view-tours.component.html',
  styleUrls: ['./view-tours.component.css']
})
export class ViewToursComponent implements OnInit {
  tours: Tour[] = [];
  selectedTour: Tour;
  shoppingCartId: Number;
  shoppingCart: ShoppingCart;

  constructor(private service: TourAuthoringService, private authService: AuthService) {
    
  }

  async ngOnInit(): Promise<void> {
    await this.getTours();
    this.loadShoppingCart();
  }


  async getTours(): Promise<void> {
    try {
      const result: PagedResults<Tour> | undefined = await this.service.getTours().toPromise();

      if (result) {
        this.tours = result.results;
        console.log(this.tours);
      } else {
        // Handle the case where result is undefined
      }
    } catch (error) {
      // Handle errors if needed
    }
  }


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

    onAddClicked(tour: Tour): void {
      this.service.getShoppingCartById(this.shoppingCartId).subscribe({
        next: (result: ShoppingCart) => {
          this.shoppingCart = result;
          this.service.addToCart(this.shoppingCart, tour).subscribe({
            next: () => {
  
            },
            error: () => {
            }
            
          })
        }
      })
    }
  

  
}
