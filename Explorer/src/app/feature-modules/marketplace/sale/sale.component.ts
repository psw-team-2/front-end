import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Router } from "@angular/router";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { Tour } from "../../tour-authoring/model/tour.model";
import { TourAuthoringService } from "../../tour-authoring/tour-authoring.service";
import { MarketplaceService } from "../marketplace.service";
import { Sale } from "../model/sale.model";

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
    tourNameFilter:string;
    
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
            this.getAllSales()
        })

    }
    filterbyName(){
        console.log(this.saleToursMap)
        this.sales = this.sales.filter((sale,index)=>{
           for (let i = 0; i < this.tours.length; i++) {
            const tour = this.tours[i];
            if (tour.name.includes(this.tourNameFilter)) {
                if (sale.tourIds.includes(tour.id!)) {
                    return true
                }
                return false;
            }
            return false
           }
           return false
        })
    }

    getAllSales() {
        this.service.getAllSales().subscribe(
            (result) => {
                this.sales = result.results;
                for (const sale of this.sales) {
                    if (sale.id !== undefined && sale.tourIds.length != 0) {
                        this.service.getAllToursFromSale(sale.id).subscribe(
                            (tours) => {
                                this.tours = tours;
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
            },
            (error) => {
                console.log('Greska pri ucitavanju svih sales')
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

    openDetails(tour: Tour):void{
        this.router.navigate([`tour-details/${tour.id}`]);
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