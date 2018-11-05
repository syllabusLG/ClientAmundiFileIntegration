import {Component, OnDestroy, OnInit, ViewEncapsulation,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  credentials =  {
    username: '',
    password: ''
  };
  constructor( private fb: FormBuilder,
               private cookieService: CookieService,
               private appservice: AppService,
               private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }
  login(){
    this.appservice.authenticate(this.credentials, ()=>{
      this.router.navigateByUrl('home/(contentOutlet:file)');
      this.cookieService.set('dateConnexion' , this.loginDate());
      console.log('----username--- '+ this.cookieService.get('username')+ ' date connexion '+ this.cookieService.get('dateConnexion'));
    })
  }
  loginDate(){
    let year =  new Date().getFullYear();
    let month = new Date().getMonth()+1;
    let day = new Date().getDate();
    return day+'/'+month+'/'+year;
  }
}
