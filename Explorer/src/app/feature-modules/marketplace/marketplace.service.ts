import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { TourReview } from './model/tour-review.model';
import { Injectable } from '@angular/core';
import { ApplicationReview } from './model/application-review.model'; // Updated import

import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/env/environment';
import { Equipment } from '../administration/model/equipment.model';
import { OrderItem } from './model/order-item.model';
import { ShoppingCart } from './model/shopping-cart.model';
import { Sale } from './model/sale.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { TourPurchaseToken } from '../tour-authoring/model/tourPurchaseToken.model';


@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  private saleForEdt = new Subject<Sale>;

  public getMessage(): Observable<Sale> {
    return this.saleForEdt.asObservable();
  }

  public setMessage(sale: Sale) {
    return this.saleForEdt.next(sale);
  }


  getSale(saleId: number) :Observable<any>{
    throw new Error("Method not implemented.");
  }
  createSale(sale: Sale):Observable<any> {
    return this.http.post<PagedResults<Sale>>(environment.apiHost + 'author/toursale',sale);
  }
  updateSale(sale: Sale) :Observable<any>{
    return this.http.put<PagedResults<Sale>>(environment.apiHost + 'author/toursale',sale);
  }

  constructor(private http: HttpClient) { }


  
  getTourReview(): Observable<PagedResults<TourReview>> {
    return this.http.get<PagedResults<TourReview>>(environment.apiHost + 'tourist/tourReview')
  }
  getAverageGrade(tourId: number):Observable<any>{
    return this.http.get<any>(environment.apiHost + 'author/tour/average-grade/'+tourId)
  }

  getTourReviewByTourId(id: number): Observable<PagedResults<TourReview>> {
    return this.http.get<PagedResults<TourReview>>(environment.apiHost + 'tourist/tourReview/byTour/' + id);
  }
  
  deleteTourReview(id: number): Observable<TourReview> {
    return this.http.delete<TourReview>(environment.apiHost + 'tourist/tourReview/' + id);
  }

  addTourReview(tourReview: TourReview, userId: number): Observable<TourReview> {
    return this.http.post<TourReview>(environment.apiHost + 'tourist/tourReview/'+ userId, tourReview);
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

  removeFromCart(shoppingCartId: number, orderItemId: number): Observable<void> {
    return this.http.put<void>('https://localhost:44333/api/tourist/shoppingCart/removeItem/'+ shoppingCartId + '/' + orderItemId, null);
  }

  updateApplicationReview(applicationReview: ApplicationReview): Observable<ApplicationReview> { 
    return this.http.put<ApplicationReview>(environment.apiHost + 'tourist/applicationReview/' + applicationReview.id, applicationReview); // Updated endpoint
  }
 
  
  createTokens(orderItems: OrderItem[], userId: number,discount:number): Observable<OrderItem[]> {
    return this.http.post<OrderItem[]>(`https://localhost:44333/api/tourist/tourPurchaseToken/createTokens/${userId}/`+discount, orderItems);
  }

  getTokensByTourId(tourId: number): Observable<PagedResults<TourPurchaseToken>>{
  return this.http.get<PagedResults<TourPurchaseToken>>(environment.apiHost + 'tourist/tourPurchaseToken/by-tour/' + tourId);    
  }

  getWeeklyTokensByTourId(tourId: number): Observable<PagedResults<TourPurchaseToken>>{
    return this.http.get<PagedResults<TourPurchaseToken>>(environment.apiHost + 'tourist/tourPurchaseToken/by-tour-weekly/' + tourId);    
    }

  removeAllItems(shoppingCartId: number): Observable<ShoppingCart> {
    return this.http.put<ShoppingCart>(`https://localhost:44333/api/tourist/shoppingCart/removeAllItems/${shoppingCartId}`,shoppingCartId);
  }

  getTotalPriceByUserId(userId: number): Observable<number> {
    return this.http.get<number>(`https://localhost:44333/api/tourist/shoppingCart/totalPrice/${userId}`)
  }
  

  updateOrderItem(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.put<OrderItem>(environment.apiHost + 'tourist/orderItem/update/' + orderItem.id, orderItem);
  }

  getAllSales():Observable<PagedResults<Sale>>{
    return this.http.get<PagedResults<Sale>>(environment.apiHost + 'author/toursale/all')
  }

  getAllToursFromSale(saleId:number):Observable<Tour[]>{
    return this.http.get<Tour[]>(environment.apiHost + 'author/toursale/toursOnSale/'+saleId)
  }
  deleteSale(saleId:number):Observable<PagedResults<Sale>>{
    return this.http.delete<PagedResults<Sale>>(environment.apiHost + 'author/toursale/'+saleId)
  }

}
