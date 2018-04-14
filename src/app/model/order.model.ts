import { OrderLine } from "./orderline.model";

export class Order {

    constructor(
        public id?: number,
        public name?: string,
        public orderlines?: OrderLine[]) {}

}

export type orderQuery = {    
    readOrderFromDB: Order;
}
