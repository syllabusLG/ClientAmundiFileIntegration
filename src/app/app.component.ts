import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {NavigationEnd, Router} from '@angular/router';
import {DEFAULT_INTERRUPTSOURCES, Idle} from "@ng-idle/core";
import {Keepalive} from "@ng-idle/keepalive";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  private isLogin = false;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(private appService: AppService,
              private router: Router,private idle: Idle, private keepalive: Keepalive){

    this.router.events.subscribe(
      ( event) : void => {
        if ( event instanceof NavigationEnd ) {
          this.isLogin = this.router.isActive( "/login", true );
        }
      }
    );
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(50);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.changeToLoginPage();
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.reset();
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  changeToLoginPage()
  {
    return this.router.navigateByUrl('/login');
  }


  ngOnInit(){
    if(!this.appService.authenticated){
      this.router.navigateByUrl('/login');
      this.isLogin = true;
    }else{
      this.router.navigateByUrl('home/(contentOutlet:file)');
    }
  }
  ngOnDestroy() {
    alert(`I'm leaving the app!`);
  }
}
