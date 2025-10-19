
import { Category } from "./category";
import { Provider } from "./provider";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    amount: number;
    category: string;
    conditions: string;
    expirationDate: string;
    batch: string;
    provider: string;
    deliveryTime: string;
}
