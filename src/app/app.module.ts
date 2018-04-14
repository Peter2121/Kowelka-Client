import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
import { CategoryComponent } from './view/category.component';
import { ProductComponent } from './view/product.component';
import { OrdernameComponent } from './view/ordername.component';
import { OrderComponent } from './view/order.component';
import { DatamasterComponent } from './view/datamaster.component';
import { MessageComponent } from "./view/message.component"
import { GraphQLClient } from './model/GraphQLClient';
import { ShContextMenuModule } from 'ng2-right-click-menu';
import { Repository } from "./model/repository";
import { Broker } from "./model/broker";

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    ProductComponent,
    MessageComponent,
    OrdernameComponent,
    OrderComponent,
    DatamasterComponent
  ],
  imports: [
    BrowserModule, GraphQLClient, FormsModule, ShContextMenuModule, Angular2FontawesomeModule
  ],
  providers: [Repository, Broker],
  bootstrap: [AppComponent]
})
export class AppModule { }
