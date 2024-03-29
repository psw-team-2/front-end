import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Checkpoint } from './model/checkpoint.model';
import { Equipment } from './model/equipment.model';
import { Observable, throwError, of } from 'rxjs';
import { Tour } from './model/tour.model';
import { environment } from 'src/env/environment';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecution } from '../tour-execution/model/tourexecution.model';
import { TourPurchaseToken } from './model/tourPurchaseToken.model';
import { PublicRequest } from './model/public-request.model';
import { Object } from './model/object.model';
import { ShoppingCart } from '../marketplace/model/shopping-cart.model';
import { OrderItem } from '../marketplace/model/order-item.model';
import { PaymentNotification } from './model/paymentNotification.model';
import { Bundle } from './model/bundle.model';
import { TourBundle } from './model/tour-bundle.model';
import { Wishlist } from './model/wishlist.model';
import { FavouriteItem } from './model/favourite-item.model';
import { GiftCard } from './model/gift-card.model';



@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>('https://localhost:44333/api/author/equipment?page=0&pageSize=0')
  }

  getEquipmentTourist(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>('https://localhost:44333/api/tourist/equipment?page=0&pageSize=0')
  }


  getCheckpoints() : Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>('https://localhost:44333/api/addcheckpoint/checkpoint?page=0&pageSize=0');
  }
  getCheckpointById(checkpointId: Number): Observable<Checkpoint> {
    return this.http.get<Checkpoint>(`https://localhost:44333/api/addcheckpoint/checkpoint/${checkpointId}`);
  }
  addCheckpoint(checkpoint: Checkpoint) : Observable<Checkpoint>{
    return this.http.post<Checkpoint>('https://localhost:44333/api/addcheckpoint/checkpoint/', checkpoint)
  }

  updateCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint>{
    return this.http.put<Checkpoint>('https://localhost:44333/api/addcheckpoint/checkpoint/' + checkpoint.id, checkpoint)
  }

  deleteCheckpoint(id: number): Observable<Checkpoint> {
    return this.http.delete<Checkpoint>('https://localhost:44333/api/addcheckpoint/checkpoint/' + id);
  }

  getCheckpointsByVisitedCheckpoints(checkpointsVisitedIds:number[]) : Observable<PagedResults<Checkpoint>>{
    return this.http.put<PagedResults<Checkpoint>>("https://localhost:44333/api/addcheckpoint/checkpoint/visited", checkpointsVisitedIds)  ;
  }

  getObjectById(objectId: Number): Observable<Object> {
    return this.http.get<Object>('https://localhost:44333/api/administration/object/' + objectId);
  }

  updateObject(object: Object): Observable<Object>{
    return this.http.put<Object>('https://localhost:44333/api/administration/object/' + object.id, object)
  }
  addObject( object: Object): Observable<Object>
  {
    return this.http.post<Object>(environment.apiHost+ 'administration/object',object)
  }

  uploadObject(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `https://localhost:44333/api/administration/object/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
    sendPublicRequest(publicRequest: PublicRequest): Observable<PublicRequest> {
      return this.http.post<PublicRequest>('https://localhost:44333/api/author/tour/publicRequest', publicRequest)
    }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `https://localhost:44333/api/addcheckpoint/checkpoint/UploadFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  uploadImage(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `https://localhost:44333/api/author/tour/uploadTourImage`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getToursWithAuth(user:User | undefined) : Observable<PagedResults<Tour>> {

    if(user){
      if(user.role === 'administrator'){
        return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/administrator/tour?page=0&pageSize=0');
      }
      else if(user.role === 'author'){
        return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/author/tour?page=0&pageSize=0');
      }else if(user.role === 'tourist'){
        //      Function call if need for tourist role in the future, not implemented in back-end currently
        //      return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/tourist/tour?page=0&pageSize=0');
        //      Temporary return result
        return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/administrator/tour?page=0&pageSize=0');
      }
      else{
        error: () => {
          console.error('An error occurred: Given Role is non-existent');
          return throwError('Given Role is non-existent');
          
        }
        return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/administrator/tour?page=0&pageSize=0');
      }
    }else{
      return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/administrator/tour?page=0&pageSize=0');      
    }
  }

  getTours() : Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>('https://localhost:44333/api/author/tour?page=0&pageSize=0');
  }

  getTour(id: Number): Observable<Tour> {
    return this.http.get<Tour>('https://localhost:44333/api/author/tour/' + id);
  }

  addTour(tour: Tour) : Observable<Tour>{
    console.log(tour);
    return this.http.post<Tour>('https://localhost:44333/api/author/tour' , tour)
  }


  updateTour(tour: Tour): Observable<Tour>{
    return this.http.put<Tour>('https://localhost:44333/api/author/tour/' + tour.id, tour)
  }

  updateTourCheckpoints(tour:Tour,checkpointId:number) {
    return this.http.put<Tour>('https://localhost:44333/api/author/tour/' + tour.id + '/' + checkpointId,tour);

  }
  deleteTourCheckpoint(tour:Tour,checkpointId:number) {
    return this.http.put<Tour>('https://localhost:44333/api/author/tour/delete/' + tour.id + '/' + checkpointId,tour);

  }

  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>('https://localhost:44333/api/author/tour/' + id);
  }

  addEquipmentToTour(equipment: Equipment, tour: Tour) : Observable<Equipment>{
    console.log(equipment);
    console.log(tour);
    return this.http.post<Equipment>('https://localhost:44333/api/author/tour/tourEquipment/' + tour.id +  '/' + equipment.id,tour)
  }

  removeEquipmentFromTour(equipmentId: number, tour: Tour) : Observable<Equipment>{
    return this.http.put<Equipment>('https://localhost:44333/api/author/tour/remove/' + tour.id +  '/' + equipmentId,tour)
  }


  getAverageGrade(tourId: number):Observable<any>{
    return this.http.get<number>(environment.apiHost + 'author/tour/average-grade/'+tourId)
  }

  getAverageWeeklyGrade(tourId: number):Observable<any>{
    return this.http.get<number>(environment.apiHost + 'author/tour/average-weekly-grade/'+tourId)
  }

  startTour(tourExecution: TourExecution) : Observable<TourExecution> {
    return this.http.post<TourExecution>('https://localhost:44333/api/tourexecution/start', tourExecution);
  } 
  getBoughtTours():Observable<PagedResults<TourPurchaseToken>> {
    return this.http.get<PagedResults<TourPurchaseToken>>('https://localhost:44333/api/tourist/tourPurchaseToken/getAllTokens?page=0&pageSize=0')
  }

  deleteTourAdministrator(id: number): Observable<Tour>{
    return this.http.delete<Tour>('https://localhost:44333/api/administrator/tour/' + id);
  }


  getPublicRequestsByUserId(userId: number): Observable<PagedResults<PublicRequest>> {
    return this.http.get<PagedResults<PublicRequest>>('https://localhost:44333/api/administrator/publicRequest/get/' + userId);
  }

  getShoppingCartByUserId(userId: number): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(`https://localhost:44333/api/tourist/shoppingCart/user/2`);
  }

  getShoppingCartById(id: Number): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>('https://localhost:44333/api/tourist/shoppingCart/' + id);
  }

  addToCart(shoppingCart: ShoppingCart, tour: Tour,newPrice:number) {
    return this.http.post<ShoppingCart>('https://localhost:44333/api/tourist/shoppingCart/shoppingItem/' + shoppingCart.id + '/' + tour.id, newPrice);
  }

  getOrderItemsByShoppingCart(userId: number): Observable<OrderItem[]> {
    const encodedUserId = encodeURIComponent(userId.toString());
    console.log(`Encoded User ID: ${encodedUserId}`);
    return this.http.get<OrderItem[]>(`https://localhost:44333/api/tourist/orderItem/orderItems/${encodedUserId}`);
  } 

  getOrderItemsByUser(userId: number): Observable<PagedResults<OrderItem>> {
    return this.http.get<PagedResults<OrderItem>>('https://localhost:44333/api/tourist/orderItem/orderItems/' + userId);
  }

  getUnreadPaymentNotifications(userId: number) : Observable<PagedResults<PaymentNotification>>{
    return this.http.get<PagedResults<PaymentNotification>>('https://localhost:44333/api/administrator/paymentNotification/unread-notifications/' + userId);
  }

  
  getAllBundles(): Observable<PagedResults<Bundle>> {
    return this.http.get<PagedResults<Bundle>>('https://localhost:44333/api/author/bundle?page=0&pageSize=0')
  }

  getBundleById(id: number): Observable<Bundle> {
    return this.http.get<Bundle>(`https://localhost:44333/api/author/bundle/`+id);
    
  }

  createBundle(bundle: Bundle): Observable<Bundle> {
    return this.http.post<Bundle>('https://localhost:44333/api/author/bundle', bundle);
   
  }

  updateBundle(bundle: Bundle): Observable<Bundle> {
    return this.http.put<Bundle>(`https://localhost:44333/api/author/bundle/` + bundle.id, bundle);  
  }

  deleteBundle(id: number): Observable<Bundle> {
    return this.http.delete<Bundle>(`https://localhost:44333/api/author/bundle/` + id);
    
  }

  archiveBundle(id: number, bundle: Bundle): Observable<Bundle> {
    return this.http.put<Bundle>(`https://localhost:44333/api/author/bundle/archive/` + id, bundle);
    
  }

  finishCreatingBundle(bundle: Bundle , price: number): Observable<Bundle>{
    return this.http.put<Bundle>(`https://localhost:44333/api/author/bundle/finish-creating/${bundle.id}/` + price,  bundle);  
  }

  getBundlesByAuthorId(userId: number): Observable<Bundle[]> {
    return this.http.get<Bundle[]>(`https://localhost:44333/api/author/bundle/byAuthor/${userId}`);
  }

  getToursByAuthorId(userId: number): Observable<TourBundle[]> {
    return this.http.get<TourBundle[]>(`https://localhost:44333/api/author/tour/byAuthor/${userId}`);
  }


  addTourToBundle(tourId: number, bundle: Bundle): Observable<Bundle> {
    return this.http.post<Bundle>(`https://localhost:44333/api/author/bundle/addTour/${tourId}`, bundle);
  }

  removeTourFromBundle(tourId: number, bundle: Bundle): Observable<void> {
    return this.http.put<void>('https://localhost:44333/api/author/bundle/removeTour/'+ bundle.id + '/' + tourId, null);
  }

  publishBundle(bundle: Bundle): Observable<Bundle> {
    return this.http.put<Bundle>(`https://localhost:44333/api/author/bundle/publish/${bundle.id}`,  bundle);  
  }

  addBundleToCart(shoppingCart: ShoppingCart, bundle: Bundle) {
    return this.http.post<ShoppingCart>('https://localhost:44333/api/tourist/shoppingCart/bundleItem/' + shoppingCart.id + '/' + bundle.id,shoppingCart);
  }

  
  publishBundle2(bundle: Bundle): Observable<Bundle> {
    return this.http.put<Bundle>(`https://localhost:44333/api/author/bundle/publish/${bundle.id}`, bundle);  
  }

  /*getWishlist(userId: number): Observable<PagedResults<Wishlist>> {
    return this.http.get<PagedResults<Wishlist>>(`https://localhost:44333/api/tourist/wishlist/user/${userId}`);
  }*/

  /*addWishlistItem(wishlistId: number, tourId: number): Observable<Wishlist> {
    return this.http.post<Wishlist>(`https://localhost:44333/api/tourist/wishlist/wishlistItem/${wishlistId}/${tourId}`, {});
  }*/

  getWishlist(id: Number): Observable<Wishlist> {
    return this.http.get<Wishlist>(`https://localhost:44333/api/tourist/wishlist/user/` + id);
  }

  addWishlistItem(wishlistId: Number, tour: Tour) {
    return this.http.post<Wishlist>(`https://localhost:44333/api/tourist/wishlist/wishlistItem/${wishlistId}/${tour.id}`,{});
  }
  

  getActiveTours(tourIds: (number | undefined)[]): Observable<PagedResults<Tour>> {
    const validTourIds = tourIds.filter(id => typeof id === 'number') as number[];

    return this.http.put<PagedResults<Tour>>('https://localhost:44333/api/author/tour/active-tours', validTourIds, {
      headers: { 'Content-Type': 'application/json' } // Ensure JSON content type
    });
  }

  removeWishlistItem(wishlistId: number, itemId: number): Observable<Wishlist> {
    return this.http.put<Wishlist>(`https://localhost:44333/api/tourist/wishlist/removeItem/${wishlistId}/${itemId}`, {});
  }

  removeAllWishlistItems(wishlistId: number): Observable<Wishlist> {
    return this.http.put<Wishlist>(`https://localhost:44333/api/tourist/wishlist/removeAllItems/${wishlistId}`, {});
  }

  getFavouriteItems(wishlistId: number): Observable<PagedResults<FavouriteItem>> {
    
    return this.http.get<PagedResults<FavouriteItem>>(`https://localhost:44333/api/tourist/favouriteItem/favouriteItems/${wishlistId}`);
  }

  updateFavouriteItem(favouriteItem: FavouriteItem): Observable<FavouriteItem> {
    return this.http.put<FavouriteItem>(`https://localhost:44333/api/tourist/favouriteItem/update/${favouriteItem.id}`, favouriteItem);
  }

  addWishlistItem2(wishlist: Wishlist, tourId: Number) {
    return this.http.post<Wishlist>(`https://localhost:44333/api/tourist/wishlist/wishlistItem/${wishlist.id}/${tourId}`,wishlist);
  }

  sendGift(giftCard: GiftCard): Observable<GiftCard> {
    return this.http.post<GiftCard>(`https://localhost:44333/api/tourist/giftCard`, giftCard);  
  }
}












