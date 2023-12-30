import { Price } from './price.model'; // Import the Price model

export interface OrderItem {
    id?: number;
    itemId: number;
    itemName: string;
    price: number;
    isBought: boolean;
    isBundle: boolean;
    shoppingCartId: number;
    image: string;
}