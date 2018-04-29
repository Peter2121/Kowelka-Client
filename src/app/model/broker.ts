import { Injectable } from "@angular/core";
import { Message } from "../view/message.component";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class Broker {
    
    private subjAddProduct = new Subject<number>();
    private objSubjDatamasterSelect = new Object();
    private subjMessage = new Subject<Message>();
    
    addDatamasterSubject(name : string) {
        this.objSubjDatamasterSelect[name] = new Subject<number>();
    }

    getMessage(): Observable<Message> {
        return this.subjMessage.asObservable();
    }
    
    sendMessage(mess : Message) {
        this.subjMessage.next(mess);
    }

    sendSelectDatamaster(type : string, id : number) {
        console.log('Broker received: '+ type + " " + id.toString()); 
        if(id==null) this.objSubjDatamasterSelect[type].next();
        else this.objSubjDatamasterSelect[type].next(id);
    }
  
    getSelectDatamaster(type : string): Observable<number> {
        return this.objSubjDatamasterSelect[type].asObservable();
    }
    
    sendAddProduct(id : number) {
        console.log('Broker received id product: ' + id.toString()); 
        if((id==null)||(id===0)) return;
        else this.subjAddProduct.next(id);
    }
        
    getAddProduct(): Observable<number> {
        return this.subjAddProduct.asObservable();
    }
    
}
