import { Component } from "@angular/core";
import { Broker } from "../model/broker";
import { Subscription } from 'rxjs/Subscription';

export enum Level {
    success,
    info,
    warning,
    danger
}

export class Message {
    public level: Level;
    public message: string;
    constructor(lev : Level, mess : string) {
        this.level=lev;
        this.message=mess;
    }
}

@Component({
    selector: "message",
    moduleId: module.id,
    templateUrl: "message.component.html",
    providers: []
})

export class MessageComponent {
    
    public subscription: Subscription;
    public message: Message;
    public Level: typeof Level=Level;

    constructor(private broker : Broker) {
        this.message = new Message(Level.success,"Ready");
        this.subscription = this.broker.getMessage().subscribe(mess => { 
            this.message = mess;
            });
    }
    
}

