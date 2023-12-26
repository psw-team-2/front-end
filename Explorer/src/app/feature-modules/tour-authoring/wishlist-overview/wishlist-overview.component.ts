import { Component, OnInit } from '@angular/core';
import { FavouriteItem } from '../model/favourite-item.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Wishlist } from '../model/wishlist.model';
import { forkJoin, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-wishlist-overview',
  templateUrl: './wishlist-overview.component.html',
  styleUrls: ['./wishlist-overview.component.css']
})
export class WishlistOverviewComponent implements OnInit {
  favouriteItems: FavouriteItem[] = [];
  userId: number;
  wishlistId: number;
  wishlist: Wishlist;
  numberOfItems: number;

  constructor(private service: TourAuthoringService, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Pozovite funkciju za dobavljanje favourite items
    //this.getFavouriteItems();
    //this.loadWishlist();
    this.loadWishlistAndFavourites();
  }

  /*getFavouriteItems(): void {
    if (this.authService.user$ && this.authService.user$.value) {
      this.userId = this.authService.user$.value.id;
      
  
      this.service.getFavouriteItems(this.wishlist.id!).subscribe({
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
  
  loadWishlist(): void {
    if (this.authService.user$ && this.authService.user$.value) {
      this.userId = this.authService.user$.value.id;
      this.service.getWishlist(this.userId).subscribe({
        next: (wishlist: Wishlist) => {
          this.wishlist = wishlist; // Assign wishlist value when retrieved
        },
        error: (error) => {
          console.error('Error fetching wishlist:', error);
        }
      });
    } else {
      console.error('AuthService user$ or value is not defined.');
    }
  }*/


  loadWishlistAndFavourites(): void {
    if (this.authService.user$ && this.authService.user$.value) {
      this.userId = this.authService.user$.value.id;
  
      const wishlist$ = this.service.getWishlist(this.userId);
      const favouriteItems$ = wishlist$.pipe(
        switchMap((wishlist: Wishlist) => {
          this.wishlist = wishlist; // Assign wishlist value when retrieved
          return this.service.getFavouriteItems(this.wishlist.id!);
        })
      );
  
      forkJoin({ wishlist: wishlist$, favouriteItems: favouriteItems$ }).subscribe({
        next: (results: { wishlist: Wishlist, favouriteItems: any }) => {
          // Handle wishlist and favourite items once both are fetched
          console.log('Wishlist:', results.wishlist);
          console.log('Favourite items:', results.favouriteItems);
  
          // Process the fetched data
          if (Array.isArray(results.favouriteItems) && results.favouriteItems.length > 0) {
            this.favouriteItems = results.favouriteItems;
            this.numberOfItems = this.favouriteItems.length;
            console.log('Favourite items:', this.favouriteItems);
          } else {
            console.log('No favourite items found in results.');
          }
        },
        error: (error) => {
          console.error('Error fetching wishlist or favourite items:', error);
        }
      });
    } else {
      console.error('AuthService user$ or value is not defined.');
    }
  }
  

removeFromWishlist(itemId: number): void {
  // Odmah uklonite stavku iz liste favouriteItems
  this.favouriteItems = this.favouriteItems.filter(item => item.id !== itemId);

  // Sada pozovite servis ili API da izbriše stavku iz wishlist-e
  this.service.removeWishlistItem(this.wishlist.id!, itemId).subscribe({
      next: () => {
          console.log('Item removed from wishlist successfully.');
          this.showSnackbar('Item removed from wishlist successfully!');
      },
      error: (err) => {
          console.error('Error removing item from wishlist:', err);
      }
  });
}
  
navigateToTourDetails(tourId: number): void {
  this.router.navigate(['/tour', tourId]); // Prilagodite putanju prema vašim potrebama
}

showSnackbar(message: string): void {
  this.snackBar.open(message, 'Close', {
    duration: 3000, // Vreme trajanja snackbar-a (u milisekundama)
  });
}

  
}
