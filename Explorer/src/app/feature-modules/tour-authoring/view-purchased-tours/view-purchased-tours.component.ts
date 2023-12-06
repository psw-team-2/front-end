import { Component } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { OrderItem } from '../../marketplace/model/order-item.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-view-purchased-tours',
  templateUrl: './view-purchased-tours.component.html',
  styleUrls: ['./view-purchased-tours.component.css']
})
export class ViewPurchasedToursComponent {
  tours: Tour[] = [];
  orderItems: OrderItem[] = [];
  currentUser: User;

  constructor(private service: TourAuthoringService, private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });

    await this.getOrderItems();
    await this.getTours();
  }

  async getOrderItems(): Promise<void> {
    try {
      const result: PagedResults<OrderItem> | undefined = await this.service.getOrderItemsByUser(this.currentUser.id).toPromise();

      if (result) {
        //@ts-ignore
        this.orderItems = result;
        this.orderItems = this.orderItems.filter(item => item.isBought);
      }
    } catch (error) { }
  }

  async getTours(): Promise<void> {
    try {
      for (let orderItem of this.orderItems) {
        const result: Tour | undefined = await this.service.getTour(orderItem.itemId).toPromise();

        if (result) {
          this.tours.push(result);console.log(result)
        }
      }
    } catch (error) { }
  }
}
