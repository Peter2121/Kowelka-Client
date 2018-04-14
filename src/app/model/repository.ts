import { Injectable } from "@angular/core";
import { Product, productQuery } from "./product.model";
import { Product as InProd } from "./product.model";
import { Category, categoryQuery } from "./category.model";
import { Category as InCat } from "./category.model";
import { Datamaster } from "./datamaster.model";
import { Datamaster as InDatamaster} from "./datamaster.model";
import { OrderName, ordernameQuery } from "./ordername.model";
import { InOrderline } from "./inorderline.model";
import { OrderLine } from "./orderline.model";
import { Order, orderQuery } from "./order.model";
import { OrderName as InOrdername } from "./ordername.model";
import { GraphQLClient } from "../model/GraphQLClient";
import { Observable } from 'rxjs/Observable';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

@Injectable()
export class Repository {
    
    private products: Observable<Product[]>;
    private categories: Observable<Category[]>;
    private ordernames: Observable<OrderName[]>;
    private order: Observable<Order>;
    private lastOrderId: number = 0;
    
    private quAllProducts = gql`
        query readAllProdFromDB {
            readAllProdFromDB {
              id
              name
              catname
              catid
            }
        }`;
        
    private quAllCategories = gql`
      query readAllCatFromDB {
        readAllCatFromDB {
          id
          name
        }
      }`;

    private quAllOrderNames = gql`
      query readAllOrderNamesFromDB {
        readAllOrderNamesFromDB {
          id
          name
        }
      }`;

    private quOrder = gql`
      query readOrderFromDB($id: Int!) {
        readOrderFromDB(id: $id) {
          id
          name
          orderlines {
            product {
              id
              name
            }
            numproducts            
          }
        }
      }`;
      
    private mutAddProduct = gql`
      mutation addProdToDB($prodname: String!, $catid: Int!) {
        addProdToDB(prodname: $prodname, catid: $catid)
      }`;

    private mutDeleteProd = gql`
      mutation removeProdFromDB($prodid: Int!) {
        removeProdFromDB(id: $prodid)
      }`;

    private mutAddCategory = gql`
      mutation addCatToDB($catname: String!) {
        addCatToDB(catname: $catname)
      }`;
      
    private mutAddOrderName = gql`
      mutation addOrderNameToDB($ordername: String!) {
        addOrderNameToDB(ordername: $ordername)
      }`;
      
    private mutDeleteCategory = gql`
      mutation removeCatFromDB($catid: Int!) {
        removeCatFromDB(id: $catid)
      }`;
      
    private mutDeleteOrder = gql`
      mutation removeOrderFromDB($orderid: Int!) {
        removeOrderFromDB(id: $orderid)
      }`;
      
    private mutAddOrderLine = gql`
      mutation addLineToOrder($orderid: Int!, $oline: InOrderline!) {
        addLineToOrder(idorder: $orderid, oline: $oline)
      }`;
      
    private mutIncOrderLine = gql`
        mutation incOrderLine($orderid: Int!, $prodid: Int!) {
        incOrderLine(idorder: $orderid, idprod: $prodid)
      }`;
        
    private mutDecOrderLine = gql`
        mutation decOrderLine($orderid: Int!, $prodid: Int!) {
        decOrderLine(idorder: $orderid, idprod: $prodid)
      }`;
        
    private mutSaveCategory = gql`
      mutation saveCatToDB($cat: InCat!) {
        saveCatToDB(cat: $cat)
      }`;
      
    private mutSaveProduct = gql`
      mutation saveProdToDB($prod: InProd!) {
        saveProdToDB(prod: $prod)
      }`;

    private mutSaveOrderName = gql`
      mutation saveOrderNameToDB($oname: InOrdername!) {
        saveOrderNameToDB(oname: $oname)
      }`;

    constructor(private apollo: Apollo) {
        
        this.products = this.apollo.watchQuery<productQuery>({
            query: this.quAllProducts
          })
            .valueChanges
            .pipe(
              map((result) => result.data.readAllProdFromDB)
            );
        this.categories = this.apollo.watchQuery<categoryQuery>({
            query: this.quAllCategories
          })
            .valueChanges
            .pipe(
              map((result) => result.data.readAllCatFromDB)
            );
        this.ordernames = this.apollo.watchQuery<ordernameQuery>({
            query: this.quAllOrderNames
          })
            .valueChanges
            .pipe(
              map((result) => result.data.readAllOrderNamesFromDB)
            );
        this.order = null;    
    }
    
    getProducts(): Observable<Product[]> {
        return this.products;
    }
    
    getCategories(): Observable<Category[]> {
        return this.categories;
    }
    
    getOrdernames(): Observable<OrderName[]> {
        return this.ordernames;
    }
    
    getOrder(orderid: number): Observable<Order> {
        this.order = this.apollo.watchQuery<orderQuery>({
            query: this.quOrder,
            variables: {
              id: orderid
            }
          })
            .valueChanges
            .pipe(
            map((result) => result.data.readOrderFromDB)
            );
        this.lastOrderId=orderid;
        return this.order;    
    }

    addProduct(name: string, catid: number): Observable<any> {
        console.log('Sending mutation: ', this.mutAddProduct);
        return this.apollo.mutate({
          mutation: this.mutAddProduct,
          variables: {
            prodname: name,
            catid: catid
          },
          refetchQueries: [{
              query: this.quAllProducts
          }],
          errorPolicy: 'all'
        });        
    }

    addOrderLine(prodid: number, prodnum: number, orderid: number): Observable<any> {
        console.log('Sending mutation: ', this.mutAddOrderLine);
        var orderline : InOrderline = new InOrderline(prodid, prodnum);
        return this.apollo.mutate({
          mutation: this.mutAddOrderLine,
          variables: {
            orderid: orderid,
            oline: orderline
          },
          refetchQueries: [
              { query: this.quOrder, variables: { id : this.lastOrderId } }
          ],
          errorPolicy: 'all'
        });       
        
                
    }

    increaseOrderLine(prodid: number, orderid: number): Observable<any> {
        console.log('Sending mutation: ', this.mutIncOrderLine);        
        return this.apollo.mutate({
          mutation: this.mutIncOrderLine,
          variables: {
            orderid: orderid,
            prodid: prodid
          },
          refetchQueries: [{
              query: this.quOrder, variables: { id : this.lastOrderId } 
          }],
          errorPolicy: 'all'
        });                        
    }

    decreaseOrderLine(prodid: number, orderid: number): Observable<any> {
        console.log('Sending mutation: ', this.mutDecOrderLine);        
        return this.apollo.mutate({
          mutation: this.mutDecOrderLine,
          variables: {
            orderid: orderid,
            prodid: prodid
          },
          refetchQueries: [{
              query: this.quOrder, variables: { id : this.lastOrderId } 
          }],
          errorPolicy: 'all'
        });                
    }

    deleteCategory(id: number): Observable<any> {
        console.log('Sending mutation: ', this.mutDeleteCategory);        
        return this.apollo.mutate({
          mutation: this.mutDeleteCategory,
          variables: {
            catid: id
          },
          refetchQueries: [{
              query: this.quAllCategories
          }],
          errorPolicy: 'all'
        });        
    }

    deleteOrder(id: number): Observable<any> {
        console.log('Sending mutation: ', this.mutDeleteOrder);        
        return this.apollo.mutate({
          mutation: this.mutDeleteOrder,
          variables: {
            orderid: id
          },
          refetchQueries: [{
              query: this.quAllOrderNames
          }],
          errorPolicy: 'all'
        });                
    }
    
    deleteProduct(id: number): Observable<any> {
        console.log('Sending mutation: ', this.mutDeleteProd);        
        return this.apollo.mutate({
          mutation: this.mutDeleteProd,
          variables: {
            prodid: id
          },
          refetchQueries: [{
              query: this.quAllProducts
          }],
          errorPolicy: 'all'
        });        
    }

    addOrdername(name: string): Observable<any> {
        console.log('Sending mutation: ', this.mutAddOrderName);
        return this.apollo.mutate({
          mutation: this.mutAddOrderName,
          variables: {
            ordername: name
          },
          refetchQueries: [{
              query: this.quAllOrderNames
          }],
          errorPolicy: 'all'
        });
    }
    
    addCategory(name: string): Observable<any> {
        console.log('Sending mutation: ', this.mutAddCategory);
        return this.apollo.mutate({
          mutation: this.mutAddCategory,
          variables: {
            catname: name
          },
          refetchQueries: [{
              query: this.quAllCategories
          }],
          errorPolicy: 'all'
        });
    }
    
   saveCategory(category: InCat): Observable<any> {
        console.log('Sending mutation: ', this.mutSaveCategory);
        return this.apollo.mutate({
          mutation: this.mutSaveCategory,
          variables: {
            cat: category
          },
          refetchQueries: [{
              query: this.quAllCategories
          }],
          errorPolicy: 'all'
        });
    }    
    
   saveOrderName(ordername: InOrdername): Observable<any> {
        console.log('Sending mutation: ', this.mutSaveOrderName);
        return this.apollo.mutate({
          mutation: this.mutSaveOrderName,
          variables: {
            oname: ordername
          },
          refetchQueries: [
              { query: this.quAllOrderNames },
              { query: this.quOrder, variables: { id : this.lastOrderId } }
          ],
          errorPolicy: 'all'
        });       
   }
   
   saveProduct(product: InProd): Observable<any> {
        console.log('Sending mutation: ', this.mutSaveProduct);
        return this.apollo.mutate({
          mutation: this.mutSaveProduct,
          variables: {
            prod: product
          },
          refetchQueries: [{
              query: this.quAllProducts
          }],
          errorPolicy: 'all'
        });
    }    
    
    getDatas(type: string): Observable<any[]> {
        console.log('Getting data of '+type+' type');
        switch(type) {
            case "category":
                return this.getCategories();
            case "product":
                return this.getProducts();
            case "ordername":
                return this.getOrdernames();
            default:
                return null;
        }
    }
     
    deleteData(type: string, id: number): Observable<any> {
        switch(type) {
            case "category":
                return this.deleteCategory(id);
            case "product":
                return this.deleteProduct(id);
            case "ordername":
                return this.deleteOrder(id);
            default:
                return null;
        }        
    }

    addDatamaster(type: string, name: string): Observable<any> {
        console.log('Adding data of '+type+' type');
        switch(type) {
            case "category":
                return this.addCategory(name);
            case "ordername":
                return this.addOrdername(name);
            default:
                return null;
        }        
    }
    
    saveDatamaster(type: string, data: InDatamaster): Observable<any> {
        switch(type) {
            case "category":
                return this.saveCategory(data);
            case "ordername":
                return this.saveOrderName(data);
            default:
                return null;
        }                
    }

}

