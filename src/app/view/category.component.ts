import { Component, OnInit } from "@angular/core";
import { DatamasterComponent } from "./datamaster.component";

@Component({
    selector: "category",
    moduleId: module.id,
    templateUrl: "datamaster.component.html",
    providers: []
})

export class CategoryComponent extends DatamasterComponent implements OnInit {
    
    ngOnInit() {
        super.setDataType("category");
        super.ngOnInit();
    }
    
}
