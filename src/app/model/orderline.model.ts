import { Product } from "./product.model";

export class OrderLine {
    
    constructor(        
        public product: Product,
        public numproducts: number) {}

}