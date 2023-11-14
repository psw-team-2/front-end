import { Price } from './price.model'; // Import the Price model

export interface OrderItem {
    id: number;
    tourId: number;
    tourName: string;
    price: number;
}