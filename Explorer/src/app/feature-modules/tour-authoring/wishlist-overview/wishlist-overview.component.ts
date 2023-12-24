import { Component, OnInit } from '@angular/core';
import { FavouriteItem } from '../model/favourite-item.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-wishlist-overview',
  templateUrl: './wishlist-overview.component.html',
  styleUrls: ['./wishlist-overview.component.css']
})
export class WishlistOverviewComponent implements OnInit {
  favouriteItems: FavouriteItem[] = [];
  userId: number;
  wishlistId: number;
  numberOfItems: number;

  constructor(private service: TourAuthoringService, private authService: AuthService) { }

  ngOnInit(): void {
    // Pozovite funkciju za dobavljanje favourite items
    this.getFavouriteItems();
  }

  getFavouriteItems(): void {
    if (this.authService.user$ && this.authService.user$.value) {
      this.userId = this.authService.user$.value.id;
      this.wishlistId = this.userId;
  
      this.service.getFavouriteItems(this.userId).subscribe({
        next: (result: any) => {
          console.log('Result:', result);
  
          if (Array.isArray(result) && result.length > 0) {
            this.favouriteItems = result;
            this.numberOfItems = this.favouriteItems.length;
  
            console.log('Favourite items:', this.favouriteItems);
          } else {
            console.log('No favourite items found in results.');
          }
        },
        error: (error) => {
          console.error('Error fetching favourite items:', error);
        }
      });
    } else {
      console.error('AuthService user$ or value is not defined.');
    }
  }
  
  
  
  
}
