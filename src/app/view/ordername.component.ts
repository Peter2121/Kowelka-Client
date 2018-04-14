import { Component, OnInit } from "@angular/core";
import { DatamasterComponent } from "./datamaster.component";

@Component({
    selector: "ordername",
    moduleId: module.id,
    templateUrl: "ordername.component.html",
    providers: []
})

export class OrdernameComponent extends DatamasterComponent implements OnInit {
    
    ngOnInit() {
        super.setDataType("ordername");
        super.ngOnInit();
    }
    
}
