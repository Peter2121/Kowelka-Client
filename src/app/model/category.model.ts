import { Datamaster } from "../model/datamaster.model";

export class Category extends Datamaster {}

export type categoryQuery = {    
    readAllCatFromDB: Category[];
}
