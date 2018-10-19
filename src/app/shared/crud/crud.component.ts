import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { FormGroup, Validators} from '@angular/forms';

import { CrudService } from '../crud.service';
import { DataModel } from '../data.model';
import * as jsPDF from "jspdf";
import {Filemanagement} from "../../common/filemanagement";
import {UploadComponent} from "./upload/upload.component";
@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  @ViewChild('content')
  content: ElementRef;

  @Input()
  title: string;

  @Input()
  data: any;

  @Input()
  service: CrudService;

  @Input()
  initItem: any;

  @Input()
  initForm: FormGroup;

  @Input()
  dataModelList: DataModel[];

  crudType = 'upload';

  errors: any = {};

  constructor(){
  }

  ngOnInit(){
  }

  dataChanged($event){
    //this.data = this.data.concat($event);
  }

  handleErrors(allErrors: any = {}) {
    this.errors = allErrors;
  }


  public downloadPDF($event:any){
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDF(this.content.nativeElement.innerHTML);

  }



}