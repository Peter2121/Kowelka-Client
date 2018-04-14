import { Component, OnDestroy, AfterContentInit } from "@angular/core";
import { Product } from "../model/product.model";
import { Repository } from "../model/repository";
import { Broker } from "../model/broker";
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Level, Message } from "../view/message.component"
import { IShContextMenuItem } from 'ng2-right-click-menu';

@Component({
    selector: "product",
    moduleId: module.id,
    templateUrl: "product.component.html",
    providers: []
})

export class ProductComponent implements AfterContentInit {
    
    private selectedCategoryId: number = 0;
    private selectedProduct: Product = null;
    private editingProduct: Product = null;
    public newProduct: string = "NewProd";    
    private products: Observable<Product[]>;
    public productsData: Product[];
    public productsDataFiltered: Product[];
    public items: IShContextMenuItem[];
    public subscription: Subscription;
    private subscrDatatype: string = "category";
    private operation: string;
    private operationEdit: string = "Edit";
    private operationAdd: string = "Add";
    private operationDelete: string = "Delete";
    
    constructor(private repository : Repository, private broker : Broker) { 
        this.items = [
            {
            label: this.operationEdit,
            onClick: this.editProduct
            },
            {
            label: this.operationDelete,
            onClick: this.deleteProduct
            }
        ];
        this.operation = this.operationAdd;
            
    }
    
    ngAfterContentInit() {
        this.products=this.repository.getProducts();
        this.products.subscribe(data => {
            this.productsData = data;
            this.filterProducts();
            });
        this.subscription = this.broker.getSelectDatamaster(this.subscrDatatype).subscribe(id => { 
            this.selectedCategoryId = id;
            this.operation = this.operationAdd;
            this.filterProducts();
            });        
    }
    
    getSelectedCategoryId(): number {
        return this.selectedCategoryId;
    }
    
    setSelectedCategoryId(id: number): void {
        this.selectedCategoryId=id;
    }
    
    filterProducts() {
        if(this.selectedCategoryId==0) this.productsDataFiltered = this.productsData;
        else this.productsDataFiltered = this.productsData.filter(p => p.catid == this.selectedCategoryId);
    }
    
    selectProduct(selectedId: number) {
        console.log('Selected product id: ' + selectedId);
        this.selectedProduct=this.productsData.find(p => p.id == selectedId);
        this.operation = this.operationAdd;
    }
    
    addProductToOrder(selectedId: number) {
        console.log('Adding product id: ' + selectedId);
        this.selectProduct(selectedId);
        this.broker.sendAddProduct(selectedId);
    }
    
    operationProduct() {
        if(this.operation == this.operationAdd) {
            if(this.selectedCategoryId==0) return;
            this.repository.addProduct(this.newProduct, this.selectedCategoryId).subscribe(data => {
              console.log('New prodId: ', data.data.addProdToDB);
              if(data.data.addProdToDB>0) this.broker.sendMessage(new Message(Level.success,"Added product: "+data.data.addProdToDB));
              else this.broker.sendMessage(new Message(Level.warning,"Error trying to add product"));
            },(error) => {
              this.broker.sendMessage(new Message(Level.danger,"Error trying to add product: "+error));
              console.log('There was an error adding category', error);
            });
        } 
        else if(this.operation == this.operationEdit) {
            this.editingProduct = new Product(this.selectedProduct.id, this.newProduct, this.selectedProduct.catname, this.selectedProduct.catid);
            this.repository.saveProduct(this.editingProduct).subscribe(data => {
                console.log('Result: ', data.data.saveProdToDB);
                if(data.data.saveProdToDB===true) this.broker.sendMessage(new Message(Level.success,"Edit product result: "+data.data.saveProdToDB));
                else this.broker.sendMessage(new Message(Level.warning,"Error trying to edit product"));
            },(error) => {
                console.log('There was an error saving category', error);
                this.broker.sendMessage(new Message(Level.danger,"Error trying to edit product: "+error));
            });            
        }
    }

    deleteProduct(event: any) {
        var id = event.dataContext.id;
        var parent = event.dataContext.dataObject;
        console.log('Trying to delete product: ', id);
        var delProduct : Product = parent.productsData.find(p => p.id === id);
        parent.newProduct = delProduct.name;
        parent.repository.deleteProduct(id).subscribe(data => {
          console.log('Result: ', data.data.removeProdFromDB);
          if(data.data.removeProdFromDB===true) parent.broker.sendMessage(new Message(Level.success,"Delete product result: "+data.data.removeProdFromDB));
          else parent.broker.sendMessage(new Message(Level.warning,"Delete product result: "+data.data.removeProdFromDB));
        },(error) => {
          console.log('There was an error deleting product', error);
          parent.broker.sendMessage(new Message(Level.danger,"Error trying to delete product: "+error));
        });
    }
    
    editProduct(event: any) {
        var id = event.dataContext.id;
        var parent = event.dataContext.dataObject;
        console.log('Want to edit product: ', id);
        parent.operation = parent.operationEdit;
        parent.selectedProduct=parent.productsData.find(p => p.id == id);
        parent.newProduct = parent.selectedProduct.name;
    }
        
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }    
    
}
