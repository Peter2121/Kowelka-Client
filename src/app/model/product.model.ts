export class Product {

    constructor(        
        public id? : number,
        public name? : string,
        public catname? : string,
        public catid? : number) { }   
            
}

export type productQuery = {
    
  readAllProdFromDB: Product[];
  
};
