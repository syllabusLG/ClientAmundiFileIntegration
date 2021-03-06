import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SalarieService} from "./salarie.service";
import {Salarie} from "../shared/salarie.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {saveAs} from 'file-saver';
import {Individus} from '../shared/individus.model';
import {CookieService} from 'ngx-cookie-service';


@Component({
  selector: 'app-salarie',
  templateUrl: './salarie.component.html',
  styleUrls: ['./salarie.component.css']
})
export class SalarieComponent implements OnInit {

  @ViewChild('reportSalarie')
  reportSalarie: ElementRef;

  pageSalaries: any;
  motCle: string = '';
  currentPage: number = 0;
  size: number = 20;
  pages: Array<number>;

  salaries: Salarie[];
  salarieForm: FormGroup;
  operation: string = '';
  selectedSalarie: Salarie;

    constructor(private salarieService: SalarieService,
                private cookieService: CookieService,
                private fb: FormBuilder,
                private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.initSalarie();
    this.salaries = this.changeIndividu(this.route.snapshot.data.salaries);
    this.loadSalaries();
  }

  createForm() {
    this.salarieForm = this.fb.group({
      employeeId: ['', Validators.required],
      employeeStatus: '',
      company_CD: '',
      hireDate: '',
      departDate: '',
      individu: ['', Validators.required],
    });
  }

  loadSalaries() {
    this.salarieService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data => {
        this.pageSalaries = data;
        this.pages = new Array(data['totalPages']);
      }, error => {
        console.log(error);
      });
  }

  searchSalarie(event:any) {
    this.motCle = event;
    this.loadSalaries();
  }

  gotoPage(i: number) {
    this.currentPage = i;
    this.loadSalaries();
  }

  updateSalarie() {
    let dateHire = this.selectedSalarie.hireDate;
    let dateDepart = this.selectedSalarie.departDate;

    if(dateHire || dateDepart)
    {
      if(dateHire && (dateHire.indexOf('-') > -1)){
        this.selectedSalarie.hireDate = this.fillDate(dateHire);
      }
      if(dateDepart && (dateDepart.indexOf('-') > -1)){
        this.selectedSalarie.departDate = this.fillDate(dateDepart);
      }
    }
    this.salarieService.update(this.selectedSalarie).subscribe(
      res => {
        this.cookieService.set('updateSalarie', this.selectedSalarie.employeeId);
        this.initSalarie();
        this.loadSalaries();
      }
    )
  }

  deleteSalarie() {
    this.salarieService.delete(this.selectedSalarie.employeeId).subscribe(
      res => {
        this.cookieService.set('deleteSalarie', this.selectedSalarie.employeeId);
        this.selectedSalarie = new Salarie();
        this.loadSalaries();
      }
    );
  }

  initSalarie() {
    this.selectedSalarie = new Salarie();
    this.createForm();
  }

  downloadFile(data: any) {
    let file = 'salaries_' + new Date() + '.csv';
    this.cookieService.set('salarieReportCSV', 'Telechargement du fichier: '+file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv'})
    saveAs(blob, file);
  }



  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    } else if((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  fillDate(date:any){
    if(date && (date.indexOf('-') > -1)) {
      let year = new Date(Date.parse(date)).getFullYear();
      let month = String(new Date(Date.parse(date)).getMonth() + 1);
      let day = String(new Date(Date.parse(date)).getDate());
      if (Number(day) >= 1 && Number(day) <= 9) {
        day = '0' + day;
      }
      if(Number(month) >= 1 && Number(month) <= 9) {
        month = '0' + month;
      }
      return day + '/' + month + '/' + year;
    }
  }
  changeIndividu(salaries: Salarie[]){
    for(let i = 0; i < salaries.length; i++){
      let individu: Individus = new Individus();
      individu.firstName = salaries[i].individu.firstName;
      individu.lastName = salaries[i].individu.lastName;
      salaries[i].individu = individu;
    }
    return salaries;
  }
}
