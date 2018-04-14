import { Datamaster } from "../model/datamaster.model";

export class OrderName extends Datamaster {}

export type ordernameQuery = {    
    readAllOrderNamesFromDB: OrderName[];
}
