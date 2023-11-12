import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { TourReview } from './model/tour-review.model';
import { Injectable } from '@angular/core';
import { ApplicationReview } from './model/application-review.model'; // Updated import

import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Equipment } from '../administration/model/equipment.model';
import { OrderItem } from './model/order-item.model';
import { ShoppingCart } from './model/shopping-cart.model';


@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }


  
  getTourReview(): Observable<PagedResults<TourReview>> {
    return this.http.get<PagedResults<TourReview>>(environment.apiHost + 'tourist/tourReview')
  }

  deleteTourReview(id: number): Observable<TourReview> {
    return this.http.delete<TourReview>(environment.apiHost + 'tourist/tourReview/' + id);
  }

  addTourReview(tourReview: TourReview): Observable<TourReview> {
    return this.http.post<TourReview>(environment.apiHost + 'tourist/tourReview', tourReview);
  }

  addImage(tourReview: TourReview): Observable<TourReview>{
    return this.http.post<TourReview>(environment.apiHost + 'tourist/tourReview/uploadFile', tourReview);
  }
  updateTourReview(tourReview: TourReview): Observable<TourReview> {
    return this.http.put<TourReview>(environment.apiHost + 'tourist/tourReview/' + tourReview.id, tourReview);
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `https://localhost:44333/api/tourist/tourReview/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  addApplicationReview(applicationReview: ApplicationReview): Observable<ApplicationReview> { 
    return this.http.post<ApplicationReview>(environment.apiHost + 'tourist/applicationReview', applicationReview); 
  }

  getOrderItemsByShoppingCart(userId: number): Observable<OrderItem[]> {
    const encodedUserId = encodeURIComponent(userId.toString());
    console.log(`Encoded User ID: ${encodedUserId}`);
    return this.http.get<OrderItem[]>(`https://localhost:44333/api/tourist/orderItem/orderItems/${encodedUserId}`);
  }  


  getShoppingCartByUserId(userId: number): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(`https://localhost:44333/api/tourist/shoppingCart/user/${userId}`);
  }

  removeFromCart(shoppingCart: ShoppingCart, orderItemId: number): Observable<void> {
    return this.http.put<void>('https://localhost:44333/api/tourist/remove/'+ shoppingCart.id + '/' + orderItemId, shoppingCart);

  }

  createTokens(orderItems: OrderItem[], userId: number): Observable<OrderItem[]> {
    return this.http.post<OrderItem[]>(`https://localhost:44333/api/tourist/tourPurchaseToken/createTokens/${userId}`, orderItems);
  }

}
