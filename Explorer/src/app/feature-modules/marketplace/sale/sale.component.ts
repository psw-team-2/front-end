import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Router } from "@angular/router";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { Tour } from "../../tour-authoring/model/tour.model";
import { TourAuthoringService } from "../../tour-authoring/tour-authoring.service";
import { MarketplaceService } from "../marketplace.service";
import { Sale } from "../model/sale.model";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { ShoppingCart } from "../model/shopping-cart.model";
import { OrderItem } from '../model/order-item.model';
@Component({
    selector: 'xp-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.css']
})
  export class SaleComponent implements OnInit{
    
    tours:Tour[]
    user: User;
    isAuthor: boolean = false;
    saleToursMap: { [saleId: number]: Tour[] } = {};
    sales: Sale[];
    filteredSales:Sale[];
    tourNameFilter:string;
    alltoursFromSale:Tour[] = []
    alltoursFromSale2:Array<Tour[]> = []
    shoppingCart: ShoppingCart;
    numberOfItems: number;
    
    constructor(
        private service: MarketplaceService,
        private authService: AuthService,
        private router:Router,
        private tourAuthoringService: TourAuthoringService) { }
  
    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            if (this.user.role === 'author') {
                console.log(this.user.role)
                this.isAuthor = true
            }
            
        })
        this.getAllSales()
        this.tourAuthoringService.getTours().subscribe((data:PagedResults<Tour>)=>{
            this.tours = data.results
        })
    }

    filterSalesByTourName() {
        console.log(this.tours)
        if (this.tourNameFilter !== '') {
            const tourIds = this.tours.filter((tour:Tour) => tour.name.toLocaleLowerCase().includes(this.tourNameFilter.toLowerCase())).map(tour => tour.id);
            this.filteredSales =  this.sales.filter(sale => sale.tourIds.some(tourId => tourIds.includes(tourId)));
        }
        else {
            this.filteredSales = this.sales;
        }
    }

    sortSalesByDiscount(ascending: any): void {
        if (ascending == 'true') {
            this.filteredSales.sort((a, b) => a.discount - b.discount);
        }
        else {
            this.filteredSales.sort((a, b) => b.discount - a.discount);
        }
    }
    buyTour(sale:Sale){
        this.tourAuthoringService.getShoppingCartByUserId(this.user.id).subscribe({
            next: (result: ShoppingCart) => {
              this.shoppingCart = result;
              let list:Tour[] = [];
              for (let i = 0; i < sale.tourIds.length; i++) {
                const tourid = sale.tourIds[i];
                list = this.tours.filter((tour)=>{
                    if (tour.id == tourid) {
                        return true
                    }
                    return false;
                })
              }
              for (let j = 0; j < list.length; j++) {
                const element:Tour = list[j];
                let newPrice = this.calculateDiscountedPrice(element.price,sale.discount)
                this.tourAuthoringService.addToCart(this.shoppingCart,element,newPrice ).subscribe({
                    next: () => {
                        this.router.navigate(['shopping-cart'])
                    },
                    error: () => {
                    }
                    
                  })
                
              }
              
            }
          })
    }
    getAllSales() {
        this.service.getAllSales().subscribe(
            (result) => {
                this.sales = result.results;
                this.filteredSales =result.results
                for (const sale of this.sales) {
                    if (sale.id !== undefined && sale.tourIds.length != 0) {
                        this.service.getAllToursFromSale(sale.id).subscribe(
                            (tours) => {
                                this.alltoursFromSale2.push(tours)
                                if (sale.id !== undefined) {
                                this.saleToursMap[sale.id] = tours;
                                }
                            },
                            (error) => {
                            console.log(`Greska pri dohvatanju tura za sale ID: ${sale.id}`);
                            }
                        );
                    }
                }
            }
        )
    }
    calculateDiscountedPrice(originalPrice: number, discount: number): number {
        const discountedPrice = originalPrice - (originalPrice * discount / 100);
        return discountedPrice;
    }
  
    createSale() {
        this.router.navigate([`/addSale/`]);
    }

    
    isCurrentUserAuthor(sale: Sale) {
        return sale.authorId === this.user.id
    }
    
    editSale(sale: Sale) {
        this.service.setMessage(sale);
        this.router.navigate(['/editSale/']);
    }

    deleteSale(saleId: number) {
        this.sales.filter((el)=>{el.id})
        this.service.deleteSale(saleId).subscribe((data)=>{
            console.log(data)
            this.getAllSales();
        });
    }
}