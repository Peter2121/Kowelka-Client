import { Component, OnInit, AfterContentInit } from "@angular/core";
import { Datamaster } from "../model/datamaster.model";
import { Repository } from "../model/repository";
import { Broker } from "../model/broker";
import { Observable } from 'rxjs/Observable';
import { Level, Message } from "../view/message.component"
import { IShContextMenuItem } from 'ng2-right-click-menu';


@Component({
    selector: "datamaster",
    moduleId: module.id,
    templateUrl: "datamaster.component.html",
    providers: []
})

export class DatamasterComponent implements OnInit, AfterContentInit {
    
    public selectedDatamaster: Datamaster = null;
    public editingDatamaster: Datamaster = null;
    public newDatamaster: string = "NewData";
    public observDatas: Observable<Datamaster[]>;
    public arrDatas: Datamaster[];
    public items: IShContextMenuItem[];
    private operation: string="";
    private operationEdit: string = "Edit";
    private operationAdd: string = "Add";
    private operationDelete: string = "Delete";
    protected DATATYPE: string = "";
    
    constructor(private repository: Repository, private broker: Broker) {}

    ngOnInit() {
        this.setupRightClickMenu();
        this.operation = this.operationAdd;        
    }
    
    ngAfterContentInit() {
        this.broker.addDatamasterSubject(this.DATATYPE);
        this.observDatas=this.repository.getDatas(this.DATATYPE);
        this.observDatas.subscribe(data => {
            this.arrDatas = data;
            });        
    }
    
    setDataType(datatype: string): void {
        this.DATATYPE=datatype;
    }
    
    getDataType(): string {
        return this.DATATYPE;
    }
    
    setupRightClickMenu() {
        this.items = [
            {
            label: this.operationEdit,
            onClick: this.editDatamaster
            },
            {
            label: this.operationDelete,
            onClick: this.deleteDatamaster
            }
        ];        
    }
    
    selectDatamaster(newDatamasterId: number) {
        console.log('Selected '+this.DATATYPE+' id: ', newDatamasterId);
        this.operation = this.operationAdd;
        if(newDatamasterId===0) {
            this.selectedDatamaster=null;
            this.broker.sendSelectDatamaster(this.DATATYPE, 0);
        }
        else {
            this.selectedDatamaster=this.arrDatas.find(c => c.id === newDatamasterId);
            this.broker.sendSelectDatamaster(this.DATATYPE, this.selectedDatamaster.id);
        }
    }
    
    operationDatamaster() {
        var ttype,value,property;
        var success: boolean=false;
        if(this.operation == this.operationAdd) {
            this.repository.addDatamaster(this.DATATYPE,this.newDatamaster).subscribe(data => {
              console.log('Operation result: ', JSON.stringify(data.data));              
              for(property in data.data) {
                value = data.data[property];
                ttype = typeof(value);
                console.log('property:'+property+' type:'+ttype+' value:'+data.data[property]);
                if((ttype=='number')&&(value>0)) {
                    success=true;
                    break;
                }
              }
              console.log('New '+this.DATATYPE+' id: ', value);              
              if(success==true) this.broker.sendMessage(new Message(Level.success,"Added "+this.DATATYPE+": "+value));
              else this.broker.sendMessage(new Message(Level.warning,"Error trying to add "+this.DATATYPE));
            },(error) => {
              console.log('There was an error adding '+this.DATATYPE, error);
              this.broker.sendMessage(new Message(Level.danger,"Error trying to add "+this.DATATYPE+": "+error));
            });
        }
        else if(this.operation == this.operationEdit) {
            this.editingDatamaster = new Datamaster(this.selectedDatamaster.id, this.newDatamaster);
            this.repository.saveDatamaster(this.DATATYPE,this.editingDatamaster).subscribe(data => {
                console.log('Operation result: ', JSON.stringify(data.data));
                for(property in data.data) {
                    value = data.data[property];
                    ttype = typeof(value);
                    console.log('property:'+property+' type:'+ttype+' value:'+data.data[property]);
                    if((ttype=='boolean')&&(value===true)) {
                        success=true;
                        break;
                    }
                }
                if (success == true) this.broker.sendMessage(new Message(Level.success, "Successfully edit "+this.DATATYPE));
                else this.broker.sendMessage(new Message(Level.warning,"Error trying to edit "+this.DATATYPE));
            },(error) => {
                console.log('There was an error saving '+this.DATATYPE, error);
                this.broker.sendMessage(new Message(Level.danger,"Error trying to edit "+this.DATATYPE+": "+error));
            });
        }
    }
        
    deleteDatamaster(event: any) {
        var id = event.dataContext.id;
        var parent = event.dataContext.dataObject;
        var ttype,value,property;
        var success: boolean=false;
        console.log('Trying to delete '+parent.DATATYPE+' : ', id);
        var delDatamaster: Datamaster = parent.arrDatas.find(c => c.id === id);
        parent.newDatamaster = delDatamaster.name;
        parent.repository.deleteData(parent.DATATYPE, id).subscribe(data => {
          console.log('Operation result: ', JSON.stringify(data.data));
          for(property in data.data) {
              value = data.data[property];
              ttype = typeof(value);
              console.log('property:'+property+' type:'+ttype+' value:'+data.data[property]);
              if((ttype=='boolean')&&(value===true)) {
                  success=true;
                  break;
              }
          }
          if(success==true) parent.broker.sendMessage(new Message(Level.success,"Successfully deleted "+parent.DATATYPE));
          else parent.broker.sendMessage(new Message(Level.warning,"Cannot delete "+parent.DATATYPE));
        },(error) => {
          console.log('There was an error deleting '+this.DATATYPE, error);
          parent.broker.sendMessage(new Message(Level.danger,"Error trying to delete "+parent.DATATYPE+": "+error));
        });
    }
    
    editDatamaster(event: any) {
        var id = event.dataContext.id;
        var parent = event.dataContext.dataObject;
        console.log('Want to edit '+parent.DATATYPE+': ', id);
        parent.operation = parent.operationEdit;
        parent.selectedDatamaster=parent.arrDatas.find(c => c.id === id);
        parent.newDatamaster=parent.selectedDatamaster.name;
        parent.broker.sendSelectDatamaster(parent.DATATYPE, parent.selectedDatamaster.id);
    }
     
}
