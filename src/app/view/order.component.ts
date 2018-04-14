import { Component, AfterContentInit } from "@angular/core";
import { Order } from "../model/order.model";
import { OrderLine } from "../model/orderline.model";
import { Repository } from "../model/repository";
import { Broker } from "../model/broker";
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Level, Message } from "../view/message.component"


@Component({
    selector: "order",
    moduleId: module.id,
    templateUrl: "order.component.html",
    providers: []
})

export class OrderComponent implements AfterContentInit {
    
    public order: Order = null;
    public curOrderline: OrderLine = null;
    private subscrDatatype: string = "ordername";
    public subsOrdername: Subscription;
    public subsProduct: Subscription;
    public selectedOrderId: number = 0;
    public addingProductId: number = 0;
    
    constructor(private repository: Repository, private broker: Broker) {}
    
    ngAfterContentInit() {
        this.subsOrdername = this.broker.getSelectDatamaster(this.subscrDatatype).subscribe(id => { 
            this.selectedOrderId = id;
            console.log('Showing order: '+this.selectedOrderId); 
            this.showOrder();
            });
        
        this.subsProduct = this.broker.getAddProduct().subscribe(id => {
            console.log('Adding product ' + id +' to order');
            this.addingProductId = id;
            this.addProduct();
            });        
        
    }
    
    showOrder() {
        if(this.selectedOrderId==0) return;
        this.repository.getOrder(this.selectedOrderId).subscribe((data) => {
            console.log('Received data for order: ' + data.name);
            this.order = data;
            console.log('Retreived order: ' + this.order.id + " " + this.order.name);
            });
    }
    
    addProduct() {
        if((this.selectedOrderId==0)||(this.addingProductId==0)) return;
        this.curOrderline = this.order.orderlines.find(ol => ol.product.id == this.addingProductId);
        if (this.curOrderline!=null) 
            this.repository.increaseOrderLine(this.addingProductId,this.selectedOrderId).subscribe((data) => {
            console.log('Result: ', data.data.incOrderLine);
            if(data.data.incOrderLine===true) this.broker.sendMessage(new Message(Level.success,"Successfully added product to order"));
            else this.broker.sendMessage(new Message(Level.warning,"Cannot add product to order"));
            },
            (error) => {
            console.log('Error adding product to order', error);
            this.broker.sendMessage(new Message(Level.danger,"There was an error adding product to order: "+error));
            });
        else this.repository.addOrderLine(this.addingProductId,1,this.selectedOrderId).subscribe((data) => {
            console.log('Result: ', data.data.addLineToOrder);
            if(data.data.addLineToOrder===true) this.broker.sendMessage(new Message(Level.success,"Successfully added product to order"));
            else this.broker.sendMessage(new Message(Level.warning,"Cannot add product to order"));
            },
            (error) => {
            console.log('Error adding product to order', error);
            this.broker.sendMessage(new Message(Level.danger,"There was an error adding product to order: "+error));
            });
    }
    
    removeProductBtn(idprod: number, idorder: number) {
        console.log('Removing product: ' + idprod + ' from order ' + idorder);
        this.repository.decreaseOrderLine(idprod,idorder).subscribe((data) => {
        console.log('Result: ', data.data.decOrderLine);
        if(data.data.decOrderLine===true) this.broker.sendMessage(new Message(Level.success,"Successfully removed product from order"));
        else this.broker.sendMessage(new Message(Level.warning,"Cannot remove product from order"));
        },
        (error) => {
        console.log('Error adding product to order', error);
        this.broker.sendMessage(new Message(Level.danger,"There was an error removing product from order: "+error));
        });
    }

    addProductBtn(idprod: number) {
        this.addingProductId = idprod;
        this.addProduct();
    }
    
    printOrder() {
        console.log('Printing order: '+this.order.id); 
        var printContents, popupWin;
        printContents = document.getElementById('order-content').innerHTML;
        popupWin = window.open('', '_blank', 'height=auto,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Printing...</title>
              <style>
                .noprint { visibility:hidden; }
                table.table-bordered { border: 1px solid black; border-collapse: collapse; }
                .bordered { border: 1px solid black; border-collapse: collapse; font-size:16px; }
              </style>
            </head>
            <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();        
    }
 
    ngOnDestroy() {
        this.subsOrdername.unsubscribe();
        this.subsProduct.unsubscribe();
    }    
       
}
