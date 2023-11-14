import { Price } from './price.model'; 

export interface ShoppingCart {
    id?: number;
    userId: number;
    items: Number[];
    totalPrice: number;
}